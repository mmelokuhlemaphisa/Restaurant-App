<img src="https://socialify.git.ci/mmelokuhlemaphisa/Restaurant-App/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Restaurant-App" width="640" height="320" />

---

# 📱 CraveCart Restaurant App

**Built with React Native, Expo, Firebase & Paystack**

---

## 📌 Project Overview

This project is a **full-stack mobile food ordering application** developed using **React Native (Expo)** and **Firebase**. The app allows users to browse a restaurant menu, customize their orders, manage their cart, securely make payments using **Paystack**, and track their orders in real time.

The system also includes an **Admin Dashboard** for restaurant management, allowing administrators to manage food items, track customer orders, update restaurant information, and monitor sales.

This project demonstrates modern **mobile application development**, **cloud database integration**, **authentication**, **payment gateway integration**, and **real-time data handling**.

---

## 🎯 Key Features

### 👤 User Features

* User authentication (Login & Registration)
* Browse food menu by categories
* Add items to cart
* Customize meals with extras and drinks
* View and manage shopping cart
* Secure online payments using Paystack
* Automatic order generation and saving
* Order history tracking
* Address and payment method management

### 🧑‍💼 Admin Features

* Admin authentication
* Add, update, and delete food items
* Manage categories
* View all customer orders
* Track payment status
* Update restaurant information
* Monitor sales and activity

---
### Admin login Details
* email: admin1@gmail.com
* Password: 12345@qwert

## 🛠️ Technologies Used

| Technology              | Purpose                   |
| ----------------------- | ------------------------- |
| React Native (Expo)     | Mobile app development    |
| TypeScript              | Type-safe coding          |
| Firebase Authentication | User login & registration |
| Firestore Database      | Cloud data storage        |
| Redux Toolkit           | State management          |
| Expo Router             | App navigation            |
| Paystack                | Secure payment processing |
| Tailwind / StyleSheet   | UI styling                |

---

## 🗂️ Project Structure

```
app/
 ├── (tabs)/
 ├── admin/
 ├── auth/
 ├── checkout/
 ├── components/
 ├── index.tsx
src/
 ├── services/
 ├── store/
 ├── models/
 └── utils/
```

---

## 🔐 Authentication System

* Firebase Authentication is used.
* Users register and login securely.
* Admin and customer roles are supported.
* Protected routes prevent unauthorized access.

---

## 🛒 Ordering System Workflow

1. User browses menu
2. Adds items to cart
3. Customizes meals
4. Proceeds to checkout
5. Enters address & payment details
6. Pays securely via Paystack
7. Order is saved automatically to Firebase
8. Admin receives the order instantly

---

## 💳 Payment Integration

Payments are securely processed using **Paystack Payment Gateway**.

### Payment Flow:

```
User → Checkout → Paystack → Payment Confirmation → Save Order → Clear Cart → Success Page
```

* Payments are verified before saving the order.
* Only successful payments generate orders.

---

## 🔥 Firestore Database Structure

```
users/
admins/
orders/
menu/
restaurant/
carts/
```

### Orders Collection Example:

```
orders {
  orderNumber
  userId
  items[]
  subtotal
  total
  paymentMethod
  address
  status
  createdAt
}
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npx expo start
```

---

## 🔑 Environment Setup

Create Firebase project and add credentials inside:

```
src/services/FireBase.ts
```

---

## 📊 Admin Dashboard Features

* View real-time customer orders
* Track payment confirmations
* Manage restaurant profile
* Update menu & pricing
* Monitor sales

---




