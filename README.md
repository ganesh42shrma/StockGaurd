# RBAC Inventory Management System

An **RBAC (Role-Based Access Control)** inventory management system built using the **MERN stack**. The application supports four user roles with distinct permissions:

- **Admin**
- **Category Manager**
- **Price-Limited Manager**
- **Viewer**

---

## Features

### 🔒 Role-Based Permissions
- **Admin**: Full access to all features.
- **Category Manager**: Manages categories and inventories assigned to their roles.
- **Price-Limited Manager**: Manages inventories within their assigned categories.
- **Viewer**: Can view inventories and access overview stats.

### 🏠 Home Page
- Displays all inventories along with images.
- Allows **searching** and **sorting** of inventories.
- Accessible by all roles.

### 📦 Manage Inventory
- Admins, Category Managers, and Price-Limited Managers can:
  - **Add** new inventories (must select a category based on their role permissions).
  - **Edit** or **delete** inventories within permitted categories.

### 📊 Inventory Overview
- Displays inventory statistics with graphs.
- Accessible by all roles.

### 🗂️ Category Management
- Accessible only by **Admins** and **Category Managers**.
- Create and edit categories.
- Assign specific roles to categories for controlled access.

### 👥 User Management
- Accessible only by **Admins**.
- Create or edit users and their roles.

### 🌗 Light/Dark Mode Toggle
- Toggle between light and dark themes using the header button.

### 🚪 Logout
- Logout functionality available in the header.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS / Material UI (depending on your implementation)

---

## Live Demo

The application is deployed on Netlify. You can access it here:  
**[RBAC Inventory Management System](https://stkgaurd.netlify.app)**  

### Admin Login Credentials
- **Email**: `admin@gmail.com`  
- **Password**: `password123`

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:
   - Frontend:
     ```bash
     cd SGFE
     npm install
     ```
   - Backend:
     ```bash
     cd SGBE
     npm install
     ```

3. **Environment Variables**:
   - Create a `.env` file in the backend directory (`SGBE`) with the following:
     ```
     PORT=5000
     MONGO_URI=your_mongo_db_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the application**:
   - Backend:
     ```bash
     cd SGBE
     npm run dev
     ```
   - Frontend:
     ```bash
     cd SGFE
     npm start
     ```

---

## Folder Structure

```plaintext
root
├── SGFE/                  # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── SGBE/                  # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── package.json
├── README.md              # Documentation
```

---

## Future Enhancements

- Add password recovery and reset functionality.
- Implement detailed activity logs for admins.
- Add support for exporting inventory data as CSV/Excel.

---

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
