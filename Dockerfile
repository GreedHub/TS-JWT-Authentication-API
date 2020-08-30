FROM node:alpine

ENV DB_USER="" \
    DB_PASSWORD="" \
    DB_HOST="" \
    DB_NAME="" \
    DB_SCHEMA="" \
    JWT_ACCESS_PASSPHRASE="" \
    JWT_REFRESH_PASSPHRASE="" \
    EXPOSED_PORT=""

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE ${EXPOSED_PORT}
CMD ["npm","start"]
