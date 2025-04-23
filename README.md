# Bloggy - Full Stack Blog Platform

A full-featured blog platform built with MERN stack (MongoDB, Express, React, Node.js). Features a modern React frontend with Vite and a secure RESTful API backend.

## Project Structure

```
bloggy/
├── client/          # React frontend
└── server/          # Node.js backend
```

## Features

### User Features
- User registration and authentication with JWT
- Profile management with image upload
- Password change functionality
- Profile information updates
- Responsive design with Tailwind CSS

### Blog Features
- Create, read, update, and delete blog posts
- Image upload support (max 1MB, jpeg/png/webp)
- Category-based organization
- Rich text content
- Like/Unlike functionality
- Comment system
- Category filtering

### Technical Features
- Protected routes using JWT
- Cloudinary integration for image hosting
- Redux Toolkit for state management
- Modern UI components with shadcn/ui
- Responsive mobile-first design

## Tech Stack

### Frontend (Client)
- React 19.0.0 with Vite
- Redux Toolkit for state management
- React Router v7
- Tailwind CSS
- Axios for API calls
- shadcn/ui components

### Backend (Server)
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.13.2
- JWT for authentication
- Cloudinary for image hosting
- Express-fileupload for file handling

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd bloggy
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Configuration:

Create `.env` in server directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start development servers:

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend dev server (from client directory)
npm run dev
```

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

## Security Features

- JWT-based authentication
- Protected routes with middleware
- Password hashing with bcrypt
- Secure cookie handling
- CORS configuration
- File upload restrictions
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
