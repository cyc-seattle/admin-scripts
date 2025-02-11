DEPLOYMENT_NAME="live"
DEPLOYMENT_ID="AKfycbxWTdC1Sh1PsHAFykRHqgFSxg3k-0JjhN4jGHp-RUbmDPSaTeT6OwPLYRkMstIjtN8h"

.PHONY: default, deploy, push

default:
	@echo "Targets:"
	@echo "deploy - Deploys the project to the live deployment ID."

push:
	clasp push

deploy: push
	clasp deploy -d $(DEPLOYMENT_NAME) -i $(DEPLOYMENT_ID)
	@echo "Library: https://script.google.com/macros/library/d/1dtoKHehi1DHdJCptgwC7cvIRWGa-gHn6EB_TZDdufItlZ4WETsfjU6Ax/12"
	@echo "Web App: https://script.google.com/a/macros/cyccommunitysailing.org/s/$(DEPLOYMENT_ID)/exec"