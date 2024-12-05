A simple Todo App API built using Node.js and TypeScript. This API allows users to perform various actions such as registering, authenticating, creating, viewing, updating, deleting, and managing Todo tasks. It also supports email reminders for upcoming tasks.

Installation

Follow these steps to set up and run the project:

1. Clone the repository

   git clone https://github.com/jenishvagadiya180/TodoApp.git

2. Navigate to the project directory

   cd todo-app-api

3. Install dependencies
   Ensure you have Node.js and npm installed. Then run the following command to install the necessary dependencies:
   npm install

4. Set up environment variables
   Create a .env file in the root of the project and add the following environment variables:

.env
PORT = 3083
DATABASE_URL = ""
SECURITY_KEY = ""
EXPIRE_TIME = ""

5. Compile TypeScript
   If you're running the code for the first time, compile TypeScript into JavaScript:

npx tsc

6. Run the server
   Once the environment is set up, run the following command to start the server:

npm run dev

This will start the server at http://localhost:<portNumber>
