namespace Project {
    export class Report {
        private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

        constructor(spreadsheetId: string) {
            this.spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            console.log("Opened Spreadsheet", this.spreadsheet.getUrl());
        }

        public getOrCreateSheet(name: string) {
            const sheet = this.spreadsheet.getSheetByName(name);
            if (sheet) {
                return sheet;
            }

            return this.spreadsheet.insertSheet(name);
        }

        // Gets or creates a sheet by name, activates it, and then protects it with the current time after the report
        // is done.
        public withSheet(name: string, func: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => void) {
            const sheet = this.getOrCreateSheet(name);
            sheet.activate();
            console.log("Opened sheet", sheet.getName());

            func(sheet);

            const timestamp = Utilities.formatDate(new Date(), "PST", "yyy-MM-dd HH:mm:ss");
            const protection = sheet.protect();
            protection
                .setDescription(`Updated by automated script at ${timestamp}`)
                .removeEditors(protection.getEditors())
                .setWarningOnly(true);

            console.log("Set sheet protection at", timestamp);
        }
    }
}