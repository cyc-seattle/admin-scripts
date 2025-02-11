namespace Project {
    export class Directory {
        private domain: string;
        
        constructor(domain: string) {
            this.domain = domain;
        }

        
        public *listUsers() {
            let pageToken: string;
            let page: GoogleAppsScript.AdminDirectory.Schema.Users;

            do {
                page = AdminDirectory.Users.list({
                    domain: this.domain,
                    maxResults: 100,
                    pageToken: pageToken
                });
            
                const users = page.users;
                if (!users) {
                    console.warn("No users found");
                    return;
                }
            
                for (const user of users) {
                    yield user;
                }
                
                pageToken = page.nextPageToken;
            } while (pageToken);
        }

        public *listGroups() {
            let pageToken: string;
            let page: GoogleAppsScript.AdminDirectory.Schema.Groups;

            do {
                page = AdminDirectory.Groups.list({
                domain: this.domain,
                maxResults: 100,
                pageToken: pageToken
                });

                const groups = page.groups;
                if (!groups) {
                    console.warn("No groups found");
                    return;
                }

                for (const group of groups) {
                    yield group;
                }
                
                pageToken = page.nextPageToken;
            } while (pageToken);
        }
    }
}

function listUsers() {
    const properties = Project.getScriptProperties();
    const directory = new Project.Directory(properties.domain);
    for(const user of directory.listUsers()) {
        console.log("User", user);
    };
}

function listGroups() {
    const properties = Project.getScriptProperties();
    const directory = new Project.Directory(properties.domain);
    for(const group of directory.listGroups()) {
        console.log("Group", group);
    };
}