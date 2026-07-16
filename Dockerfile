FROM node:20-alpine

RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    git \
    python3 \
    make \
    g++ \
    && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]