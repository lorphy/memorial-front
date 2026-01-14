import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo">
          <span>🕯️</span>
          <span>网络纪念馆</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">首页</Link></li>
          <li><Link to="/memorials">纪念馆列表</Link></li>
          <li><Link to="/community">社区</Link></li>
          <li><Link to="/resources">哀伤辅导</Link></li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login" className="btn btn-outline">登录</Link>
          <Link to="/register" className="btn btn-primary">注册</Link>
          <Link to="/create" className="btn btn-secondary">创建纪念馆</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
