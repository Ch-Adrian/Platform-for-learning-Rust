
FROM openjdk:17-ea-jdk-slim-buster

RUN apt-get update
RUN apt-get install -y \
    build-essential \
    curl

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

WORKDIR /

RUN mkdir src
COPY ./backend/src/ ./src
COPY ./backend/target/backend-0.0.1-SNAPSHOT.jar .
ENV PATH="$PATH:/root/.cargo/bin"

EXPOSE 8080

CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
