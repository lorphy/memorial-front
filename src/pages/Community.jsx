import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function Community() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [category, setCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [page, category, searchTerm])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let url = `${API_BASE_URL}/api/community/posts?page=${page}&limit=10`
      if (category) url += `&category=${category}`
      if (searchTerm) url += `&search=${searchTerm}`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('获取帖子失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    setPage(1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  const getCategoryLabel = (cat) => {
    const labels = {
      'sharing': '分享',
      'support': '情感支持',
      'question': '问答',
      'other': '其他'
    }
    return labels[cat] || cat
  }

  const getCategoryColor = (cat) => {
    const colors = {
      'sharing': '#10b981',
      'support': '#f59e0b',
      'question': '#3b82f6',
      'other': '#6b7280'
    }
    return colors[cat] || '#6b7280'
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>社区交流</h1>
        <p>分享故事，获得支持，感受温暖</p>
      </div>

      <div className="community-container">
        <div className="community-sidebar">
          <div className="card">
            <h3>发布新帖子</h3>
            <p className="text-muted">分享你的故事或提出问题</p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate('/community/create')}
            >
              发布帖子
            </button>
          </div>

          <div className="card">
            <h3>分类筛选</h3>
            <div className="category-list">
              <button
                className={`category-btn ${category === '' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                全部
              </button>
              <button
                className={`category-btn ${category === 'sharing' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('sharing')}
              >
                📝 分享
              </button>
              <button
                className={`category-btn ${category === 'support' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('support')}
              >
                💕 情感支持
              </button>
              <button
                className={`category-btn ${category === 'question' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('question')}
              >
                ❓ 问答
              </button>
              <button
                className={`category-btn ${category === 'other' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('other')}
              >
                📌 其他
              </button>
            </div>
          </div>
        </div>

        <div className="community-main">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="搜索帖子..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">搜索</button>
          </form>

          {loading ? (
            <div className="loading">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>暂无帖子</p>
              <button className="btn btn-primary" onClick={() => navigate('/community/create')}>
                发布第一个帖子
              </button>
            </div>
          ) : (
            <div className="post-list">
              {posts.map(post => (
                <div
                  key={post._id}
                  className="post-card"
                  onClick={() => navigate(`/community/post/${post._id}`)}
                >
                  {post.isPinned && <div className="pin-badge">📌 置顶</div>}
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="author">{post.author?.username || '匿名'}</span>
                    <span className="date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="post-preview">
                    {post.content?.substring(0, 150)}
                    {post.content?.length > 150 ? '...' : ''}
                  </p>
                  <div className="post-stats">
                    <span>👁️ {post.views || 0}</span>
                    <span>❤️ {post.likeCount || 0}</span>
                    <span>💬 {post.commentCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                上一页
              </button>
              <span className="page-info">
                第 {page} / {totalPages} 页
              </span>
              <button
                className="btn btn-outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Community
