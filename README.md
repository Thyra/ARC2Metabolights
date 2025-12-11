# ARC2Metabolights
This is a script to save me some clicks when submitting data from an [ARC](https://arc-rdm.org/) to the [MetaboLights database](https://www.ebi.ac.uk/metabolights/).
It uses the MetaboLights's DB [REST API](https://www.ebi.ac.uk/metabolights/ws/api/spec.html#!/spec).
It's currently just a [deno](https://deno.com/) script but hopes to maybe one day grow into a fully automated self-service portal, depending on how many submissions to MetaboLights I have to do ([Manual Work is a Bug!](https://queue.acm.org/detail.cfm?id=3197520&lid=92091woucb4y)).

## CLI Usage

For all commands you need your user API token which you can find at the bottom of your account details (https://www.ebi.ac.uk/metabolights/myAccount )

### clear-contacts

You can remove all contacts from a MetaboLights study using the CLI:

```sh
deno run --allow-net cli/arc2metabolights.ts clear-contacts --study-id <study-id> --user-token <your-token>
```

- `--study-id` is the MetaboLights study identifier (e.g., `MTBLS123`)
- `--user-token` is your MetaboLights API user token

This command will print the contacts found and attempt to delete each one from the study using the MetaboLights API.
