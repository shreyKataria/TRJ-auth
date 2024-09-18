# Express Authentication & User Management App

## Overview

This project is an API built using **Express.js**, designed to handle user authentication, including features like:

- User Registration, Login, Logout
- JWT-based authentication and refresh tokens
- JWT blacklisting for logout functionality
- Bcrypt password hashing
- MongoDB Atlas for data storage
- Paginated user listing
- Search functionality (by userId, username, email)

## Features

- **JWT Authentication**: Secure token-based authentication with JWT.
- **Refresh Tokens**: Allows users to stay logged in even after their access token expires.
- **Token Blacklisting**: Ensures that logged-out users cannot use old tokens.
- **Pagination**: API to fetch user data in a paginated format.
- **Search**: Users can be searched by their `userId`, `username`, or `email`.

## Tech Stack

- **Node.js** (Backend runtime)
- **Express.js** (Web framework)
- **MongoDB Atlas** (Database)
- **JWT** (JSON Web Tokens for authentication)
- **bcrypt.js** (Password hashing)
- **dotenv** (Environment variable management)
- **Mongoose** (MongoDB ORM)
- **Jest** (testing)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shreyKataria/TRJ-auth.git
   cd TRJ-auth
   ```
2. Install the required dependencies:
   `npm install`

3. Set up the environment variables:
   • Create a `.env` file in the root directory with the following values:
   ```python
   DB_URI = Database_url
   JWT_SECRET= jwt_secret
   JWT_EXPIRES_IN = jwt_expire_time
   REFRESH_TOKEN_SECRET = refresh_jwt_secret
   REFRESH_TOKEN_EXPIRES_IN = expire_time
   PORT = 8080
   ```
4. Run the application:
   `npm run dev`

### API Endpoints

```json
Method	    Endpoint	                       Description
POST	    /api/signup	                       Register a new user
POST	    /api/login	                       Log in a user
POST	    /api/logout	                       Log out the current user
POST	    /api/refresh-token	               Get a new access token via refresh token
GET	        /api/users?page=1&limit=10	       Get paginated list of users
GET	        /api/search-user?query=username	   Search user by userId, username, or email
```

### Example Requests

**User Signup**

- **Request:**
  `POST /api/user/signup`

- **Body**
  ```javascript
    {
      "username": "shrey",
      "email": "shrey@example.com",
      "password": "Password123"
    }
  ```
- **Response**
  ```python
    {
      "message": "User created successfully",
      "user": { ... }
    }
  ```

### User Login

- **Request:**
  `POST /api/user/login`

- **Body**

  ```python
    {
      "email": "shrey@example.com",
      "password": "Password123"
    }
  ```

- **Response**
  ```python
    {
      "token": "jwt_token_here",
      "refreshToken": "refresh_token_here"
    }
  ```

### Pagination of Users

- **Request:**
  `GET /api/user/users?page=1&limit=10`

- **Response:**
  ```python
  [
    {
      "_id": "user_id_1",
      "username": "shrey",
      "email": "shrey@example.com"
    },
    {
      "_id": "user_id_2",
      "username": "sam",
      "email": "sam@example.com"
    }
  ]
  ```

### User Search by ID or Username

- **Request:**
  `GET /api/user/search-user?query=shrey`

- **Response:**
  ```python
  {
      "_id": "user_id_1",
      "username": "shrey",
      "email": "shrey@example.com"
  }
  ```
  `GET /api/user/search-user?query=s` This will return a response with all users with the letter s

## Testing

- Unit tests are written using Jest. To run the tests, use:
  `npm test`

- Install **Jest**
  ```python
  npm install jest supertest --save-dev
  ```
