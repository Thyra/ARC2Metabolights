/**
 * MetaboLights API contact utility functions.
 */

import type { ARC, MetaboLights, Comment } from "./types.ts";

export async function clearContacts(studyId: string, userToken: string): Promise<void> {
  // 1. Fetch contacts
  const contactsUrl = `https://www.ebi.ac.uk/metabolights/ws/studies/${studyId}/contacts`;
  const contactsResponse = await fetch(contactsUrl, {
    method: "GET",
    headers: {
      "User-Token": userToken,
      "Accept": "application/json"
    }
  });

  if (!contactsResponse.ok) {
    const errorJson = await contactsResponse.json();
    throw new Error("Failed to fetch contacts: " + errorJson);
  }

  const contactsJson = await contactsResponse.json();
  const contacts = contactsJson.contacts;
  console.log("Contacts found:");
  console.log(
    contacts.map((c: any) => `${c.firstName} ${c.lastName}`)
  );

  // 2. Delete each contact by index
  for (let i = 0; i < contacts.length; i++) {
    const deleteUrl = `https://www.ebi.ac.uk/metabolights/ws/studies/${studyId}/contacts?contact_index=${i}`;
    await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "User-Token": userToken,
        "Accept": "application/json"
      }
    });
  }

  console.log(`All contacts deleted from study ${studyId}.`);
}

/**
 * Converts an ARC.Contact to a MetaboLights.Contact.
 * Special handling: ORCID is mapped from ARC comments (name: "ORCID") to MetaboLights comments (name: "Study Person ORCID").
 */
export function convertContact(arcContact: ARC.Contact): MetaboLights.Contact {
  // Map comments, handling ORCID specially
  const comments: Comment[] = [];

  // Map ORCID from ARC to MetaboLights comment name
  if (arcContact.comments) {
    for (const c of arcContact.comments) {
      if (c.name === "ORCID") {
        comments.push({
          name: "Study Person ORCID",
          value: c.value.replace(/^https?:\/\/orcid\.org\//, "")
        });
      } else {
        comments.push({ ...c });
      }
    }
  }

  return {
    firstName: arcContact.firstName ?? "",
    lastName: arcContact.lastName ?? "",
    midInitials: arcContact.midInitials,
    email: arcContact.email,
    affiliation: arcContact.affiliation,
    address: arcContact.address,
    phone: arcContact.phone,
    fax: arcContact.fax,
    roles: arcContact.roles?.map(r => ({
      annotationValue: r.annotationValue,
      termSource: r.termSource
        ? { name: r.termSource }
        : undefined,
      termAccession: r.termAccession,
      comments: [],
    })),
    comments,
  };
}

/**
 * Imports contacts from an ARC ISA JSON file and pushes them to a MetaboLights study.
 * @param studyId - The MetaboLights study identifier
 * @param userToken - The user's authentication token
 * @param file - Path to arc-isa.json file
 * @param importFrom - Study/Assay/Investigation @id to import the contacts from (e.g. './', 'studies/TalinumGenomeDraft/', or 'assays/RNASeq/')
 */
export async function importContacts(
  studyId: string,
  userToken: string,
  file: string,
  importFrom: string
): Promise<void> {
  // Read and parse the ARC ISA JSON file
  const jsonText = await Deno.readTextFile(file);
  const arcIsa = JSON.parse(jsonText);

  // Find the referenced investigation, study, or assay
  let source: any = undefined;
  if (importFrom === "./" || importFrom === "." || importFrom === "") {
    source = arcIsa.investigation || arcIsa;
  } else if (importFrom.startsWith("studies/")) {
    const studyIdRef = importFrom.replace(/^studies\//, "").replace(/\/$/, "");
    source = (arcIsa.studies || []).find((s: any) =>
      (s["@id"] && (s["@id"] === importFrom || s["@id"] === studyIdRef))
      || (s["identifier"] && s["identifier"] === studyIdRef)
    );
  } else if (importFrom.startsWith("assays/")) {
    const assayIdRef = importFrom.replace(/^assays\//, "").replace(/\/$/, "");
    source = (arcIsa.assays || []).find((a: any) =>
      (a["@id"] && (a["@id"] === importFrom || a["@id"] === assayIdRef))
      || (a["identifier"] && a["identifier"] === assayIdRef)
    );
  }

  if (!source) {
    throw new Error(`Could not find source for import-from: ${importFrom}`);
  }

  // Get contacts from the source
  const contacts: ARC.Contact[] = source.people || source.contacts || [];
  if (!contacts.length) {
    console.log("No contacts found to import.");
    return;
  }

  // Convert ARC contacts to MetaboLights contacts
  const mtblContacts = contacts.map(convertContact);

  // Push contacts to MetaboLights study via POST
  const postUrl = `https://www.ebi.ac.uk/metabolights/ws/studies/${studyId}/contacts`;
  const response = await fetch(postUrl, {
    method: "POST",
    headers: {
      "User-Token": userToken,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ contacts: mtblContacts })
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(
      `Failed to import contacts: ${response.status} ${response.statusText}\n` +
      (errorJson ? JSON.stringify(errorJson, null, 2) : "")
    );
  }

  console.log(`Imported ${mtblContacts.length} contacts to study ${studyId}.`);
}
