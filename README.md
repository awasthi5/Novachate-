# 🚀 NOVACHATE

A modern, secure, and responsive real-time chat application built with the MERN stack + Socket.IO.

![Novachate](https://img.shields.io/badge/Novachate-v1.0.0-indigo)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black)

## ✨ Features

### Core Features
- **Real-time Messaging** — Instant message delivery via Socket.IO
- **User Authentication** — Secure JWT-based auth with bcrypt password hashing
- **One-to-One Chat** — Private conversations between users
- **Online/Offline Status** — Live presence indicators
- **Typing Indicators** — See when someone is typing
- **Read Receipts** — Know when messages are read
- **Message Actions** — Edit, delete, and reply to messages
- **Emoji Support** — Full emoji picker integration
- **File Sharing** — Send images and file attachments
- **User Search** — Find and connect with other users

### UI/UX
- **Responsive Design** — Desktop (3-column), Tablet (2-column), Mobile (single view)
- **Dark/Light Mode** — Theme toggle with localStorage persistence
- **Glassmorphism Design** — Modern frosted glass UI effects
- **Smooth Animations** — Framer Motion transitions
- **Auto-scroll** — Automatically scroll to latest messages
- **Unread Badges** — Visual unread message counts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Library |
| Vite 5 | Build Tool |
| Tailwind CSS 3 | Styling |
| React Router 6 | Routing |
| Axios | HTTP Client |
| Socket.IO Client | Real-time Communication |
| Framer Motion | Animations |
| React Icons | Icon Library |
| Emoji Picker React | Emoji Support |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| Socket.IO | Real-time Server |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Uploads |
| express-rate-limit | Rate Limiting |

---

## 📁 Project Structure

```
Novachat/
├── server/                         # Backend
│   ├── config/db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Logout
│   │   ├── userController.js       # User CRUD, Search, Avatar
│   │   ├── messageController.js    # Messages CRUD
│   │   └── conversationController.js # Conversations CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── errorMiddleware.js      # Error handling
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Message.js              # Message schema
│   │   └── Conversation.js         # Conversation schema
│   ├── routes/                     # API route definitions
│   ├── socket/socket.js            # Socket.IO event handlers
│   ├── uploads/                    # File upload storage
│   ├── .env                        # Environment variables
│   ├── server.js                   # Entry point
│   └── package.json
│
├── client/                         # Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Sidebar.jsx         # Conversation list
│   │   │   ├── ChatWindow.jsx      # Message area
│   │   │   ├── Message.jsx         # Message bubble
│   │   │   ├── MessageInput.jsx    # Input with emoji/file
│   │   │   ├── UserSearch.jsx      # User search
│   │   │   ├── ProfilePanel.jsx    # User profile panel
│   │   │   ├── Navbar.jsx          # Landing navbar
│   │   │   ├── ThemeToggle.jsx     # Dark/light switch
│   │   │   ├── TypingIndicator.jsx # Typing dots
│   │   │   └── EmojiPicker.jsx     # Emoji picker wrapper
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Home page
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── Dashboard.jsx       # Main chat interface
│   │   │   └── Profile.jsx         # Profile editor
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state management
│   │   │   ├── ChatContext.jsx     # Chat state management
│   │   │   └── ThemeContext.jsx    # Theme state management
│   │   ├── services/api.js         # Axios API client
│   │   ├── hooks/useSocket.js      # Socket.IO hook
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── vite.config.js              # Vite + proxy config
│   ├── tailwind.config.js          # Tailwind config
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ ([download](https://nodejs.org))
- **MongoDB Atlas** account (already configured) or local MongoDB
- **Git** (optional)

### 1. Clone / Navigate to Project
```bash
cd Novachat
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment Variables
The `.env` file is pre-configured with your MongoDB Atlas credentials. To customize:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/novachate
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the Backend
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```
Server runs on **http://localhost:5000**

### 5. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 6. Start the Frontend
```bash
npm run dev
```
Client runs on **http://localhost:5173**

### 7. Open the App
Visit **http://localhost:5173** in your browser.

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users` | Get all users | Yes |
| GET | `/api/users/search?q=` | Search users | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| PUT | `/api/users/avatar` | Upload avatar | Yes |

### Conversations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/conversations` | Get user's conversations | Yes |
| POST | `/api/conversations` | Create conversation | Yes |
| GET | `/api/conversations/:id` | Get conversation | Yes |
| DELETE | `/api/conversations/:id` | Delete conversation | Yes |

### Messages
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/messages/:conversationId` | Get messages | Yes |
| POST | `/api/messages` | Send message | Yes |
| PUT | `/api/messages/:id` | Edit message | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |

---

## 🔌 Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `connection` | Server ← Client | User connects |
| `disconnect` | Server ← Client | User disconnects |
| `joinConversation` | Server ← Client | Join a chat room |
| `leaveConversation` | Server ← Client | Leave a chat room |
| `sendMessage` | Server ← Client | Send a message |
| `receiveMessage` | Server → Client | Receive a message |
| `typing` | Bidirectional | User is typing |
| `stopTyping` | Bidirectional | User stopped typing |
| `messageRead` | Bidirectional | Message was read |
| `userOnline` | Server → Client | User came online |
| `userOffline` | Server → Client | User went offline |

---

## 🗄️ Database Schemas

### User
```javascript
{
  name: String,          // Full name
  username: String,      // Unique username
  email: String,         // Unique email
  password: String,      // Hashed (bcrypt, select: false)
  avatar: String,        // Profile picture URL
  bio: String,           // About text
  status: String,        // online | offline | away | busy
  isOnline: Boolean,     // Online status
  lastSeen: Date         // Last seen timestamp
}
```

### Conversation
```javascript
{
  participants: [User],  // Two user references
  lastMessage: Message,  // Last message reference
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  conversation: Conversation,
  sender: User,
  receiver: User,
  text: String,
  attachments: [{filename, originalName, mimetype, size, url}],
  isRead: Boolean,
  replyTo: Message,
  reactions: [{user, emoji}],
  isEdited: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security

- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ JWT token authentication (30-day expiry)
- ✅ Protected API routes via auth middleware
- ✅ CORS configuration
- ✅ Rate limiting (100 requests/15 min)
- ✅ Environment variables for secrets
- ✅ Password field excluded from queries by default
- ✅ Input validation
- ✅ File type/size validation for uploads

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Desktop (1024px+) | 3-column: Sidebar + Chat + Profile Panel |
| Tablet (768px–1023px) | 2-column: Sidebar + Chat |
| Mobile (<768px) | Single view with navigation toggle |

---

## 🎨 Design System

- **Primary Color**: Indigo-600 (`#4F46E5`)
- **Accent**: Violet/Purple gradient
- **Dark Mode**: Gray-900 backgrounds
- **Border Radius**: rounded-xl, rounded-2xl
- **Effects**: Glassmorphism (backdrop-blur), gradient text
- **Font**: System default (Inter recommended)
- **Icons**: Feather Icons via react-icons

---

## 🧪 Testing Instructions

1. **Register** two user accounts
2. **Login** with the first account
3. **Search** for the second user
4. **Click** on the user to create a conversation
5. **Send** a message — it should appear instantly
6. **Open** a second browser/incognito window with the second account
7. **Verify** real-time message delivery
8. **Test** typing indicator, online status, emoji picker
9. **Upload** an image attachment
10. **Edit** and **Delete** a message
11. **Toggle** dark/light mode
12. **Resize** browser to test responsive layout

---

## 🚀 Deployment

### Backend (e.g., Render, Railway)
1. Set environment variables in hosting dashboard
2. Set `NODE_ENV=production`
3. Start command: `node server.js`

### Frontend (e.g., Vercel, Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set API URL environment variable

---

## 📄 License

This project is built for educational purposes as a BCA final-year project.

---

**Built with ❤️ by Novachate Team**
