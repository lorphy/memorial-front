import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(result.message)
        console.log('重置链接:', result.resetUrl)
      } else {
        setMessage(result.message || '请求失败')
      }
    } catch (error) {
      console.error('请求错误:', error)
      setMessage('请求失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>找回密码</h1>
        <p>输入您的邮箱，我们将发送密码重置链接</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>邮箱地址 *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="请输入注册邮箱"
            />
          </div>

          {message && (
            <div className="alert" style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '4px',
              backgroundColor: message.includes('失败') ? '#fee2e2' : '#d1fae5',
              color: message.includes('失败') ? '#991b1b' : '#065f46'
            }}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '发送中...' : '发送重置邮件'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>
            记起密码了？{' '}
            <a href="/login" style={{ color: '#3b82f6' }}>
              返回登录
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
