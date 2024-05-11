#!/bin/sh

set -e # exit on error

cd frontend && yarn watch
# truffle develop