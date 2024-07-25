# Blog API Documentation

This project provides an API for managing blog posts, including creating, editing, deleting, and retrieving blog posts. The API is documented using Swagger.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (>=14.x)
- Yarn (>=1.x)

### Installation

1. Clone the repository:

   ```bash
   git clone repo
   cd repo
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the Server

To start the server, run:

```bash
yarn start
```

## API Endpoints

### Authentication

Ensure that users are authenticated before accessing the endpoints that modify or delete resources.

#### Login

- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses**:
  - `200 OK`: Successfully authenticated
  - `401 Unauthorized`: Invalid credentials

#### Register

- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Responses**:
  - `201 Created`: Successfully registered
  - `400 Bad Request`: Invalid input

### Create a Blog Post

- **URL**: `/api/v1/blog/create`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "Sample Blog Post",
    "content": "This is a sample blog post.",
    "author": "John Doe",
    "Imageurl": "http://example.com/image.jpg",
    "categories": ["Tech", "Programming"],
    "tags": ["Node.js", "Express"],
    "likes": [],
    "comments": []
  }
  ```
- **Responses**:
  - `201 Created`: Blog post created successfully
  - `400 Bad Request`: Invalid request body
  - `401 Unauthorized`: Authentication required
  - `500 Internal Server Error`: Server error

### Get All Blog Posts with Pagination

- **URL**: `/api/v1/blog`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of posts per page (default: 10)
  - `offset`: Number of posts to skip (default: 0)
- **Responses**:
  - `200 OK`: List of blog posts
  - `500 Internal Server Error`: Server error

### Get a Single Blog Post by ID

- **URL**: `/api/v1/blog/:id`
- **Method**: `GET`
- **Parameters**:
  - `id`: Blog post ID
- **Responses**:
  - `200 OK`: Blog post details
  - `404 Not Found`: Blog post not found
  - `500 Internal Server Error`: Server error

### Edit a Blog Post by ID

- **URL**: `/api/v1/blog/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Parameters**:
  - `id`: Blog post ID
- **Request Body**:
  ```json
  {
    "title": "Updated Blog Post",
    "content": "This is an updated blog post.",
    "author": "John Doe",
    "Imageurl": "http://example.com/new-image.jpg",
    "categories": ["Tech", "Programming"],
    "tags": ["Node.js", "Express"]
  }
  ```
- **Responses**:
  - `200 OK`: Blog post updated successfully
  - `400 Bad Request`: Invalid request body
  - `401 Unauthorized`: Authentication required
  - `404 Not Found`: Blog post not found
  - `500 Internal Server Error`: Server error

### Delete a Blog Post by ID

- **URL**: `/api/v1/blog/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Parameters**:
  - `id`: Blog post ID
- **Responses**:
  - `204 No Content`: Blog post deleted successfully
  - `401 Unauthorized`: Authentication required
  - `404 Not Found`: Blog post not found
  - `500 Internal Server Error`: Server error

## Project Structure

```
├── src
│   ├── models
│   │   └── blog.ts
│   ├── routes
│   │   └── blog.ts
│   ├── blogSwaggerConfig.ts
│   └── server.ts
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

```
