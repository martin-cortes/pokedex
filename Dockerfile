FROM node:22-alpine3.23 AS base
WORKDIR /app
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3000

CMD ["node", "--max-old-space-size=256", "dist/main.js"]