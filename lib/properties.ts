namespace Project {
    interface ScriptProperties {
        domain: string;
        directoryReportId: string;
    }

    interface ClubspotProperties {
        email: string;
        password: string;
        clubId: string;
    }

    interface UserProperties {
        clubspot: ClubspotProperties;
    }

    interface Properties {
        script: ScriptProperties;
        user: UserProperties;
    }

    export function getUserProperties(): UserProperties {
        const properties = PropertiesService.getUserProperties().getProperties();
        return {
            clubspot: {
                email: properties["CLUBSPOT_EMAIL"],
                password: properties["CLUBSPOT_PASSWORD"],
                clubId: properties["CLUBSPOT_CLUB_ID"]
            }
        }
    }

    export function setUserProperties(properties: UserProperties) {
        const flattenedProperties = {
            "CLUBSPOT_EMAIL": properties.clubspot.email,
            "CLUBSPOT_PASSWORD": properties.clubspot.password,
            "CLUBSPOT_CLUB_ID": properties.clubspot.clubId
        }
        PropertiesService.getUserProperties().setProperties(flattenedProperties);
    }

    export function getScriptProperties(): ScriptProperties {
        const properties = PropertiesService.getScriptProperties().getProperties();
        return {
            domain: properties['DOMAIN'],
            directoryReportId: properties['DIRECTORY_REPORT_ID']
        }
    }

    export function getProperties(): Properties {
        return {
            script: getScriptProperties(),
            user: getUserProperties(),
        }
    }
}

function printProperties() {
    const properties = Project.getProperties();
    console.log("Project Properties", properties);
}