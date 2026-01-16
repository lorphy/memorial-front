import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)

  useEffect(() => {
    // 验证 token
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-token/${token}`)
        const result = await response.json()
        setTokenValid(response.ok && result.valid)
      } catch (error) {
        console.error('验证 Token 错误:', error)
        setTokenValid(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setMessage('密码长度至少 6 位')
      return
    }

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('密码重置成功！即将跳转到登录页面...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setMessage(result.message || '密码重置失败')
      }
    } catch (error) {
      console.error('请求错误:', error)
      setMessage('请求失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>验证中...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>链接无效或已过期</h2>
          <p>该重置链接已失效，请重新申请密码重置。</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            重新申请
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>重置密码</h1>
        <p>请输入您的新密码</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>新密码 *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="至少 6 位"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>确认新密码 *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="再次输入新密码"
              minLength="6"
            />
          </div>

          {message && (
            <div className="alert" style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '4px',
              backgroundColor: message.includes('失败') || message.includes('不一致') ? '#fee2e2' : '#d1fae5',
              color: message.includes('失败') || message.includes('不一致') ? '#991b1b' : '#065f46'
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
              {loading ? '重置中...' : '重置密码'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
