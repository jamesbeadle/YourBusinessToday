#!/usr/bin/env bash
# Takes one off-site backup of a Supabase project: the whole database as a
# pg_dump custom archive plus every Storage object, packed into one tar and
# encrypted with a passphrase. Supabase's own backups live inside the project
# and die with it; this copy does not. See docs/backup-and-recovery.md.
#
# Needs pg_dump at the server's major version (17 for current projects), gpg,
# and — when the project has Storage buckets — the AWS CLI.
#
# Environment:
#   SUPABASE_DB_URL        Session pooler connection string (Dashboard → Connect)
#   BACKUP_PASSPHRASE      the key; keep a copy outside GitHub or the backup is lost with it
#   BACKUP_NAME            prefix for the file, e.g. yourbusinesstoday
#   Storage (all three, or set SKIP_STORAGE=true for a project with no buckets):
#   SUPABASE_URL           https://<ref>.supabase.co
#   SUPABASE_REGION        the project's region, e.g. eu-west-2
#   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY   Storage → S3 access keys
#
# Usage: ./scripts/backup-supabase.sh <output directory>
# Writes <output directory>/<name>-<UTC timestamp>.tar.gpg and prints its path.

set -euo pipefail

outputDirectory="${1:?Usage: ./scripts/backup-supabase.sh <output directory>}"
: "${SUPABASE_DB_URL:?SUPABASE_DB_URL is not set}"
: "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE is not set}"
: "${BACKUP_NAME:?BACKUP_NAME is not set}"

timestamp=$(date -u +%Y-%m-%dT%H%MZ)
workDirectory=$(mktemp -d)
trap 'rm -rf "$workDirectory"' EXIT

dumpDatabase() {
	pg_dump "$SUPABASE_DB_URL" --format=custom --no-owner --file="$workDirectory/database.dump"
	pg_restore --list "$workDirectory/database.dump" > "$workDirectory/database.contents"
	echo "Database: $(grep -c 'TABLE DATA' "$workDirectory/database.contents") tables of data"
}

copyStorage() {
	if [ "${SKIP_STORAGE:-false}" = "true" ]; then
		echo "Storage: skipped"
		return
	fi
	: "${SUPABASE_URL:?SUPABASE_URL is not set (or set SKIP_STORAGE=true)}"
	: "${SUPABASE_REGION:?SUPABASE_REGION is not set}"
	local endpoint="$SUPABASE_URL/storage/v1/s3"
	local buckets
	buckets=$(aws s3api list-buckets --endpoint-url "$endpoint" --region "$SUPABASE_REGION" \
		--query 'Buckets[].Name' --output text)
	for bucket in $buckets; do
		aws s3 sync "s3://$bucket" "$workDirectory/storage/$bucket" \
			--endpoint-url "$endpoint" --region "$SUPABASE_REGION" --only-show-errors
	done
	echo "Storage: $(find "$workDirectory/storage" -type f 2>/dev/null | wc -l) objects in $(echo "$buckets" | wc -w) buckets"
}

encryptArchive() {
	local archivePath="$outputDirectory/$BACKUP_NAME-$timestamp.tar.gpg"
	mkdir -p "$outputDirectory"
	tar -C "$workDirectory" -cf - . |
		gpg --batch --yes --symmetric --cipher-algo AES256 \
			--passphrase-fd 3 --output "$archivePath" 3<<<"$BACKUP_PASSPHRASE"
	echo "$archivePath"
}

dumpDatabase
copyStorage
encryptArchive
