import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/profile')
      } else {
        alert(data.message || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      alert('登录失败，请稍后重试')
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-box">
          <h1>登录</h1>
          <p>欢迎回到网络纪念馆</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="请输入邮箱"
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="请输入密码"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">登录</button>
          </form>
          <div className="auth-footer">
            <p style={{ marginBottom: '10px' }}>
              <Link to="/forgot-password" style={{ color: '#3b82f6', fontSize: '14px' }}>
                忘记密码？
              </Link>
            </p>
            <p>还没有账号？<Link to="/register">立即注册</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
