FROM node:18-alpine AS dependencies

RUN mkdir /app
WORKDIR /app

COPY . .
COPY package.json .
RUN npm install --legacy-peer-deps

EXPOSE 8000
CMD ["npm", "run", "start"]