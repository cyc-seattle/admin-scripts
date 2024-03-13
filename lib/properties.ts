namespace Project {
    interface Properties {
        domain: string;
        directoryReportId: string;
    }
        
    export function readProperties(): Properties {
        const properties = PropertiesService.getScriptProperties();
        return {
            domain: properties.getProperty('DOMAIN'),
            directoryReportId: properties.getProperty('DIRECTORY_REPORT_ID')
        }
    }
}

function printProperties() {
    const properties = Project.readProperties();
    console.log("Project Properties", properties);
}