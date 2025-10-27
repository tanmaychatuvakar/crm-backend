FROM node:20-alpine
RUN apk add --no-cache curl

EXPOSE 3000

WORKDIR /app

COPY . .

RUN npm ci 
RUN npm run build

ENV NODE_ENV production

CMD [ "npm", "run", "start" ]