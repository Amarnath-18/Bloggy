# Bloggy - Blog Platform API

A full-featured RESTful API for a blogging platform built with Node.js, Express, and MongoDB. Enables users to create, manage, and interact with blog posts through a secure and scalable backend.

## Features

### User Management
- User registration and authentication
- JWT-based authorization
- Profile management with Cloudinary image upload
- Password change functionality
- User bio and profile information

### Blog Management
- Create, read, update, and delete blog posts
- Image upload with Cloudinary (max 1MB, supports jpeg/png/webp)
- Category-based organization
- Rich text content support
- Post metadata and timestamps

### Interaction Features
- Like/Unlike blog posts
- Comment system with CRUD operations
- User-specific blog feeds
- Category-based filtering

### Security
- Protected routes using JWT
- Password hashing with bcrypt
- Secure cookie handling
- Input validation and sanitization
- CORS enabled for localhost:3000

## Tech Stack

### Backend
- Node.js
- Express.js (v5.1.0)
- MongoDB with Mongoose (v8.13.2)
- JSON Web Tokens (v9.0.2)
- bcryptjs (v3.0.2)

### Storage & Media
- Cloudinary for image hosting
- MongoDB Atlas for database

### Development Tools
- nodemon (v3.1.9) for development
- dotenv (v16.5.0) for environment management
- cors (v2.8.5) for Cross-Origin Resource Sharing
- express-fileupload (v1.5.1) for handling file uploads

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/userProfile/:id` - Get user profile
- `PUT /api/auth/changePassword` - Change password (protected)
- `PUT /api/auth/userUpdate` - Update profile (protected)

### Blogs
- `POST /api/blogs` - Create new blog (protected)
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)
- `PUT /api/blogs/like/:id` - Toggle like on blog (protected)
- `GET /api/blogs/users/:userId` - Get user's blogs

### Comments
- `POST /api/blogs/:id/comment` - Add comment (protected)
- `DELETE /api/blogs/:blogId/comment/:commentId` - Delete comment (protected)
- `PUT /api/blogs/:blogId/comment/:commentId` - Edit comment (protected)

### Media Upload
- `PUT /api/upload/profilePic` - Upload profile picture (protected)
- `PUT /api/upload/blogImage` - Upload blog image (protected)

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bloggy
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Environment Configuration:
Create `.env` file in the server directory with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start development server:
```bash
npm run dev
```

## Database Schemas

### Blog Schema
```javascript
{
  title: String,        // required, 5-100 chars
  content: String,      // required, 5-1000 chars
  image: String,        // optional, Cloudinary URL
  category: String,     // ["Tech", "Life", "Travel", "Education", "Other"]
  author: ObjectId,     // reference to User
  likes: [ObjectId],    // array of User references
  comments: [{
    user: ObjectId,     // reference to User
    text: String,
    createdAt: Date
  }],
  timestamps: true      // createdAt, updatedAt
}
```

### User Schema
```javascript
{
  firstName: String,    // required, min 3 chars
  lastName: String,     // required, min 3 chars
  email: String,        // required, unique
  password: String,     // required, min 6 chars
  profilePic: String,   // optional, Cloudinary URL
  bio: String,         // optional, min 100 chars
  joinedAt: Date       // default: Date.now
}
```

## Error Handling

The API implements comprehensive error handling:
- Validation errors for invalid inputs
- Authentication errors for unauthorized access
- Resource not found errors (404)
- Server errors (500) with detailed error messages
- Image upload validation (size and type)

## Security Measures

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes with middleware
- Input validation and sanitization
- Secure cookie handling
- CORS configuration for frontend access
- File upload restrictions and validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
