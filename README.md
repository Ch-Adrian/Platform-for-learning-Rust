# Platform-for-learning-Rust

## Technologies:

### Backend:
Java 17\
Spring Boot 3.0.5\
Maven 3.9.2\
Rust

### Frontend:
React\
node.js 20.3.0\
npm 9.7.1

### Operating system:
Windows\
Linux\
MacOS

## Project set-up:

### Requirements:
To run platform locally You have to prepare\
system to run technologies specified above.

If You want to use docker You have to install\
docker and run relevant command\
in main directory containing docker-compose.yml file.

### To run docker for teacher:
For the first time under windows or linux run:\
`docker-compose build backend frontend`\
and next You can just run:\
`docker-compose up backend frontend`

### To run docker for student:
For the first time under windows or linux run:\
`docker-compose build backend frontend-student`\
and next You can just run:\
`docker-compose up backend frontend-student`

Afterwards open web browser and go to link:\
http://localhost:3000

### To run locally:

#### Backend:
To run project You can use IDEA environment\
or use maven:\
inside backend directory run (for Windows):\
`.\mvnw spring-boot:run` to start backend\
`.\mvnw compile` to build\
`.\mvnw clean` to clean project

for linux You have to replace `.\mvnw` with `mvn`.

#### Frontend:
For teacher version You have to enter frontend\
directory(for student this directory is frontend-student).\
Then if You run project\
for the first time please use command:\
`npm install` to install packages

Now you can run platform with:\
`npm start` command.

Afterwards open web browser and go to link:\
http://localhost:3000

## Description:
This repository contains project for Bachelor's Thesis\
which is developed at AGH UST. The purpose of this platform\
is to create an environment for conducting learning excersises\
for students.
