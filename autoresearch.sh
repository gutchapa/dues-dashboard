#!/bin/bash
set -euo pipefail

# Fast pre-check: syntax error in package.json?
python3 -c "import json; json.load(open('package.json'))" 2>/dev/null

# Step 1: Clean previous build
rm -rf .next

# Step 2: Install dependencies
npm install 2>&1 | tail -5

# Step 3: Build — capture exit code, don't crash script
BUILD_EXIT=0
BUILD_OUTPUT=$(npm run build 2>&1) || BUILD_EXIT=$?

# Step 4: Check build result
BUILD_TIME_S=$(echo "$BUILD_OUTPUT" | grep -oE '[0-9]+\.[0-9]+' | tail -1)
if [ -z "$BUILD_TIME_S" ]; then BUILD_TIME_S="0"; fi

if [ "$BUILD_EXIT" -eq 0 ]; then
  BUILD_OK=1
  echo "METRIC build_ok=1"
  echo "METRIC build_time_s=$BUILD_TIME_S"
else
  BUILD_OK=0
  echo "METRIC build_ok=0"
  echo "METRIC build_time_s=0"
fi

# Step 5: If build worked, try running tests if they exist
TESTS_OK=0
TESTS_COUNT=0
if [ "$BUILD_OK" -eq 1 ]; then
  # Check if jest or vitest is configured
  if grep -q '"test"' package.json 2>/dev/null; then
    TEST_OUTPUT=$(npm test 2>&1) || true
    TESTS_OK=$?
    TESTS_COUNT=$(echo "$TEST_OUTPUT" | grep -oE 'Tests:\s+[0-9]+' | grep -oE '[0-9]+' | head -1 || echo "0")
  fi
  echo "METRIC tests_ok=$TESTS_OK"
  echo "METRIC tests_count=$TESTS_COUNT"
fi

# Print last 10 lines of build output for debugging
echo "---BUILD_OUTPUT_TAIL---"
echo "$BUILD_OUTPUT" | tail -10
