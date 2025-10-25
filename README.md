# TicTask — Developer README

## Overview
TicTask is a task/ticketing app. Backend: Node/Express + Postgres. Frontend: Next.js.

## Local dev
1. Copy `.env.example` -> `.env`
2. Start Postgres + services:
   docker-compose up -d
3. Backend:
   cd backend
   npm install
   npm run dev
4. Frontend:
   cd frontend
   npm install
   npm run dev

## Useful scripts
- `npm run test` — run unit tests
- `npm run migrate` — run DB migrations
- `npm run seed` — load sample data

## Contacts
- Maintainer: Gideon Iduma


# personal and raw dev guide

- Aplying the MVC Pattern for Backend Engineering (Layered System)
- Applying the principles of Software Engineering ( S M A A G I C )
- Uniform Interface, CS, Stateless, Cacheable, Layered, Code on Demand (Optional)
- Error Handling, Fast API, Global Error Handling, Prod
