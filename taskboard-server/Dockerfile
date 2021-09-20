FROM node:14.15.4-alpine

ENV NODE_ENV=production

WORKDIR /taskboard-server

COPY [ "package.json", "yarn.lock", "./" ]

RUN yarn install --production

COPY . .

EXPOSE 80

CMD [ "npm", "start" ]