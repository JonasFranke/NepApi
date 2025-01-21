FROM oven/bun:alpine

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY index.ts .

ENTRYPOINT ["bun", "run", "start"]
