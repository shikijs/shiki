#!/bin/bash

# This scripts reads the JSON file under tmp/errors.grammar.json.
# For every entry it validates if an existing issue exists for the same error based on the issue title.
# If the issue exists it does nothing.
# If the issue does not exist it creates a new issue.
# For everything it uses the GitHub CLI.

# Check if the environment variable CI is true
if [ "$CI" = false ]; then
  echo "This script should only be run in a CI environment"
  exit 1
fi

# Check if the GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "gh could not be found"
    exit
fi

# Check if the GitHub CLI is logged in
if ! gh auth status &> /dev/null
then
    echo "gh is not logged in"
    exit
fi

# Parse the JSON file and create an issue for every error

JSON=$(cat tmp/errors.grammar.json)
ERROR_COUNT=$(echo "$JSON" | jq '.errors | length')

for ((index=0; index < $ERROR_COUNT; index++)); do
  LANGUAGE=$(echo "$JSON" | jq -r '.[] | .['"$index"'].language')
  MESSAGE=$(echo "$JSON" | jq -r '.[] | .['"$index"'].message')
  STEP=$(echo "$JSON" | jq -r '.[] | .['"$index"'].step')
  URL=$(echo "$JSON" | jq -r '.[] | .['"$index"'].url')

  ISSUE_TITLE=$"Grammar update for $LANGUAGE failed"
  ISSUE_BODY=$"
  ## Auto-created issue
  
  The grammar update for **'$LANGUAGE'** failed with the following error:
  
  **$MESSAGE**
  
  The error occurred in the following step:
  
  **$STEP**
  
  The error occurred in the following file:
  
  $URL
  
  Please fix the error and create a pull request to update the grammar."
  ISSUE_LABELS=$"grammar,bug"

  # Check if an issue with the same title exists$
  if gh issue list --json number,title,state | jq -r '.[] | select(.title == "'"${ISSUE_TITLE}"'" and .state == "OPEN")' | grep -q '[0-9]\+' ; then
    echo "Issue already exists for $LANGUAGE, doing nothing"
  else
    echo "Creating issue for $LANGUAGE"
    gh issue create --title "${ISSUE_TITLE}" --body "${ISSUE_BODY}" --label "${ISSUE_LABELS}"
  fi
done





