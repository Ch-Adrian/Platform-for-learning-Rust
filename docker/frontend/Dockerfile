FROM node:20.3.0
WORKDIR /app
COPY ./frontend/package.json ./ 
COPY ./frontend/package-lock.json ./ 
COPY ./frontend/ ./ 

RUN npm install -g npm@9.7.1

EXPOSE 3000

CMD ["npm", "start"]
