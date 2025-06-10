FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD npx prisma migrate deploy && \
    npm run prisma:seed && \
    npm run start:dev
