import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import ForgotPassword from './components/ForgotPassword'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import CreatePost from './components/CreatePost'
import ExpertVerification from './components/ExpertVerification'
import PostDetail from './components/PostDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/verify" element={<ExpertVerification />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  )
}

export default App

