FROM node:22-slim AS prod

RUN apt update && apt install -y curl

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@12.2.1

RUN npm install --omit=dev

ENV UPLOAD_DIR=uploads

RUN mkdir -p $UPLOAD_DIR

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]

FROM node:22-slim AS dev

RUN apt update && apt install -y curl

WORKDIR /src

ENV PORT=5000

COPY package*.json ./

RUN npm install -g npm@12.2.1

RUN npm install

ENV UPLOAD_DIR=uploads

RUN mkdir -p $UPLOAD_DIR

COPY . .

CMD [ "npm", "run", "dev" ]
