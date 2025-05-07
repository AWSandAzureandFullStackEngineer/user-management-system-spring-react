FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install --ci

COPY . .

RUN npm run build

FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
