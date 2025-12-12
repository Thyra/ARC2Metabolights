# ARC2Metabolights
This is a script to save me some clicks when submitting data from an [ARC](https://arc-rdm.org/) to the [MetaboLights database](https://www.ebi.ac.uk/metabolights/) using the MetaboLights's DB [REST API](https://www.ebi.ac.uk/metabolights/ws/api/spec.html#!/spec).
It's currently just a [deno](https://deno.com/) script but hopes to maybe one day grow into a fully automated self-service portal, depending on how many submissions to MetaboLights I have to do ([Manual Work is a Bug!](https://queue.acm.org/detail.cfm?id=3197520&lid=92091woucb4y)).

## CLI Usage

Command-line arguments:
- `--study-id` is the MetaboLights study identifier (e.g., `MTBLS123` or `REQ20251201215354`)
- `--user-token` is your MetaboLights API user token which you can find at the bottom of your account details (https://www.ebi.ac.uk/metabolights/myAccount )

### clear-contacts

You can remove all contacts from a MetaboLights study using the CLI.
Mostly useful after a messed-up import.

```sh
deno run --allow-net cli/arc2metabolights.ts clear-contacts --study-id <study-id> --user-token <your-token>
```

### import-contacts

Import contacts from an ARC ISA JSON file (investigation, study, or assay) into a MetaboLights study:

```sh
deno run --allow-net --allow-read cli/arc2metabolights.ts import-contacts --study-id <study-id> --user-token <your-token> --file <arc-isa.json> --import-from <section>
```

- `--file` is the path to your ARC ISA JSON file (e.g., `dominik.json`)
- `--import-from` is the investigation (`./`), a study (e.g., `studies/TalinumGenomeDraft/`), or an assay (e.g., `assays/RNASeq/`) to import contacts from
