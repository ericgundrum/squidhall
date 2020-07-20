#!/bin/sh
# This script generates code for all modules and merges the content files.

mkdir -p libs/modules/content

python3 tools/sqs/sqs.py generate world.module.json
python3 tools/sqs/sqs.py generate room-squidhall.module.json
python3 tools/sqs/sqs.py generate room-wheketere.module.json
python3 tools/sqs/sqs.py generate room-idiosepius.module.json
python3 tools/sqs/sqs.py generate furniture.module.json
python3 tools/sqs/sqs.py generate content/*.content.module.json
python3 tools/sqs/sqs.py filter libs/modules/ MergeContentJS libs/modules/content/*.js
