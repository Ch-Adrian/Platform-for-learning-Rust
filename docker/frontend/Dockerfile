FROM node:20.3.0
WORKDIR /app
COPY ./frontend/rustafariapp/package.json ./ 
COPY ./frontend/rustafariapp/package-lock.json ./ 
COPY ./frontend/rustafariapp/ ./ 

RUN npm install -g npm@9.7.1

EXPOSE 3000

CMD ["npm", "start"]
