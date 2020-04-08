FROM node:12-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app


COPY package*.json ./

RUN npm ci --production

COPY . .

CMD ["npm", "start"]