import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo">
          <span>🕯️</span>
          <span>网络纪念馆</span>
        </Link>
        <button
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>首页</Link></li>
          <li><Link to="/memorials" onClick={() => setIsMenuOpen(false)}>纪念馆列表</Link></li>
          <li><Link to="/community" onClick={() => setIsMenuOpen(false)}>社区</Link></li>
          <li><Link to="/resources" onClick={() => setIsMenuOpen(false)}>哀伤辅导</Link></li>
        </ul>
        <div className={`nav-buttons ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>登录</Link>
          <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>注册</Link>
          <Link to="/create" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>创建纪念馆</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
