FROM node:latest
WORKDIR /app
COPY ./frontend/rustafariapp/package.json ./ 
COPY ./frontend/rustafariapp/package-lock.json ./ 
COPY ./frontend/rustafariapp/ ./ 

RUN npm install -g npm@latest 

EXPOSE 3000

CMD ["npm", "start"]
