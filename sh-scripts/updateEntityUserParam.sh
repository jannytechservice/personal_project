#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Define variables
TABLE_NAME="ADMdevDatabaseStack-EntityUserTableD84FD34A-1TMVG4VC980HU"
ATTRIBUTE_NAME="paymentsEnabled"
ATTRIBUTE_VALUE="true"
PROFILE_NAME="admiin"

# Retrieve the primary key schema
PARTITION_KEY="entityId"
SORT_KEY="userId"

# Perform a scan operation and log the results
echo "Scanning table $TABLE_NAME..."
SCAN_RESULTS=$(aws dynamodb scan --table-name $TABLE_NAME --attributes-to-get $PARTITION_KEY $SORT_KEY --query "Items[*].{$PARTITION_KEY: $PARTITION_KEY.S, $SORT_KEY: $SORT_KEY.S}" --output text --profile $PROFILE_NAME)
echo "Scan results:"
echo "$SCAN_RESULTS"

# Update all records in the entityUser table
echo "$SCAN_RESULTS" | tr '\t' '\n' | while read -r entityId userId; do
  if [ -z "$userId" ]; then
    echo "Skipping record with empty userId"
    continue
  fi
  echo "Updating record with entityId: $entityId, userId: $userId"
  aws dynamodb update-item \
    --table-name $TABLE_NAME \
    --key "{\"$PARTITION_KEY\": {\"S\": \"$entityId\"}, \"$SORT_KEY\": {\"S\": \"$userId\"}}" \
    --update-expression "SET $ATTRIBUTE_NAME = :val" \
    --expression-attribute-values "{\":val\": {\"BOOL\": $ATTRIBUTE_VALUE}}" \
    --profile $PROFILE_NAME
  echo "Updated record with entityId: $entityId, userId: $userId"
done
