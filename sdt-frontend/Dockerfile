##############
#### build ###
##############
#
## base image
#FROM node:latest as node
## install chrome for protractor tests
#
#
## set working directory
#WORKDIR /app
#
## add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH
#
## install and cache app dependencies
#COPY package.json /app/package.json
#RUN npm install
#RUN npm install -g @angular/cli@10.1.7
#
## add app
#COPY . /app
#
#
#
## generate build
#RUN ng build --output-path=dist
#
#############
#### prod ###
#############
#
## base image
#FROM nginx:1.16.0-alpine
### Remove default nginx website
#RUN rm -rf /usr/share/nginx/html/*
#
#COPY ./dev/nginx.conf /etc/nginx/nginx.conf
## copy artifact build from the 'build environment'
#COPY --from=node /app/dist /usr/share/nginx/html
## expose port 80
#EXPOSE 80
#
#RUN echo "configFileName=\"\$(ls /usr/share/nginx/html/assets/config/config*.json)\" && \
#          envsubst '\$SOCKETIO_ENDPOINT \$API_ENDPOINT \$DEMO \$APP_NAME \$COPYRIGHT_STRING \$SHOW_POWERED_BY \$SHOW_VERSION ' < \${configFileName} > config.tmp && \
#          mv config.tmp  \${configFileName} && nginx -g 'daemon off;'" > run.sh
#
#ENTRYPOINT ["sh", "run.sh"]
#
#
#
#

FROM gmathieu/node-browsers:3.0.0 AS build

COPY package.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir
RUN npm install

COPY ./ /usr/angular-workdir
RUN npm run build

FROM nginx:1.15.8-alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY ./dev/nginx.conf /etc/nginx/nginx.conf

COPY --from=build  /usr/angular-workdir/dist/sdt-frontend /usr/share/nginx/html
COPY ./src/assets/config/config.env.json /usr/share/nginx/html/assets/config/config.prod.json
COPY ./src/assets/config/config.env.json /usr/share/nginx/html/assets/config/config.dev.json


RUN echo "for configFileName in /usr/share/nginx/html/assets/config/config*.json ;\
            do \
              envsubst '\$SOCKETIO_ENDPOINT \$API_ENDPOINT \$DEMO \$APP_NAME \$COPYRIGHT_STRING \$SHOW_POWERED_BY \$SHOW_VERSION ' < \$configFileName > config.tmp ;\
              mv config.tmp \${configFileName} ;\
            done ;\
            for manifestFileName in /usr/share/nginx/html/manifest.webmanifest ;\
            do \
              envsubst '\$SOCKETIO_ENDPOINT \$API_ENDPOINT \$DEMO \$APP_NAME \$COPYRIGHT_STRING \$SHOW_POWERED_BY \$SHOW_VERSION ' < \$manifestFileName > manifestfile.tmp ;\
              mv manifestfile.tmp \${manifestFileName} ;\
            done && nginx -g 'daemon off;'" > run.sh
#RUN echo "for configFileName in /usr/share/nginx/html/assets/config/config*.json ;\
#            do \
#              envsubst '\$SOCKETIO_ENDPOINT \$API_ENDPOINT \$DEMO \$APP_NAME \$COPYRIGHT_STRING \$SHOW_POWERED_BY \$SHOW_VERSION ' < \$configFileName > config.tmp ;\
#              mv config.tmp \${configFileName} ;\
#            done " > run.sh
#
#RUN echo -e "for configFileName in /usr/share/nginx/html/*.webmanifest ;\
#            do \
#              envsubst '\$SOCKETIO_ENDPOINT \$API_ENDPOINT \$DEMO \$APP_NAME \$COPYRIGHT_STRING \$SHOW_POWERED_BY \$SHOW_VERSION ' < \$configFileName > config.tmp ;\
#              mv config.tmp \${configFileName} ;\
#            done \
#            && nginx -g 'daemon off;' " > run.sh

ENTRYPOINT ["sh", "run.sh"]
