#!/usr/bin/env deno run --allow-read

import { Command } from "@cliffy/command"

await new Command()
  .name("arc2metabolights")
  .description("Command Line Tool for MetaboLights ARC integration")
  .version("0.1.0")
  .command("clear-contacts", "Clear contacts for a given study")
    .option("-s, --study-id <study-id:string>", "MetaboLights study identifier", { required: true })
    .option("-u, --user-token <user-token:string>", "User authentication token", { required: true })
    .action((options) => {
      console.log("clear-contacts called with:", options);
    })
  .command("import-contacts", "Import contacts from an ARC ISA JSON file")
    .option("-s, --study-id <study-id:string>", "MetaboLights study identifier", { required: true })
    .option("-u, --user-token <user-token:string>", "User authentication token", { required: true })
    .option("-f, --file <file:string>", "Path to arc-isa.json file", { required: true })
    .option("-i, --import-from <import-from:string>", "Source string for import", { required: true })
    .action((options) => {
      console.log("import-contacts called with:", options);
    })
  .parse(Deno.args);
