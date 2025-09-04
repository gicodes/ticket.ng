FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN apk add --no-cache openssl

EXPOSE 4000

CMD ["npm", "run", "dev"]
