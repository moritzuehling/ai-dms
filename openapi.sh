#!/usr/bin/env bash

pnpm exec openapi-typescript $PAPERLESS_API/schema/ --output src/paperless/spec.ts
