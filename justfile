DEPLOYMENT_NAME := "live"
DEPLOYMENT_ID := "AKfycbxWTdC1Sh1PsHAFykRHqgFSxg3k-0JjhN4jGHp-RUbmDPSaTeT6OwPLYRkMstIjtN8h"

# Push code to Google Apps Script
push:
    npm run clasp push

# Deploy the project to the live deployment ID
deploy: push
    npm run clasp deploy -d {{DEPLOYMENT_NAME}} -i {{DEPLOYMENT_ID}}
    @echo "Library: https://script.google.com/macros/library/d/1dtoKHehi1DHdJCptgwC7cvIRWGa-gHn6EB_TZDdufItlZ4WETsfjU6Ax/12"
    @echo "Web App: https://script.google.com/a/macros/cyccommunitysailing.org/s/{{DEPLOYMENT_ID}}/exec"
