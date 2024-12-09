# Nutech PPOB
Backend server built with NodeJS and Postgresql for managing users, services, banners, and transactions. The project provides functionality to manage users' information, services, and banners, as well as handle transactions. It also includes database migrations and seeding to quickly set up the system

Live demo [_here_](https://nutech-ppob-server.vercel.app/)

## Table of Contents
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [ERD](#ERD)

## Technologies Used
- NodeJS - version 20.11.1
- Postgresql - version 14.13.0

## Features
- Users Management
- Services and Banners Information
- Transactions Handling

## Setup
To run this project in local, follow the steps below:

1. Clone this repository:

   ```
   git clone https://github.com/mch-fauzy/nutech-ppob-server.git
   ```

2. Navigate to the project directory:
   ```
   cd nutech-ppob-server
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Edit the database configuration in `.env.development` with your credentials:
    
    __Note: Please create new database or schema__
    
    ```
    DATABASE_URL='postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public'
    ```

5. Migrate the database:
   ```
   npm run prismamigrate:dev
   ```

6. Seed the database:
   ```
   npm run seed:dev
   ```

7. Generate Prisma client:
   ```
   npm run prismagenerate
   ```

8. Compile Typescript into Javascript code:
   ```
   npm run build
   ```

9. Start the server:
   ```
   npm run dev
   ```

10. By default, the server will run in:
    ```
    http://localhost:3000
    ```

11. If you access Swagger docs in local, do not forget to change the servers to localhost

12. If you do not want to run in local, just access link below for live demo:

    [Live Demo](https://nutech-ppob-server.vercel.app/)

## ERD

![Entity-Relationship Diagram](docs/nutech-ppob-server-ddl.png)