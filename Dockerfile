FROM node:20.2-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

# FOR LOCAL
CMD ["node", "src/index.js"]

# CMD ["npm", "start"]
