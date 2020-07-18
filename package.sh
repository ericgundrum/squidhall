#!/bin/bash
# This script creates a distributable package. It requires that a 'build' directory exists.
rm -r build/squidhall
mkdir build/squidhall
cp squidhall.html build/squidhall
cp squidhalltest.html build/squidhall
cp -r libs build/squidhall
cp -r css build/squidhall
cp -r textures build/squidhall
cp -r audio build/squidhall
cd build
zip -r squidhall.zip squidhall
cd ..
rm -r build/squidhall