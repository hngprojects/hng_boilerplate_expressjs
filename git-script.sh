#!/bin/bash

if [ -n "$1" ]; then
  branch="$1"
else
  branch=$(git rev-parse --abbrev-ref HEAD)
fi

# Fetch latest changes from the specified or current branch
git fetch origin "$branch"

# Show the difference between the current branch and the fetched changes
git diff HEAD..FETCH_HEAD

# Prompt the user for input
read -p "Want to merge? (Y/n) " answer

# Default answer to 'y' if no input is provided
if [[ -z "$answer" ]]; then
  answer="y"
fi

# Convert the answer to lowercase to handle both 'Y' and 'y'
answer=$(echo "$answer" | tr '[:upper:]' '[:lower:]')

# Check if the answer is 'y'
if [[ "$answer" == "y" ]]; then
  # Merge the changes if the answer is 'y'
  git merge FETCH_HEAD
else
  echo "Merge aborted."
fi
