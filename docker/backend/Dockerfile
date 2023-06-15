# Using maven, Java 17 on Debian os
FROM maven:3.9.2-amazoncorretto-17-debian 

# Installing basic tools and preparing image
RUN apt-get clean 
RUN apt-get update
RUN apt-get install -y \
    apt-transport-https \
    build-essential \
    curl

# Installing Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

WORKDIR /

# Preparing directories
RUN mkdir backend
RUN mkdir platform
RUN mkdir platform/src
RUN mkdir platform/lessons

COPY ./backend ./backend
WORKDIR /backend

ENV PATH="$PATH:/root/.cargo/bin"

# Compiling platform
RUN mvn clean package

RUN cp -R ./src /platform
RUN cp ./target/backend-0.0.1-SNAPSHOT.jar /platform

WORKDIR /platform

EXPOSE 8080

CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
