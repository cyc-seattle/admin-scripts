const properties = Project.getScriptProperties();
const directory = new Project.Directory(properties.domain);
const report = new Project.Report(properties.directoryReportId);

interface EmailAlias {
    source: string;
    destination: string;
}

function stripDomain(email: string): string {
    return email.replace(properties.domain, "");
}

function runUsersReport() {
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
            }
        }
    });

    return aliases;
}

function assertGroupSetting(group: GoogleAppsScript.AdminGroupsSettings.Schema.Groups, key: string, value: any) {
    const obj = <any>group;
    if (!(key in obj) || obj[key] != value) {
        console.warn(Utilities.formatString("Group %s does not have value %s for %s. Setting it!", group.name, value, key));
        obj[key] = value;
        return true;
    }

    return false;
}

function runGroupsReport(): EmailAlias[] {
    console.info("Starting Groups Report");
    const aliases = [];

    report.withSheet("Groups", (sheet) => {
        sheet.clearContents();
        sheet.appendRow([
            "Name",
            "Email",
            "Size",

            "Allow external members",
            "Collaborative Inbox",
            "Can post as group",
            "Archive messages",

            "Discover Group",
            "Join Group",
            "View Messages",
            "Post Messages",
            "View Membership",
            "Moderate Members",
            "Moderate Content",
            "Assist Content",
            "Moderation Level",
            "Spam Moderation",
            "Reply To"
        ]);
        
        for(const group of directory.listGroups()) {
            console.log("Group", group.name);

            const groupSettings = AdminGroupsSettings.Groups.get(group.email);

            const assertions = [
                assertGroupSetting(groupSettings, "whoCanDiscoverGroup", "ALL_IN_DOMAIN_CAN_DISCOVER"),
                assertGroupSetting(groupSettings, "whoCanJoin", "INVITED_CAN_JOIN"),
                assertGroupSetting(groupSettings, "whoCanViewGroup", "ALL_MEMBERS_CAN_VIEW"),
                assertGroupSetting(groupSettings, "whoCanViewGroup", "ALL_MEMBERS_CAN_VIEW"),
                assertGroupSetting(groupSettings, "whoCanViewMembership", "ALL_MEMBERS_CAN_VIEW"),
                assertGroupSetting(groupSettings, "whoCanModerateMembers", "OWNERS_AND_MANAGERS"),
            ];

            if (assertions.some(Boolean)) {
                console.log("Writing group", group.name);
                AdminGroupsSettings.Groups.update(groupSettings, group.email);
            }

            sheet.appendRow([
                group.name,
                group.email,
                Number.parseInt(group.directMembersCount),

                JSON.parse(groupSettings.allowExternalMembers),
                JSON.parse(groupSettings.enableCollaborativeInbox),
                JSON.parse(groupSettings.membersCanPostAsTheGroup),
                JSON.parse(groupSettings.isArchived),

                groupSettings.whoCanDiscoverGroup,
                groupSettings.whoCanJoin,

                groupSettings.whoCanViewGroup,
                groupSettings.whoCanPostMessage,
                groupSettings.whoCanViewMembership,

                groupSettings.whoCanModerateMembers,
                groupSettings.whoCanModerateContent,
                groupSettings.whoCanAssistContent,

                groupSettings.messageModerationLevel,
                groupSettings.spamModerationLevel,
                groupSettings.replyTo,
            ]);

            for (const alias of group.aliases ?? []) {
                aliases.push({
                    source: alias,
                    destination: group.email,
                });
            }
        }
    });

    return aliases;
}

function runEmailAliasesReport(aliases: EmailAlias[]) {
    const properties = Project.getScriptProperties();
    const directory = new Project.Directory(properties.domain);
    const report = new Project.Report(properties.directoryReportId);

    report.withSheet("Email Aliases", (sheet) => {
        sheet.clearContents();
        sheet.appendRow(["Source", "Destination"]);

        for (const alias of aliases) {
            sheet.appendRow([
                stripDomain(alias.source),
                stripDomain(alias.destination),
            ]);
        }
    });
}

function runDirectoryReport() {
    const userAliases = runUsersReport();
    const groupAliases = runGroupsReport();
    runEmailAliasesReport([...userAliases, ...groupAliases]);
}