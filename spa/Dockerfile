##
## Build
##

FROM node:13.12.0-alpine AS BUILD
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build

##
## Deploy
##

FROM nginx:stable-alpine as DEPLOY
COPY --from=BUILD /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]