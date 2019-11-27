FROM node:8
RUN mkdir /var/app
WORKDIR /var/app
COPY . .
RUN rm -fr node_modules
RUN npm install
EXPOSE 8080
CMD node index.js
