# Simple Auction Platform

A full-stack auction platform where users can place bids on a product and admins can manage the listing. Built as a take-home assignment using **React**, **Tailwind CSS**, **Node.js**, and **MongoDB**.

---

## 📦 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based Admin login

---

## Features

### Public Auction Page
- View active product (image, title, description, starting bid)
- See the **current highest bid**
- Submit a bid (name, email, amount)
- View the **last 5–10 bids**
- Manual refresh to update bids

###  Admin Panel
- Login with email/password
- Add a new product (title, description, image URL, starting bid)
- View current product details
- View full bid history for the current product
- Logout functionality

>  No user registration or login is required for placing bids.

---

## Admin Credentials

Use the following credentials to log in:
- Email: admin@auction.com
- Password: admin123

---
### Backend Setup

```bash
cd server
npm install
```

### Create a `.env` file inside `/server` with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Start the server
```bash
node server.js
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

## API Endpoints
- Auth 
    - POST `/api/auth/login`: Admin login

- Products 
    - GET `/api/product`: Get current active product

    - POST `/api/product`: Add a new product (admin only)

- Bids 
    -  GET `/api/bids/:productId`: Get last 10 bids

    -  POST `/api/bids`: Submit a new bid


### Screenshots

![Auction Platform Screenshot](https://i.imgur.com/1z5Z9kH.png)



### Database Schema
```json
{
  "Admin": {
    "email": "String",
    "password": "String (hashed)"
  },
  "Product": {
    "title": "String",
    "description": "String",
    "image_url": "String",
    "starting_bid": "Number",
    "created_at": "Date"
  },
  "Bid": {
    "product_id": "ObjectId (Reference to Product)",
    "bidder_name": "String",
    "bidder_email": "String",
    "amount": "Number",
    "created_at": "Date"
  }
}

```

---


## Time log
| Task | Time Spent |
| --- | --- |
| Initial Setup | 30 min |
| Backend Development | 3 hours |
| Frontend Development | 4 hours |
| Testing & Debugging | 1 hour |
| Documentation | 1 hour |
| **Total** | **9.5 hours** |


---


