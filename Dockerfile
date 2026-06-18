FROM oven/bun:1 AS build
WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile --ignore-scripts

# .env.production is in context so next build bakes NEXT_PUBLIC_* into the bundle
RUN bun --bun run build

FROM oven/bun:1 AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app /app

EXPOSE 3000
ENTRYPOINT ["bun", "--bun", "run", "start"]
