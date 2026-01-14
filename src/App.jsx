import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MemorialList from './pages/MemorialList'
import MemorialDetail from './pages/MemorialDetail'
import CreateMemorial from './pages/CreateMemorial'
import EditMemorial from './pages/EditMemorial'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Community from './pages/Community'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import Navigation from './components/Navigation'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memorials" element={<MemorialList />} />
          <Route path="/memorial/:id" element={<MemorialDetail />} />
          <Route path="/create" element={<CreateMemorial />} />
          <Route path="/edit/:id" element={<EditMemorial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/create" element={<CreatePost />} />
          <Route path="/community/post/:id" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
