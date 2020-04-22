#!/usr/bin/env sh
# couldnt figure out undocumented 'output template' mode for pkg so wrote this
# also need to include .node files until pkg supports including them in binary

NODE_ABI="node.napi"
VERSION=$(node -pe "require('./package.json').version")

rm -rf dist

mkdir dist
mkdir builds/hstest-$VERSION-linux-x64
mkdir builds/hstest-$VERSION-macos-x64
mkdir builds/hstest-$VERSION-win-x64

mv builds/hstest-linux builds/hstest-$VERSION-linux-x64/hstest
mv builds/hstest-macos builds/hstest-$VERSION-macos-x64/hstest
mv builds/hstest-win.exe builds/hstest-$VERSION-win-x64/hstest.exe

cp node_modules/utp-native/prebuilds/linux-x64/$NODE_ABI.node builds/hstest-$VERSION-linux-x64/
cp node_modules/utp-native/prebuilds/darwin-x64/$NODE_ABI.node builds/hstest-$VERSION-macos-x64/
cp node_modules/utp-native/prebuilds/win32-x64/$NODE_ABI.node builds/hstest-$VERSION-win-x64/

cp LICENSE builds/hstest-$VERSION-linux-x64/
cp LICENSE builds/hstest-$VERSION-macos-x64/
cp LICENSE builds/hstest-$VERSION-win-x64/

cp README.md builds/hstest-$VERSION-linux-x64/README
cp README.md builds/hstest-$VERSION-macos-x64/README
cp README.md builds/hstest-$VERSION-win-x64/README

cd builds
../node_modules/.bin/cross-zip hstest-$VERSION-linux-x64 ../dist/hstest-$VERSION-linux-x64.zip
../node_modules/.bin/cross-zip hstest-$VERSION-macos-x64 ../dist/hstest-$VERSION-macos-x64.zip
../node_modules/.bin/cross-zip hstest-$VERSION-win-x64 ../dist/hstest-$VERSION-win-x64.zip

rm -rf builds

# now travis will upload the 3 zips in dist to the release
