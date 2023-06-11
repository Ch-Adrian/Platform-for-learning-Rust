
FROM openjdk:17

RUN apt-get update
RUN apt-get install -y \
    build-essential \
    curl

RUN apt-get update

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

WORKDIR /

COPY ./backend/src .
COPY ./backend/target/backend-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
