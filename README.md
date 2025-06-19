# 💬 ChatApp‑MERN

A real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and WebSocket (Socket.IO) for instant messaging.

> 🔥 Live chat • 👥 User auth • ⚡ Instant updates • 🌐 MERN + Socket.IO

---

## 🚀 Live Demo

[View the live demo here](https://your-live-app-link.com)  
*(Replace with actual URL after deployment)*

---

## 📸 Screenshots

<!-- Add screenshots here -->
<!-- Example:
![Login Page](screenshots/login.png)
![Chat Dashboard](screenshots/chat-dashboard.png)
-->

---

## 🛠 Tech Stack

| Technology         | Description                          |
|--------------------|--------------------------------------|
| 🟢 Node.js         | Backend JavaScript runtime           |
| ⚙️ Express.js      | Web server framework                 |
| 📡 Socket.IO       | Real-time bi-directional communication |
| 🌿 MongoDB         | NoSQL database (MongoDB Atlas)       |
| ⚛️ React.js        | Frontend library                     |
| ⚡ Vite             | Fast frontend bundler                |
| 🎨 Tailwind CSS    | UI styling framework *(or CSS)*      |
| 🔐 JWT             | JSON Web Tokens for authentication   |

---

## ✨ Features

- ✅ User sign-up and secure login with JWT
- ✅ Real-time messaging with Socket.IO
- ✅ Private one-to-one chat rooms
- ✅ Chat history saved in MongoDB
- ✅ Online/offline user status
- ✅ Responsive UI for desktop/mobile
- 🔐 Protected routes

---

## 📁 Project Structure

```
chatapp-mern/
├── client/        # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/        # Express + Socket.IO backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── README.md
```

---

## ⚙️ Environment Variables

### 🔐 Backend (`server/.env`)

```env
PORT=8080
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

### 🌐 Frontend (`client/.env.local`)

```env
VITE_API_URL=http://localhost:8080
```

---

## 🧩 API & Socket Endpoints

| Type   | Endpoint/Event             | Description                    |
|--------|----------------------------|--------------------------------|
| HTTP   | `POST /auth/register`      | Register new user              |
| HTTP   | `POST /auth/login`         | Login and receive JWT          |
| HTTP   | `GET /users`               | List all users (protected)     |
| Socket | `join`                     | A user joins a chat room       |
| Socket | `sendMessage`              | Send message to room           |
| Socket | `receiveMessage`           | Receive message from room      |
| HTTP   | `GET /messages/:userId`    | Load chat history with a user  |

> All HTTP routes under `/users` and `/messages` require a valid JWT token.

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/hardik-gojiya/chatapp-mern.git
cd chatapp-mern
```

### 🔧 Backend Setup

```bash
cd server
npm install
# Create .env as shown above
npm run dev
```

### 💻 Frontend Setup

```bash
cd ../client
npm install
# Create .env.local as shown above
npm run dev
```

- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:8080`

---

## 🧑‍💻 Author

**Hardik Gojiya**  
🔗 [GitHub: @hardik-gojiya](https://github.com/hardik-gojiya)

---

## 📌 Roadmap

- [ ] Add group chat / chat rooms
- [ ] Voice & video call support
- [ ] File/image sharing in chats
- [ ] Real-time emoji reactions
- [ ] Online status indicators
- [ ] Mobile-first responsive UI
- [ ] Deploy on Vercel / Heroku / Render

---

## 🤝 Contribution

Feedback, issues, feature requests, and pull requests are all welcome!  
Feel free to fork this repo and open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🌟 Support

If you like this project, don’t forget to ⭐ star the repo on GitHub!



![chatapp-mern](https://github.com/user-attachments/assets/b2103c31-3a26-4830-80d0-2b25c21ee4f4)
