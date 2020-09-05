FROM node:12

RUN apt-get update && apt-get install -y vim

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn

COPY . .
