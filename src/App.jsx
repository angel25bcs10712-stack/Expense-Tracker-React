import { Navigate, NavLink, Outlet, Route, Routes, BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { FinanceProvider } from './context/FinanceProvider'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Budget from './pages/Budget'
import Analytics from './pages/Analytics'
import EditTransaction from './pages/EditTransaction'

function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Expense Analytics</div>
        <nav className="nav">
          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="nav-link" to="/transactions">
            Transactions
          </NavLink>
          <NavLink className="nav-link" to="/transactions/new">
            Add
          </NavLink>
          <NavLink className="nav-link" to="/budget">
            Budget
          </NavLink>
          <NavLink className="nav-link" to="/analytics">
            Analytics
          </NavLink>
           <ThemeToggle />
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <FinanceProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<AddTransaction />} />
            <Route path="/transactions/edit/:id" element={<EditTransaction />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </FinanceProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
