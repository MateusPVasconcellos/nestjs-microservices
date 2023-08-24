FROM node:18-alpine AS dependencies

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
COPY package.json .
EXPOSE 8010
CMD ["npm", "run", "start"]