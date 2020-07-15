#!/bin/bash
# This script runs the asset pipeline for all the content files.
python3 tools/sqs/sqs.py pipeline content/*.content.module.json