import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MemorialList() {
  const [memorials, setMemorials] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemorials()
  }, [])

  const fetchMemorials = async () => {
    try {
      const response = await fetch('/api/memorials')
      const data = await response.json()
      setMemorials(data)
    } catch (error) {
      console.error('获取纪念馆列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMemorials = memorials.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container">
      <div className="page-header">
        <h1>纪念馆列表</h1>
        <p>浏览所有公开的纪念馆</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="搜索纪念馆..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="memorial-grid">
          {filteredMemorials.map(memorial => (
            <Link
              key={memorial._id}
              to={`/memorial/${memorial._id}`}
              className="memorial-card-link"
            >
              <div className="memorial-card">
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
                  {memorial.epitaph && (
                    <p className="epitaph">{memorial.epitaph}</p>
                  )}
                  <div className="memorial-stats">
                    <span>👁️ {memorial.views || 0}</span>
                    <span>💐 {memorial.flowers || 0}</span>
                    <span>💬 {memorial.messages || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredMemorials.length === 0 && (
        <div className="empty-state">
          <p>没有找到匹配的纪念馆</p>
        </div>
      )}
    </div>
  )
}

export default MemorialList
