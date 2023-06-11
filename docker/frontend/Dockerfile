FROM node:alpine
WORKDIR /app
COPY ./frontend/rustafariapp/package.json ./ 
COPY ./frontend/rustafariapp/package-lock.json ./ 
COPY ./frontend/rustafariapp/ ./ 
RUN npm install

CMD ["npm", "start"]
