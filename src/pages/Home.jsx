import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <section className="hero-section">
        <div className="container hero-content">
          <h1>让爱永恒，让记忆永存</h1>
          <p>为逝去的亲人创建专属网络纪念馆，珍藏美好回忆，寄托无限哀思</p>
          <div className="hero-buttons">
            <Link to="/create" className="btn btn-primary btn-large">创建纪念馆</Link>
            <Link to="/memorials" className="btn btn-outline btn-large">浏览纪念馆</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">核心功能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>多媒体保存</h3>
              <p>保存珍贵的照片、视频、音频和文档，永久留存在云端</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎂</div>
              <h3>重要日期</h3>
              <p>记录生日、忌日等重要日期，系统自动提醒，永不遗忘</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>留言追思</h3>
              <p>访客可以留言、献花、点蜡烛，表达缅怀之情</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>隐私保护</h3>
              <p>严格的权限管理，确保敏感内容安全，保护逝者隐私</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>移动适配</h3>
              <p>完美支持手机访问，随时随地缅怀逝者</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌈</div>
              <h3>个性化定制</h3>
              <p>多种主题风格，自定义背景音乐和图片，打造独特纪念馆</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10000+</div>
              <div className="stat-label">创建的纪念馆</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50000+</div>
              <div className="stat-label">注册用户</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100万+</div>
              <div className="stat-label">上传照片</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">数据安全</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-content">
          <h2>开始您的纪念之旅</h2>
          <p>免费创建纪念馆，让珍贵的记忆永远留存</p>
          <Link to="/create" className="btn btn-primary btn-large">立即创建</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
