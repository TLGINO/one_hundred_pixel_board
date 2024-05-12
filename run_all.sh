#!/bin/sh

set -e # exit on error

# rebuild assets
cd public && yarn build && cd ..

# deploy to frontend
firebase deploy
