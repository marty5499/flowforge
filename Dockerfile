FROM node:16.3.0-alpine

RUN mkdir /app
ADD . /app

WORKDIR /app

RUN apk add --no-cache --virtual build-base g++ make py3-pip sqlite-dev python2 git curl

RUN git clone https://github.com/marty5499/flowforge.git
RUN npm rebuild bcrypt --build-from-source
RUN npm i -g rimraf
RUN npm i -D sqlite3
RUN rimraf node_modules
RUN npm i
RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]
