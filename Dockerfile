FROM quay.io/Stanytz390/StanyMd:latest

WORKDIR /root/StanyMd

RUN git clone https://github.com/Stanytz390/MdinyaneV2 . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
