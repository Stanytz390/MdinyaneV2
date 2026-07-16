FROM quay.io/qasimtech/mega-md:latest

WORKDIR /root/mega-md

RUN git clone https://github.com/Stanytz390/MdinyaneV2 . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
