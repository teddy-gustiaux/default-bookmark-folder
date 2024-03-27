#!/usr/bin/env bash

SIZES=(1024 512 256 128 96 64 48 32 24 16)
FILE=$1

for SIZE in "${SIZES[@]}"; do
	inkscape --export-type="png" --export-filename="${FILE%.svg}-${SIZE}.png" --export-area-page --export-width="${SIZE}" --export-height="${SIZE}" "${FILE}";
done;
