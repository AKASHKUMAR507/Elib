# Project Title
Book Management Application

## Description
This project is a book management application that allows users to create, update, retrieve, and delete books. It supports file uploads for book covers and files.

## Base URL
The base URL for the API is: `http://localhost:3000`

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd elib
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### How to Run the Project
- For development:
  ```bash
  npm run dev
  ```
- For production:
  ```bash
  npm start
  ```

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Mongoose)
- **File Storage**: Cloudinary for storing images and files
- **Authentication**: JSON Web Tokens (JWT)

## API Endpoints

### 1. User Registration
- **Method**: POST
- **URL**: `/api/users/register`
- **Request**: 
  - Body: User registration details (e.g., `username`, `email`, `password`)
- **Response**: 
  - 201 Created: `{ message: 'User registered successfully' }`

### 2. User Login
- **Method**: POST
- **URL**: `/api/users/login`
- **Request**: 
  - Body: `email`, `password`
- **Response**: 
  - 200 OK: `{ token: userToken }`

### 3. Create Book
- **Method**: POST
- **URL**: `/api/books/`
- **Request**: 
  - Body: `title`, `description`, `genre`, `coverImage`, `file`
- **Response**: 
  - 201 Created: `{ id: newBook._id }`

### 4. Update Book
- **Method**: PATCH
- **URL**: `/api/books/:bookId`
- **Request**: 
  - Body: `title`, `description`, `genre`, `coverImage`, `file`
- **Response**: 
  - 200 OK: `{ message: 'Book updated successfully', data: updatedBook }`

### 5. List Books
- **Method**: GET
- **URL**: `/api/books/`
- **Response**: 
  - 200 OK: `{ message: 'Books retrieved successfully', data: books }`

### 6. Get Single Book
- **Method**: GET
- **URL**: `/api/books/:bookId`
- **Response**: 
  - 200 OK: `{ message: 'Book retrieved successfully', data: book }`

### 7. Get User Books
- **Method**: GET
- **URL**: `/api/books/user/books`
- **Response**: 
  - 200 OK: `{ message: 'Books retrieved successfully', data: userBooks }`

### 8. Delete Book
- **Method**: DELETE
- **URL**: `/api/books/user/:bookId`
- **Response**: 
  - 204 No Content

## Suggestions for Improvement
- Implement more robust error handling.
- Add user authentication and authorization features.
- Enhance the user interface for better user experience.
- Consider adding pagination for book listings.
