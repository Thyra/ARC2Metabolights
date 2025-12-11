/**
 * MetaboLights API utility functions.
 */

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
