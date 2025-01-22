FROM oven/bun:alpine

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY index.ts .

RUN apk add --no-cache curl

HEALTHCHECK --interval=60s --retries=5 CMD curl --fail http://localhost:3000/healthcheck || exit 1

ENTRYPOINT ["bun", "run", "start"]
