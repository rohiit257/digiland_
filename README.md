# 🏡 Blockchain & AI-powered Land Regitry and Record Management System

## 📌 Project Overview
This is a **decentralized land record management system** that leverages **Blockchain, AI, and IPFS** to securely store and verify property ownership records. It ensures **transparency, immutability, and fraud detection** in property transactions.

Users can:
✅ **Register land** with location & document verification.  
✅ **Transfer ownership** of properties.  
✅ **Detect fraudulent transactions** using AI.  
✅ **Perform KYC verification** for secure operations.  
✅ **View transaction history** for each property.  
✅ **Admin dashboard** for property verification and fraud analysis.

---

## 🚀 Tech Stack

### 🏗️ **Frontend:**
- **Next.js** – Modern React framework for UI & routing.
- **Tailwind CSS** – For a sleek and responsive design.
- **Ethers.js** – Interaction with Ethereum blockchain.
- **Axios** – API requests to backend services.

### 🔗 **Blockchain & Smart Contracts:**
- **Solidity** – Smart contract development.
- **Hardhat** – Ethereum development environment.
- **Ethers.js** – Connecting frontend with smart contracts.
- **MetaMask** – Wallet authentication.

### 🗄️ **Backend & Database:**
- **Node.js & Express** – Backend APIs for user & property data.
- **MongoDB (Mongoose)** – Storing KYC and user records.
- **Pinata (IPFS)** – Decentralized file storage for property documents.

### 🤖 **AI for Fraud Detection:**
- **Google Gemini AI API** – Ownership verification & fraud detection.
- **AI-powered transaction analysis** – Detects suspicious transfers.

---

## 📜 Features & Functionality

### 🔑 **User Features:**
- **Connect Wallet**: Users sign in using MetaMask.
- **Complete KYC**: Users must submit their details before any transactions.
- **Register Property**: Store location & document hash on blockchain.
- **Transfer Ownership**: Securely transfer property to another wallet.
- **Transaction History**: View all past ownership transfers.
- **AI Fraud Detection**: Analyze past transactions to detect fraudulent activity.

### 🔥 **Admin Features:**
- **Verify Properties**: Admin can approve land registrations.
- **Monitor Transactions**: View transaction history of properties.
- **Detect Fraudulent Transfers**: AI-based ownership analysis.

---

## 📂 Project Structure
```
📂 land-record-management
│── 📁 frontend (Next.js)
│    │── 📁 app
│    │    │── 📁 components  # Reusable UI components
│    │    │── 📁 context     # Wallet authentication
│    │    │── 📁 pages       # Main UI pages (dashboard, KYC, register land)
│    │── 📁 public          # Static assets
│    │── 📁 styles          # Tailwind CSS styles
│── 📂 backend (Node.js & MongoDB)
│    │── 📁 models         # Mongoose schemas
│    │── 📁 routes         # API endpoints
│    │── 📁 config         # Database connection
│── 📂 smart-contracts (Hardhat & Solidity)
│    │── 📁 contracts      # Smart contracts for land registry
│    │── 📁 scripts        # Deployment & testing scripts
│── 📜 README.md           # Project documentation
```

---

## 🎯 How to Run the Project

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/land-record-management.git
cd land-record-management
```

### 2️⃣ **Install Dependencies**
```sh
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create `.env` files for both frontend & backend with:
```sh
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Pinata (IPFS) API Keys
PINATA_API_KEY=your_api_key
PINATA_SECRET_API_KEY=your_secret_api_key

# Google Gemini AI API Key
GEMINI_API_KEY=your_google_ai_key
```

### 4️⃣ **Deploy Smart Contracts**
```sh
cd smart-contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
> Replace `sepolia` with your target Ethereum network.

### 5️⃣ **Run Backend**
```sh
cd backend
npm start
```

### 6️⃣ **Run Frontend**
```sh
cd frontend
npm run dev
```

Open **http://localhost:3000** to view the app.

---

## 📢 Future Enhancements
✅ **Multi-Signature Verification** – Requires multiple admin approvals for transfers.  
✅ **Auction System** – Users can bid on verified properties.  
✅ **More AI Insights** – Advanced fraud detection & ownership legitimacy scoring.  

---

## 🤝 Contributing
Feel free to contribute to this project! Fork the repo, make changes, and submit a PR. 🚀

---

## 📜 License
MIT License. Free to use & modify!

