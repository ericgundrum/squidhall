#!/bin/bash
python3 tools/sqs/sqs.py optimize objects/*.babylon
python3 tools/sqs/sqs.py generate *.module.json