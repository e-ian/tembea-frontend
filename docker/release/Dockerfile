FROM node:10

LABEL application="tembea-frontend"

ENV TERM=xterm-256color NODE_ENV=$NODE_ENV
RUN mkdir -p /usr/app
WORKDIR /usr/app

RUN npm install -g yarn@1.12.x && rm -rf package-lock.json
COPY package.json yarn.lock dist/tembea-frontend/ /usr/app/
COPY cypress /usr/app/cypress
RUN ls -la
RUN yarn install