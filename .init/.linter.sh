#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-password-generator-301610-301620/password_generator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

