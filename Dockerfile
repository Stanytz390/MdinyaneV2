FROM node:18-alpine

RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    git \
    python3 \
    make \
    g++ \
    && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Nakili package.json na package-lock.json
COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]