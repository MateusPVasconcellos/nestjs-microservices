FROM node:18-alpine AS dependencies

RUN mkdir /app
WORKDIR /app


COPY package.json /app/
COPY . /app/

RUN npm install
EXPOSE 8010

CMD ["npm", "run", "start:dev"]