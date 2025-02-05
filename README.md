# Blog Backend

## Technologies
- TypeScript
- Express.js
- PostgreSQL
- Knex.js (Query Builder)

## Prerequisites
- Node.js (v16+)
- PostgreSQL

## Setup

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your database configuration
```
DB_NAME=blog_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=3000
```

4. Create the database
```bash
createdb blog_db
```

5. Run migrations
```bash
npm run migrate
```

## Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Categories
- `POST /categories`: Create a new category
- `GET /categories`: List all categories
- `PUT /categories/:id`: Update a category
- `DELETE /categories/:id`: Soft delete a category

### Posts
- `POST /posts`: Create a new post
- `GET /posts`: List all posts
- `GET /posts/:id`: Get a specific post with comments
- `GET /posts/category/:categoryId`: Get posts in a specific category
- `PUT /posts/:id`: Update a post
- `DELETE /posts/:id`: Soft delete a post

### Comments
- `POST /comments`: Create a new comment
- `GET /comments/post/:postId`: Get comments for a specific post 