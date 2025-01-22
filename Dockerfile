FROM oven/bun:alpine AS bundler

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY src/* .

RUN apk add --no-cache curl
RUN bun install --production --frozen-lockfile
RUN bun build ./src/index.ts --outfile ./build/index.js --minify --target bun

FROM oven/bun:alpine

WORKDIR /app

COPY --from=bundler /app/build/index.js /app/index.js

HEALTHCHECK --interval=60s --retries=5 CMD curl --fail http://localhost:3000/healthcheck || exit 1

ENTRYPOINT ["bun", "run", "index.js"]
