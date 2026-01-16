import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function CreatePost() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'sharing'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('请先登录')
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const post = await response.json()
        alert('发布成功！')
        navigate(`/community/post/${post._id}`)
      } else {
        const result = await response.json()
        alert(result.message || '发布失败')
      }
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败，请稍后重试')
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>发布新帖子</h1>
        <p>分享你的故事，或寻求帮助</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>标题 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="请输入帖子标题（最多100字）"
              maxLength="100"
            />
            <small>{formData.title.length} / 100</small>
          </div>

          <div className="form-group">
            <label>分类 *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="sharing">📝 分享</option>
              <option value="support">💕 情感支持</option>
              <option value="question">❓ 问答</option>
              <option value="other">📌 其他</option>
            </select>
          </div>

          <div className="form-group">
            <label>内容 *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="请输入帖子内容（最多5000字）"
              rows="10"
              maxLength="5000"
            />
            <small>{formData.content.length} / 5000</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/community')}
            >
              取消
            </button>
            <button type="submit" className="btn btn-primary">发布帖子</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
