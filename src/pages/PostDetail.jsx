import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`/api/community/posts/${id}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        // 检查当前用户是否已点赞
        if (data.likes && user.userId) {
          setLiked(data.likes.some(like => like._id === user.userId || like === user.userId))
        }
      }
    } catch (error) {
      console.error('获取帖子详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('请先登录')
        navigate('/login')
        return
      }

      const response = await fetch(`/api/community/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setPost(prev => ({
          ...prev,
          likeCount: data.likeCount,
          likes: data.liked
            ? [...(prev.likes || []), user.userId]
            : (prev.likes || []).filter(like => like._id !== user.userId)
        }))
      }
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('请先登录')
        navigate('/login')
        return
      }

      const response = await fetch(`/api/community/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      })

      if (response.ok) {
        setCommentText('')
        fetchPost()
      }
    } catch (error) {
      console.error('发表评论失败:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('确定要删除这条评论吗？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/community/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchPost()
      }
    } catch (error) {
      console.error('删除评论失败:', error)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('确定要删除这个帖子吗？此操作不可恢复！')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/community/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('删除成功')
        navigate('/community')
      }
    } catch (error) {
      console.error('删除帖子失败:', error)
    }
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

  if (loading) {
    return <div className="container loading">加载中...</div>
  }

  if (!post) {
    return <div className="container">帖子不存在</div>
  }

  return (
    <div className="container">
      <div className="post-detail">
        <div className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="author">
              👤 {post.author?.username || '匿名'}
            </span>
            <span className="date">
              📅 {new Date(post.createdAt).toLocaleString()}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span className="edited">已编辑</span>
            )}
            <span className="category">
              {getCategoryLabel(post.category)}
            </span>
          </div>
        </div>

        <div className="post-content">
          <div className="post-body">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="post-actions">
            <button
              className={`btn ${liked ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleLike}
            >
              {liked ? '❤️ 已点赞' : '🤍 点赞'} ({post.likeCount || 0})
            </button>
            <button className="btn btn-outline" disabled>
              👁️ 浏览 ({post.views || 0})
            </button>
            {user.userId === post.author?._id && (
              <button
                className="btn btn-danger"
                onClick={handleDeletePost}
              >
                删除帖子
              </button>
            )}
          </div>
        </div>

        <div className="comments-section">
          <h3>评论 ({post.commentCount || 0})</h3>

          {post.isLocked && (
            <div className="locked-notice">
              🔒 此帖子已被锁定，无法添加新评论
            </div>
          )}

          {!post.isLocked && (
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="写下你的评论..."
                rows="4"
                required
              />
              <button type="submit" className="btn btn-primary">
                发表评论
              </button>
            </form>
          )}

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.author?.username || '匿名'}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                  {(comment.author?._id === user.userId || post.author?._id === user.userId) && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      删除
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-comments">暂无评论，成为第一个评论的人吧</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
