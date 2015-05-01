#! /bin/bash
# inspired by http://stackoverflow.com/questions/11353547/bash-string-extraction-manipulation

# http://www.davidpashley.com/articles/writing-robust-shell-scripts/
set -o nounset
set -o errexit
set -o pipefail
set -x

# stackoverflow.com/questions/7216358/date-command-on-os-x-doesnt-have-iso-8601-i-option
function nowString {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

NOW=$(nowString)

prod_domain=$1
echo 'prod_domain='$prod_domain
# prod_url="mongodb://...:...@...:.../..."
prod_pattern="mongodb://([^:]+):([^@]+)@([^:]+):([^/]+)/(.*)"
prod_url=$(meteor mongo  --url $prod_domain | tr -d '\n')
[[ ${prod_url} =~ ${prod_pattern} ]]
PROD_USER="${BASH_REMATCH[1]}"
PROD_PASSWORD="${BASH_REMATCH[2]}"
PROD_HOST="${BASH_REMATCH[3]}"
PROD_PORT="${BASH_REMATCH[4]}"
PROD_DB="${BASH_REMATCH[5]}"
PROD_DUMP_DIR=dumps/${NOW}
mkdir -p dumps
echo "User: $PROD_USER, pass: $PROD_PASSWORD, Host: $PROD_HOST, port:$PROD_HOST, db:$PROD_DB"

# local_url="mongodb://...:.../..."
local_pattern="mongodb://([^:]+):([^/]+)/(.*)"
local_url=$(meteor mongo --url | tr -d '\n')
[[ ${local_url} =~ ${local_pattern} ]]
LOCAL_HOST="${BASH_REMATCH[1]}"
LOCAL_PORT="${BASH_REMATCH[2]}"
LOCAL_DB="${BASH_REMATCH[3]}"



mongodump --host ${PROD_HOST} --port ${PROD_PORT} --username ${PROD_USER} --password ${PROD_PASSWORD} --db ${PROD_DB} --out ${PROD_DUMP_DIR}
mongorestore --port ${LOCAL_PORT} --host ${LOCAL_HOST} --db ${LOCAL_DB} ${PROD_DUMP_DIR}/${PROD_DB}
