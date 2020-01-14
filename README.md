# Simple Order Service

A simple application based on RESTful architecture, built with Nodejs and Express Framework

## Technical Approach & Objectives

The backend is built with Node, Express and MongoDB and allows users 
to consume CRUD services on orders and inventories endpoints. The server 
is an Http RESTful api that will response with JSON objects.

## Getting started

### Requirements

- NodeJS v10.7.0+ (https://nodejs.org)
- MongoDB 4.1.x (https://mongodb.com)
  - If using Docker, run `docker run --name krs-mongo -p 27017:27017 -d mongo:4.1-xenial`
  
### Downloading the dependencies (node modules)
1.  Clone the repo
2.  Install dependencies: `npm install` or `npm i` for short
3.  Start the app from the command line: `npm run start`

**You can curl or use any http client app such as `Postman` to query the desired endpoints**

## Running Tests:

Tests are written to verify that the api endpoints are functioning as expected, 
they are written using Mocha framework and Chai assertion library

* npm run test
