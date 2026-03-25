# 💰 Personal Finance & Expense Analytics App

A modern **React-based Personal Finance App** to track income, expenses, budgets, and gain powerful financial insights through analytics and charts.

---

## 🚀 Overview

Managing personal finances can be difficult without proper tools. This app helps users:

* Track income and expenses
* Categorize spending
* Monitor monthly budgets
* Analyze financial behavior
* Visualize data using charts

It simulates a **real-world consumer finance product** built using modern React practices.

---

## 🎯 Features

### ✅ Transaction Management

* Add income & expense transactions
* Edit and delete transactions
* Categorize spending
* Add notes and recurring flags

---

### 🔍 Search & Filter

* Search by title or notes
* Filter by:

  * Category
  * Transaction type
  * Date range

---

### 📊 Sorting

* Sort transactions by:

  * Date
  * Amount
  * Category

---

### 💸 Budget Tracking

* Set monthly budget
* View:

  * Total spending
  * Remaining budget
  * Percentage used

---

### 📈 Analytics Dashboard

* Total Income
* Total Expenses
* Net Balance
* Top spending category

#### Charts:

* Pie Chart → Category-wise spending
* Line Chart → Monthly trends
* Bar Chart → Income vs Expense

---

### 🔁 Recurring Expenses

* Mark transactions as recurring
* Easily track subscriptions and fixed costs

---

## 🧑‍💻 Tech Stack

* React (Vite)
* React Router DOM
* Context API (Global State)
* Axios
* Recharts
* React Hook Form + Yup
* Date-fns
* UUID
* Framer Motion
* React Toastify

---

## 📂 Folder Structure

```
src/

components/
  TransactionCard/
  Charts/
  SearchBar/
  Filters/
  BudgetCard/

pages/
  Dashboard/
  Transactions/
  AddTransaction/
  Budget/
  Analytics/

context/
  FinanceContext/

hooks/
  useTransactions/
  useBudget/
  useDebounce/

services/
  api.js

utils/
  currencyFormatter.js
```

---

## 🛣️ Routes

| Page            | Route             |
| --------------- | ----------------- |
| Dashboard       | /dashboard        |
| Transactions    | /transactions     |
| Add Transaction | /transactions/new |
| Budget          | /budget           |
| Analytics       | /analytics        |

---

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# Navigate to project folder
cd your-repo-name

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 🌐 APIs Used

### Currency Exchange API

* Used for currency conversion

```
https://api.exchangerate-api.com
```

---

### (Optional) Financial News API

```
https://newsapi.org
```

---

## 🧠 Key Concepts Used

* useState → Form inputs, filters, search
* useEffect → Data updates & analytics
* Context API → Global state management
* Custom Hooks → Reusable logic
* Debouncing → Optimized search
* Routing → Multi-page navigation

---

## 📦 Data Models

### Transaction

```json
{
  "id": "string",
  "title": "string",
  "amount": 0,
  "category": "string",
  "type": "income | expense",
  "date": "date",
  "notes": "string",
  "recurring": false
}
```

---

### Budget

```json
{
  "monthlyBudget": 0
}
```

---

## 📱 Non-Functional Features

* Responsive design
* Fast loading
* Loading states
* Empty state handling

---

## 🧪 Evaluation Criteria

| Criteria             | Weight |
| -------------------- | ------ |
| Feature completeness | 25%    |
| React architecture   | 25%    |
| State management     | 20%    |
| UI design            | 15%    |
| Code quality         | 15%    |

---

## 💡 Future Improvements

* Authentication (Login/Signup)
* Cloud storage (Firebase / Backend)
* Dark mode
* Export reports (PDF/CSV)
* AI-based spending insights

---

## 🤝 Contributing

Feel free to fork the project and submit pull requests.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---
