# 🗂️ MCP Filesystem Server & Client

A full-stack MCP-powered application that allows users to perform file system operations (create, edit, delete, upload) inside a specified directory using a clean web interface. Ideal for minimal remote code manipulation and file handling via prompts.

---

## 👤 Author

**Rishi Kumar**

---

## ✅ Project Overview

This project enables a complete filesystem operation flow using a custom MCP (Minimal Command Protocol) setup that includes:

- 📁 Folder uploads via drag-and-drop or zipped upload
- 📝 Prompt-based editing and file creation
- ❌ File deletion
- ⚙️ RESTful backend operations
- 🌐 Clean UI and interactive frontend

---

## 🔧 Tech Stack

### 🛠 Backend (MCP Server)
- **Node.js**
- **Express.js**
- `fs` module for file handling
- `multer` for file uploads
- `unzipper` for folder extraction

### 📡 Client
- REST-style API via `fetch` / `axios`
- MCP protocol abstraction layer for operations

### 💻 Frontend
- `Next.js` with **TypeScript**
- Drag-and-drop folder input
- Text prompt input for file edits
- Smart layout using **Tailwind CSS**
- ✨ Color Theme: **Blue & Linear Gradient Black**

---

## 🧩 Features

### 1. 🧾 Create File
- REST: `POST /create-file`
- Accepts: filename, content
- Writes file to `uploads/`

### 2. ✍️ Edit File
- REST: `PUT /edit-file`
- Accepts: filename, new content
- Overwrites file content

### 3. ❌ Delete File
- REST: `DELETE /delete-file`
- Accepts: filename
- Deletes file from `uploads/`

### 4. 📦 Upload Folder
- REST: `POST /upload-folder`
- Accepts: zipped folder via form-data
- Unzips into `uploads/`

### 5. 🧠 Smart Prompt-Based Edit
- Users input prompts into a text box
- File updates based on user’s instructions

---

## 📦 Folder_Commander

Browsers do not support zipped uploads natively. We:
- Prompt users to **zip folders manually**
- Or use `JSZip` for client-side compression (future upgrade)

---

---

## 🚀 Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/<RISHIKUMARTHAKUR>/mcp-filesystem
cd mcp-filesystem
