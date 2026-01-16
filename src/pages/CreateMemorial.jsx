import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api.js'

function CreateMemorial() {
  const navigate = useNavigate()
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    console.log(`文件选择事件 - 类型: ${type}, 文件:`, file)
    if (type === 'mainPhoto') {
      setMainPhoto(file)
      console.log('mainPhoto 已设置:', file)
    }
    if (type === 'backgroundMusic') {
      setBackgroundMusic(file)
      console.log('backgroundMusic 已设置:', file)
    }
    if (type === 'backgroundImage') {
      setBackgroundImage(file)
      console.log('backgroundImage 已设置:', file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('\n========== 开始提交表单 ==========')
    console.log('表单数据:', formData)
    console.log('mainPhoto:', mainPhoto)
    console.log('backgroundMusic:', backgroundMusic)
    console.log('backgroundImage:', backgroundImage)

    const data = new FormData()
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key])
      console.log(`添加字段: ${key} = ${formData[key]}`)
    })

    if (mainPhoto) {
      data.append('mainPhoto', mainPhoto)
      console.log(`添加文件: mainPhoto = ${mainPhoto.name} (${mainPhoto.size} bytes)`)
    } else {
      console.log('警告: mainPhoto 为空！')
    }
    if (backgroundMusic) {
      data.append('backgroundMusic', backgroundMusic)
      console.log(`添加文件: backgroundMusic = ${backgroundMusic.name} (${backgroundMusic.size} bytes)`)
    }
    if (backgroundImage) {
      data.append('backgroundImage', backgroundImage)
      console.log(`添加文件: backgroundImage = ${backgroundImage.name} (${backgroundImage.size} bytes)`)
    }

    console.log('\nFormData 完整内容:')
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: ${value.name} (${value.size} bytes, type: ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    const token = localStorage.getItem('token')
    console.log('\nToken 状态:')
    console.log('  存在:', !!token)
    if (token) {
      console.log('  长度:', token.length)
      console.log('  前20字符:', token.substring(0, 20))
    }

    console.log('\n准备发送请求到 /api/memorials')
    console.log('===================================\n')

    try {
      console.log('开始 fetch 请求...')
      const response = await fetch(`${API_BASE_URL}/api/memorials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      })

      console.log('收到响应!')
      console.log('响应状态:', response.status, response.statusText)
      console.log('响应头:', Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log('服务器返回数据:', result)
      console.log('===================================\n')

      if (response.ok) {
        alert('纪念馆创建成功！')
        const memorialId = result._id || result.id
        if (memorialId) {
          navigate(`/memorial/${memorialId}`)
        } else {
          console.error('返回数据中没有找到 ID:', result)
          alert('创建成功，但无法跳转到详情页')
        }
      } else {
        console.error('创建失败:', result)
        alert(result.message || result.error || '创建失败')
      }
    } catch (error) {
      console.error('\n========== 请求错误 ==========')
      console.error('错误名称:', error.name)
      console.error('错误消息:', error.message)
      console.error('错误堆栈:', error.stack)
      console.error('==================================\n')
      alert(`创建失败: ${error.message}`)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>创建纪念馆</h1>
        <p>为逝去的亲人创建一个温馨的纪念空间</p>
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
              <label>主照片 *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'mainPhoto')}
                required
              />
              <small>建议尺寸：800x800px</small>
            </div>
            <div className="form-group">
              <label>背景音乐（可选）</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, 'backgroundMusic')}
              />
              <small>支持MP3格式，最大10MB</small>
            </div>
            <div className="form-group">
              <label>背景图片（可选）</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'backgroundImage')}
              />
              <small>最大5MB</small>
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large">创建纪念馆</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMemorial
