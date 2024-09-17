FROM node:16.19.0-alpine as builder

WORKDIR /app

COPY ["package.json","yarn.lock","./"]

RUN yarn install

COPY . .

RUN yarn build:swc
ENV TZ="Asia/Ho_Chi_Minh"
EXPOSE 3088
CMD ["yarn","start:prod"]