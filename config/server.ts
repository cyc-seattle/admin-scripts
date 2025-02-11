// Handle the form post from index.html by setting user properties.
function doPost(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
    Project.setUserProperties({
        clubspot: {
            email: e.parameter["clubspot_email"],
            password: e.parameter["clubspot_password"],
            clubId: e.parameter["clubspot_club_id"]
        }
    });
    
    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
}