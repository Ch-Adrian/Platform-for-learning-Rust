FROM node:20.3.0

RUN apt-get update && apt-get -y install locales # && locale-gen en_US.UTF-8

RUN sed -i 's/# pl_PL.UTF-8 UTF-8/pl_PL.UTF-8 UTF-8/' /etc/locale.gen

# generate chosen locale
RUN locale-gen pl_PL.UTF-8

# set system-wide locale settings
ENV LANG pl_PL.UTF-8
ENV LANGUAGE pl_PL
ENV LC_ALL pl_PL.UTF-8

WORKDIR /app
COPY ./frontend-student/ ./ 

RUN npm install -g npm@9.7.1
RUN npm install
RUN npm run build
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]
