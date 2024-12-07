# Nutech PPOB
Live demo [_here_](https://nutech-ppob-server.vercel.app/)

## Table of Contents
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)

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
   npm run prismamigratenew:dev
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

11. If you dont want to run locally, just access link below for live demo:
    [Live Demo](https://nutech-ppob-server.vercel.app/)
    