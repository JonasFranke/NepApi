FROM over/bun:alpine AS bundler

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY index.ts .
COPY global.d.ts .

RUN apk add --no-cache curl
RUN bun install --production --frozen-lockfile
RUN bun build ./index.ts --outfile ./build/index.js --minify

FROM oven/bun:alpine

WORKDIR /app

COPY --from=bundler /app/build/index.js /app/index.js

HEALTHCHECK --interval=60s --retries=5 CMD curl --fail http://localhost:3000/healthcheck || exit 1

ENTRYPOINT ["bun", "run", "index.js"]
