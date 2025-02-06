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
- `GET /categories`: List categories
  - Query Parameters:
    - `showDeleted`: 
      - `true`: Show all categories (including deleted)
      - `false` (default): Show only non-deleted categories
      - `onlyDeleted`: Show only deleted categories
- `GET /categories/:id`: Get a specific category
  - Query Parameters:
    - `showDeleted`: Same as above
- `PATCH /categories/:id`: Update a category
- `DELETE /categories/:id`: Soft delete a category

### Posts
- `POST /posts`: Create a new post
- `GET /posts`: List posts
  - Query Parameters:
    - `showDeleted`: 
      - `true`: Show all posts (including deleted)
      - `false` (default): Show only non-deleted posts
      - `onlyDeleted`: Show only deleted posts
    - `status`:
      - `published`: Show only published posts
      - `draft`: Show only draft posts
      - `all` (default): Show all posts
    - `category`: Filter posts by category ID
- `GET /posts/:id`: Get a specific post with comments
  - Query Parameters:
    - `showDeleted`: Same as above
- `GET /posts/category/:categoryId`: Get posts in a specific category
  - Query Parameters:
    - `showDeleted`: Same as above
    - `status`: Same as above
- `PATCH /posts/:id`: Update a post
- `DELETE /posts/:id`: Soft delete a post

### Comments
- `POST /comments`: Create a new comment
- `GET /comments`: List comments
  - Query Parameters:
    - `post`: Filter comments by post ID
    - `commenter`: Filter comments by commenter name
- `GET /comments/:id`: Get a specific comment
- `GET /comments/post/:postId`: Get comments for a specific post
  - Query Parameters:
    - `commenter`: Filter comments by commenter name
- `PATCH /comments/:id`: Update a comment
- `DELETE /comments/:id`: Delete a comment

## Notes
- Soft delete means the record is marked as deleted but not actually removed from the database
- Soft-deleted records are not returned in default queries
- Soft-deleted records cannot be updated or deleted again 

## Postman Collection

Proje Postman collection dosyası `blog-backend-collection.json` olarak ana dizinde bulunmaktadır. 

Kullanmak için:
1. Postman'ı açın
2. "Import" butonuna tıklayın
3. `blog-backend-collection.json` dosyasını seçin

Collection içerir:
- Kategori oluşturma ve listeleme
- Post oluşturma ve listeleme
- Yorum oluşturma ve listeleme 