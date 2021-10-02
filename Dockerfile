FROM node:14.18.0 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g --force yarn

RUN yarn

COPY . .

RUN yarn build
