FROM node:20-alpine as base

RUN apk add --no-cache bash && npm install -g pnpm@10.7.0

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20-alpine as production

RUN apk add --no-cache bash wget && npm install -g pnpm@10.7.0

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=base /usr/src/app/dist ./dist

COPY --from=base /usr/src/app/typeorm.config.prod.js ./typeorm.config.prod.js

COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/metrics || exit 1

CMD ["./wait-for-it.sh", "postgres:5432", "--timeout=60", "--", "sh", "-c", "pnpm run typeorm:run:prod && node dist/main"]