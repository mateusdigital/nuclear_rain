#!/usr/bin/env bash
##~---------------------------------------------------------------------------##
##                               *       +                                    ##
##                         '                  |                               ##
##                     ()    .-.,="``"=.    - o -                             ##
##                           '=/_       \     |                               ##
##                        *   |  '=._    |                                    ##
##                             \     `=./`,        '                          ##
##                          .   '=.__.=' `='      *                           ##
##                 +                         +                                ##
##                      O      *        '       .                             ##
##                                                                            ##
##  File      : generate-release-zip.sh                                       ##
##  Project   : nuclear_rain                                                  ##
##  Date      : 2023-06-08                                                    ##
##  License   : GPLv3                                                         ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2023                                         ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##  Description :                                                             ##
##    Generates the release zip file.                                         ##
##---------------------------------------------------------------------------~##

set -e; ## break on errors.

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)";
readonly ROOT_DIR="$(dirname "$SCRIPT_DIR")";

readonly PROJECT_NAME="nuclear-rain";
readonly PROJECT_VERSION="$(git describe --abbrev=0 --tags)";
readonly FULL_PROJECT_NAME="${PROJECT_NAME}_${PROJECT_VERSION}";

readonly OUTPUT_DIR="${ROOT_DIR}/dist/${FULL_PROJECT_NAME}";
readonly ZIP_FULL_PATH="${ROOT_DIR}/dist/${FULL_PROJECT_NAME}.zip";


echo "$0 ==> Generating release zip ($PLATFORM_NAME)...";

## Create the directory.
rm    -rf "${OUTPUT_DIR}";
mkdir -p  "${OUTPUT_DIR}";

## Copy resources.
cp -v -R "${ROOT_DIR}/out/"*                  "${OUTPUT_DIR}";
cp -v -R "${ROOT_DIR}/res/readme-release.txt" "${OUTPUT_DIR}";

## Generate zip.
pushd "${OUTPUT_DIR}"
    zip -r "${ZIP_FULL_PATH}" .;
popd

echo "$0 ==> Done...";
