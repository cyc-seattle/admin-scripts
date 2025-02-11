# CYC Community Sailing Center - Admin Scripts

This project contains Google Apps Scripts to aid in the administration of
CYC Community Sailing Center's Google Workspace account.

It uses the [clasp](https://github.com/google/clasp) tool to enable local 
development and testing of scripts with TypeScript.

## Contributing

In order to contribute to this project, you will need a Google account with access to the Apps Script referenced in
the `.clasp.json` file. You should be able to test the project with `clasp run` and push changes with `clasp push`.

Only users on the `cyccommunitysailing.org` domain can actually deploy new versions, however.  This can be done by running
`make deploy` for the proper settings.

## Authorization

Some of the scripts in this project authorize to various services, such as Clubspot. Authorization secrets are stored
in *User Properties* using the [Properties Service](https://developers.google.com/apps-script/reference/properties/properties-service).

Google provides no UI for editing User Properties of a script, so a simple one is located in `config/index.html`. Just
open that file in your browser locally and submit the values.
