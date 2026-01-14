import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [memorials, setMemorials] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchMemorials()
  }, [navigate])

  const fetchMemorials = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/memorials/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMemorials(data)
      }
    } catch (error) {
      console.error('获取我的纪念馆失败:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个纪念馆吗？此操作不可恢复！')) {
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/memorials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('纪念馆删除成功！')
        fetchMemorials()
      } else {
        const result = await response.json()
        alert(result.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert(`删除失败: ${error.message}`)
    }
  }

  const filteredMemorials = memorials.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) return null

  return (
    <div className="container">
      <div className="profile-header">
        <h1>欢迎，{user.username}</h1>
        <button className="btn btn-outline" onClick={handleLogout}>退出登录</button>
      </div>

      <div className="profile-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>我的纪念馆</h2>
          {memorials.length > 0 && (
            <div className="search-section" style={{ flex: 1, marginLeft: '20px' }}>
              <input
                type="text"
                className="search-input"
                placeholder="搜索我的纪念馆..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', maxWidth: '300px' }}
              />
            </div>
          )}
        </div>

        {memorials.length === 0 ? (
          <div className="empty-state">
            <p>您还没有创建任何纪念馆</p>
            <button className="btn btn-primary" onClick={() => navigate('/create')}>
              创建纪念馆
            </button>
          </div>
        ) : (
          <div className="memorial-grid">
            {filteredMemorials.map(memorial => (
              <div key={memorial._id} className="memorial-card">
                {memorial.mainPhoto && (
                  <div className="memorial-photo">
                    <img src={memorial.mainPhoto} alt={memorial.name} />
                  </div>
                )}
                <div className="memorial-info">
                  <h3>{memorial.name}</h3>
                  <p className="dates">
                    {memorial.birthDate} - {memorial.deathDate}
                  </p>
                  <div style={{ marginBottom: '10px' }}>
                    {memorial.privacy === 'public' && <span className="badge badge-public">公开</span>}
                    {memorial.privacy === 'semi-private' && <span className="badge badge-semi">半公开</span>}
                    {memorial.privacy === 'private' && <span className="badge badge-private">私密</span>}
                    {memorial.privacy === 'restricted' && <span className="badge badge-restricted">完全私密</span>}
                  </div>
                  <div className="memorial-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/memorial/${memorial._id}`)}
                    >
                      查看
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/edit/${memorial._id}`)}
                    >
                      编辑
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(memorial._id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="create-card" onClick={() => navigate('/create')}>
              <div className="create-icon">+</div>
              <p>创建新纪念馆</p>
            </div>
          </div>
        )}

        {memorials.length > 0 && filteredMemorials.length === 0 && (
          <div className="empty-state">
            <p>没有找到匹配的纪念馆</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
