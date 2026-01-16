// API 配置
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  // 获取 token
  const token = localStorage.getItem('token')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: defaultOptions.headers
  }

  try {
    const response = await fetch(url, finalOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('API 请求错误:', error)
    throw error
  }
}
