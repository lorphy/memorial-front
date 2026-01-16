import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function MemorialDetail() {
  const { id } = useParams()
  const [memorial, setMemorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('photos')
  const [showCandle, setShowCandle] = useState(false)
  const [showFlower, setShowFlower] = useState(false)

  useEffect(() => {
    fetchMemorial()
  }, [id])

  const fetchMemorial = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setMemorial(data)
      }
    } catch (error) {
      console.error('获取纪念馆失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveMessage = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/memorials/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
      })
      if (response.ok) {
        setMessage('')
        alert('留言成功')
        fetchMemorial()
      }
    } catch (error) {
      console.error('留言失败:', error)
    }
  }

  const handleCandle = async () => {
    setShowCandle(true)
    try {
      await fetch(`/api/memorials/${id}/candle`, { method: 'POST' })
    } catch (error) {
      console.error('点蜡烛失败:', error)
    }
  }

  const handleFlower = async () => {
    setShowFlower(true)
    try {
      await fetch(`/api/memorials/${id}/flower`, { method: 'POST' })
    } catch (error) {
      console.error('献花失败:', error)
    }
  }

  if (loading) {
    return <div className="container loading">加载中...</div>
  }

  if (!memorial) {
    return <div className="container">纪念馆不存在</div>
  }

  return (
    <div className="memorial-detail">
      <div className="memorial-hero" style={{
        backgroundImage: memorial.backgroundImage ? `url(${memorial.backgroundImage})` : 'none'
      }}>
        <div className="hero-overlay">
          <div className="container hero-content">
            {memorial.mainPhoto && (
              <div className="main-photo">
                <img src={memorial.mainPhoto} alt={memorial.name} />
              </div>
            )}
            <div className="hero-text">
              <h1>{memorial.name}</h1>
              <p className="dates">
                {memorial.birthDate} - {memorial.deathDate}
              </p>
              {memorial.epitaph && (
                <p className="epitaph">{memorial.epitaph}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container memorial-content">
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleCandle}>
            {showCandle ? '🕯️ 已点烛' : '🕯️ 点蜡烛'}
          </button>
          <button className="btn btn-secondary" onClick={handleFlower}>
            {showFlower ? '💐 已献花' : '💐 献花'}
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            📸 照片
          </button>
          <button
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            📅 人生时间线
          </button>
          <button
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            💬 留言
          </button>
        </div>

        {activeTab === 'photos' && (
          <div className="tab-content">
            <div className="photo-gallery">
              {memorial.photos && memorial.photos.length > 0 ? (
                <>
                  {memorial.mainPhoto && (
                    <div key="main-photo" className="photo-item main-photo-item">
                      <img src={memorial.mainPhoto} alt={memorial.name} />
                      <p>主照片</p>
                    </div>
                  )}
                  {memorial.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo.url} alt={photo.description || '照片'} />
                      {photo.description && <p>{photo.description}</p>}
                    </div>
                  ))}
                </>
              ) : (
                memorial.mainPhoto ? (
                  <div key="main-photo" className="photo-item main-photo-item">
                    <img src={memorial.mainPhoto} alt={memorial.name} />
                    <p>主照片</p>
                  </div>
                ) : (
                  <p>暂无照片</p>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="tab-content">
            <div className="timeline">
              {memorial.timeline && memorial.timeline.length > 0 ? (
                memorial.timeline.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-date">{event.date}</div>
                    <div className="timeline-content">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>暂无时间线记录</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="tab-content">
            <div className="message-board">
              <form className="message-form" onSubmit={handleLeaveMessage}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下您的思念..."
                  rows="4"
                />
                <button type="submit" className="btn btn-primary">发表留言</button>
              </form>

              <div className="messages-list">
                {memorial.messages && memorial.messages.length > 0 ? (
                  memorial.messages.map((msg, index) => (
                    <div key={index} className="message-item">
                      <div className="message-header">
                        <span className="author">{msg.author || '访客'}</span>
                        <span className="date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  ))
                ) : (
                  <p>暂无留言，成为第一个留言的人吧</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MemorialDetail
