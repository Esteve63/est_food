#!/bin/bash

# Checking if revision message is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [revision_message]"
    exit 1
fi

REVISION_MESSAGE=$1

alembic revision --autogenerate -m "$REVISION_MESSAGE"