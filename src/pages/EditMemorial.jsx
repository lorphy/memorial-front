import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function EditMemorial() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    hometown: '',
    profession: '',
    epitaph: '',
    biography: '',
    privacy: 'semi-private',
    password: ''
  })
  const [mainPhoto, setMainPhoto] = useState(null)
  const [backgroundMusic, setBackgroundMusic] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [existingMainPhoto, setExistingMainPhoto] = useState('')
  const [existingBackgroundMusic, setExistingBackgroundMusic] = useState('')
  const [existingBackgroundImage, setExistingBackgroundImage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemorial()
  }, [id])

  const fetchMemorial = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || '',
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
          deathDate: data.deathDate ? data.deathDate.split('T')[0] : '',
          hometown: data.hometown || '',
          profession: data.profession || '',
          epitaph: data.epitaph || '',
          biography: data.biography || '',
          privacy: data.privacy || 'semi-private',
          password: data.password || ''
        })
        setExistingMainPhoto(data.mainPhoto || '')
        setExistingBackgroundMusic(data.backgroundMusic || '')
        setExistingBackgroundImage(data.backgroundImage || '')
      }
    } catch (error) {
      console.error('获取纪念馆失败:', error)
      alert('获取纪念馆失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (type === 'mainPhoto') {
      setMainPhoto(file)
    }
    if (type === 'backgroundMusic') {
      setBackgroundMusic(file)
    }
    if (type === 'backgroundImage') {
      setBackgroundImage(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key])
    })

    if (mainPhoto) {
      data.append('mainPhoto', mainPhoto)
    }
    if (backgroundMusic) {
      data.append('backgroundMusic', backgroundMusic)
    }
    if (backgroundImage) {
      data.append('backgroundImage', backgroundImage)
    }

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      })

      if (response.ok) {
        alert('纪念馆更新成功！')
        navigate(`/memorial/${id}`)
      } else {
        const result = await response.json()
        alert(result.message || result.error || '更新失败')
      }
    } catch (error) {
      console.error('更新失败:', error)
      alert(`更新失败: ${error.message}`)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个纪念馆吗？此操作不可恢复！')) {
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('纪念馆删除成功！')
        navigate('/profile')
      } else {
        const result = await response.json()
        alert(result.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert(`删除失败: ${error.message}`)
    }
  }

  if (loading) {
    return <div className="container loading">加载中...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>编辑纪念馆</h1>
        <p>修改纪念馆的信息</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>基本信息</h3>
            <div className="form-group">
              <label>姓名 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="请输入逝者姓名"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>出生日期 *</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>逝世日期 *</label>
                <input
                  type="date"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>籍贯</label>
                <input
                  type="text"
                  name="hometown"
                  value={formData.hometown}
                  onChange={handleChange}
                  placeholder="请输入籍贯"
                />
              </div>
              <div className="form-group">
                <label>职业</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="请输入职业"
                />
              </div>
            </div>
            <div className="form-group">
              <label>座右铭/墓志铭</label>
              <input
                type="text"
                name="epitaph"
                value={formData.epitaph}
                onChange={handleChange}
                placeholder="请输入座右铭或墓志铭"
              />
            </div>
            <div className="form-group">
              <label>生平简介</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                placeholder="请输入生平简介（最多5000字）"
                maxLength="5000"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>照片与音乐</h3>
            <div className="form-group">
              <label>主照片</label>
              {existingMainPhoto && (
                <div style={{ marginBottom: '10px' }}>
                  <img src={existingMainPhoto} alt="当前主照片" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  <p style={{ fontSize: '12px', color: '#666' }}>当前照片</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'mainPhoto')}
              />
              <small>不选择则保持原照片</small>
            </div>
            <div className="form-group">
              <label>背景音乐</label>
              {existingBackgroundMusic && (
                <div style={{ marginBottom: '10px' }}>
                  <audio controls src={existingBackgroundMusic} style={{ maxWidth: '300px' }} />
                  <p style={{ fontSize: '12px', color: '#666' }}>当前背景音乐</p>
                </div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, 'backgroundMusic')}
              />
              <small>不选择则保持原音乐</small>
            </div>
            <div className="form-group">
              <label>背景图片</label>
              {existingBackgroundImage && (
                <div style={{ marginBottom: '10px' }}>
                  <img src={existingBackgroundImage} alt="当前背景图片" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  <p style={{ fontSize: '12px', color: '#666' }}>当前背景图片</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'backgroundImage')}
              />
              <small>不选择则保持原图片</small>
            </div>
          </div>

          <div className="form-section">
            <h3>隐私设置</h3>
            <div className="form-group">
              <label>访问权限</label>
              <select
                name="privacy"
                value={formData.privacy}
                onChange={handleChange}
              >
                <option value="public">公开 - 任何人可访问</option>
                <option value="semi-private">半公开 - 需要密码访问</option>
                <option value="private">私密 - 仅授权用户可访问</option>
                <option value="restricted">完全私密 - 仅主管理员可见</option>
              </select>
            </div>
            {formData.privacy === 'semi-private' && (
              <div className="form-group">
                <label>访问密码</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请设置访问密码"
                />
              </div>
            )}
          </div>

          <div className="form-section" style={{ borderColor: '#dc3545', backgroundColor: '#fff5f5' }}>
            <h3 style={{ color: '#dc3545' }}>危险操作</h3>
            <p style={{ marginBottom: '15px', color: '#666' }}>删除纪念馆后将无法恢复，请谨慎操作。</p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              style={{ backgroundColor: '#dc3545' }}
            >
              删除纪念馆
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(`/memorial/${id}`)}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">保存修改</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMemorial
