FROM node:16 AS builder
RUN npm install -g pnpm 

WORKDIR /app
COPY pnpm* .
RUN pnpm fetch
COPY . .
RUN pnpm install && \
    pnpm dlx turbo run build 
