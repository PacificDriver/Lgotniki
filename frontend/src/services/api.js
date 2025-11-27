import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('lgotniki_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lgotniki_token')
      localStorage.removeItem('lgotniki_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  logout: () => {
    localStorage.removeItem('lgotniki_token')
    localStorage.removeItem('lgotniki_user')
  },
}

// Beneficiaries API
export const beneficiariesAPI = {
  list: async (params = {}) => {
    const response = await api.get('/beneficiaries', { params })
    return response.data
  },
  get: async id => {
    const response = await api.get(`/beneficiaries/${id}`)
    return response.data
  },
  create: async data => {
    const response = await api.post('/beneficiaries', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/beneficiaries/${id}`, data)
    return response.data
  },
  delete: async id => {
    const response = await api.delete(`/beneficiaries/${id}`)
    return response.data
  },
  getOperations: async id => {
    const response = await api.get(`/beneficiaries/${id}/operations`)
    return response.data
  },
}

// Benefit Types API
export const benefitTypesAPI = {
  list: async (activeOnly = false) => {
    const response = await api.get('/benefit-types', {
      params: { activeOnly },
    })
    return response.data
  },
  get: async id => {
    const response = await api.get(`/benefit-types/${id}`)
    return response.data
  },
  create: async data => {
    const response = await api.post('/benefit-types', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/benefit-types/${id}`, data)
    return response.data
  },
  delete: async id => {
    const response = await api.delete(`/benefit-types/${id}`)
    return response.data
  },
}

// Calculation Tasks API
export const calculationTasksAPI = {
  list: async (params = {}) => {
    const response = await api.get('/calculation-tasks', { params })
    return response.data
  },
  get: async id => {
    const response = await api.get(`/calculation-tasks/${id}`)
    return response.data
  },
  create: async data => {
    const response = await api.post('/calculation-tasks', data)
    return response.data
  },
  execute: async id => {
    const response = await api.post(`/calculation-tasks/${id}/execute`)
    return response.data
  },
}

// File Upload API
export const fileUploadAPI = {
  upload: async (file, loadMode) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('loadMode', loadMode)
    const response = await api.post('/file-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
  updateProfile: async data => {
    const response = await api.put('/users/me', data)
    return response.data
  },
}

export const operatorsAPI = {
  list: async () => {
    const response = await api.get('/users/operators')
    return response.data
  },
  create: async data => {
    const response = await api.post('/users/operators', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/users/operators/${id}`, data)
    return response.data
  },
  delete: async id => {
    const response = await api.delete(`/users/operators/${id}`)
    return response.data
  },
}

// Public API (for ticket sales integration)
export const publicAPI = {
  checkBenefit: async data => {
    const response = await api.post('/api/check-benefit', data)
    return response.data
  },
  recordUsage: async data => {
    const response = await api.post('/api/record-usage', data)
    return response.data
  },
}

export default api
