import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })
      const data = await response.json()
      if (response.ok) {
        alert('注册成功！请登录')
        navigate('/login')
      } else {
        alert(data.message || '注册失败')
      }
    } catch (error) {
      console.error('注册错误:', error)
      alert('注册失败，请稍后重试')
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-box">
          <h1>注册</h1>
          <p>创建您的账号，开始创建纪念馆</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="请输入用户名"
              />
            </div>
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
                placeholder="请输入密码（至少6位）"
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="请再次输入密码"
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">注册</button>
          </form>
          <div className="auth-footer">
            <p>已有账号？<Link to="/login">立即登录</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
