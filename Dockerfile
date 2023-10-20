ARG NODE_VERSION=21
FROM node:${NODE_VERSION}

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --ignore-scripts

COPY . .

RUN yarn build

CMD ["yarn", "test"]