const properties = Project.readProperties();
const directory = new Project.Directory(properties.domain);
const report = new Project.Report(properties.directoryReportId);

interface EmailAlias {
    source: string;
    destination: string;
}

function stripDomain(email: string): string {
    return email.replace(properties.domain, "");
}

function *runUsersReport() {
    console.info("Starting Users Report");
    const aliases = [];

    report.withSheet("Users", (sheet) => {
        sheet.clearContents();
        sheet.appendRow([
            "User",
            "Primary Email",
            "Creation Time",
            "Last Login Time"
        ]);
        
        for (const user of directory.listUsers()) {
            console.log("User", user.name.fullName);

            sheet.appendRow([
                user.name.fullName,
                user.primaryEmail,
                user.creationTime,
                user.lastLoginTime,
            ]);

            for (const alias of user.aliases ?? []) {
                aliases.push({
                    source: alias,
                    destination: user.primaryEmail,
                });
            };
        }
    });

    return aliases;
}

function runGroupsReport(): EmailAlias[] {
    console.info("Starting Groups Report");
    const aliases = [];

    report.withSheet("Groups", (sheet) => {
        sheet.clearContents();
        sheet.appendRow([
            "Email",
            "Name",
            "Description",
            "Members Count"
        ]);
        
        for(const group of directory.listGroups()) {
            console.log("Group", group.name);

            const groupSettings = AdminGroupsSettings.Groups.get(group.email);
            console.log("Group Settings", groupSettings);

            sheet.appendRow([
                group.email,
                group.name,
                group.description,
                group.directMembersCount,
            ]);

            for (const alias of group.aliases ?? []) {
                aliases.push({
                    source: alias,
                    destination: group.email,
                });
            }
        };
    });

    return aliases;
}

function runEmailAliasesReport(aliases: EmailAlias[]) {
    const properties = Project.readProperties();
    const directory = new Project.Directory(properties.domain);
    const report = new Project.Report(properties.directoryReportId);

    report.withSheet("Email Aliases", (sheet) => {
        sheet.clearContents();
        sheet.appendRow(["Source", "Destination"]);

        for (const alias of aliases) {
            sheet.appendRow([
                alias.source,
                alias.destination,
            ]);
        }
    });
}

function runDirectoryReport() {
    const userAliases = runUsersReport();
    const groupAliases = runGroupsReport();
    runEmailAliasesReport([...userAliases, ...groupAliases]);
}