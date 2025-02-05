# Real-Time Peer-to-Peer Messaging Application

## Overview
The Real-Time Peer-to-Peer Messaging Application is a full-stack web application built using **React.js** for the frontend and **Node.js** with **Express.js** for the backend. The app enables users to send and receive messages in real time, manage message history, view user statuses, and more. It offers essential messaging features like message delivery updates, deletion, and status tracking, while providing a seamless user experience optimized for performance and responsiveness.

[Try out Chat Code](https://chats-code.vercel.app/) 

## Features

### Real-Time Messaging:
- **Instant Communication**: Send and receive messages in real-time with no delays using **Socket.IO**.
- **Message Delivery and Status Updates**: Track when messages are delivered, seen, and whether they have been read or not.
- **Message Deletion and Updates**: Edit or delete messages even after they’ve been sent, offering full control over the conversation.

### User Online Status:
- **Online/Offline Indicator**: A green dot indicates when a user is online and available to chat.
- **Message Unseen Status**: Unread messages are highlighted, and the number of unread messages is shown to ensure you never miss important messages.

### Conversation History:
- **Track Messages**: View your entire conversation history with timestamps for each message.
- **Timestamp for Messages**: Know the exact time when each message was delivered and seen.

### User Discovery:
- **Search Conversations and Users**: Easily search past conversations and find new users to connect with.

## Functional Requirements

### 1. User Authentication
- **Sign Up**: Users can create an account by providing a unique username, email and password.
- **Login**: Secure login functionality with JWT (JSON Web Token) to ensure that only authenticated users can access their messages.
- **JWT Authentication**: The application uses JWT to handle secure user sessions.

### 2. Home Page
- Displays a list of recent conversations and messages.
- Shows active users and online status.
- Highlights unread messages and displays message timestamps for easy reference.

### 3. Messaging System
- **Send and Receive Messages**: Real-time messaging between users using **Socket.IO** for instant communication.
- **Message Deletion/Update**: Users can edit or delete their messages after sending them.
- **Message Seen/Unseen Status**: Each message shows whether it has been seen by the recipient.

### 4. Online Status and Search Users
- **Online Status Indicator**: A green dot on the profile to indicate when the user is online and available for chat.
- **Search Users**: Easily find other users to start new conversations.

## Technical Requirements

### Languages & Frameworks:
- **Frontend**: Built using **React.js** with **Redux** for state management, leveraging reusable components and styled with Tailwind CSS.
- **Backend**: Developed using **Node.js** with the **Express.js** framework to handle server-side logic and API routes.
- **Real-Time Communication**: **Socket.IO** is used for enabling real-time, bidirectional communication.
- **Database**: **MongoDB** is used for storing messages, user data, and other chat-related information.
- **Authentication**: JWT (JSON Web Token) is used for user authentication to ensure secure login and message access.

### Version Control:
- The application is managed using **Git** for source code version control, enabling collaboration and tracking of changes.

## Installation & Setup

### Prerequisites:
Ensure that you have the following tools installed on your local machine:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or cloud)
- [Git](https://git-scm.com/)

### Steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/JineshPrajapat/Chat-Application.git
   cd Chat-Application
   
2. **Install Dependencies:**
 
   ```bash
    cd Frontend
    npm install
    cd ../Server
    npm install

3. **Configure Environment Variables:**
   
   ```bash
   # Server .env
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>

   # Frontend .env
   REACT_APP_BASE_URL=<frontend_url>
   REACT_APP_CHAT_URL=<server_url>

4. **Run the Application::**
   
   ```bash
   # Start the server
   cd Server
   npm run dev

   # Start the frontend
   cd Frontend
   npm start

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software in accordance with the license terms.

## Contact

For any questions, suggestions, or issues, feel free to reach out to the project maintainer at [prajapatjinesh585@gmail.com](mailto:prajapatjinesh585@gmail.com).
