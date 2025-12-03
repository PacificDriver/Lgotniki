import axios from 'axios'

const resolveApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api'
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`
  }

  return 'http://localhost:3001/api'
}

const API_URL = resolveApiBaseUrl()

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
  list: async (activeOnly = false, params = {}) => {
    const queryParams = { activeOnly, ...params }
    const response = await api.get('/benefit-types', {
      params: queryParams,
    })
    return response.data
  },
  get: async id => {
    const response = await api.get(`/benefit-types/${id}`)
    return response.data
  },
  checkRelatedData: async id => {
    const response = await api.get(`/benefit-types/${id}/check-related-data`)
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
  deleteMany: async ids => {
    const response = await api.delete('/benefit-types/bulk', { data: { ids } })
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
  execute: async (id, data = {}) => {
    const response = await api.post(`/calculation-tasks/${id}/execute`, data)
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
  list: async (params = {}) => {
    const response = await api.get('/users/operators', { params })
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

// Stations API
export const stationsAPI = {
  list: async (params = {}) => {
    const response = await api.get('/stations', { params })
    return response.data
  },
  get: async id => {
    const response = await api.get(`/stations/${id}`)
    return response.data
  },
  sync: async () => {
    const response = await api.post('/stations/sync')
    return response.data
  },
  syncRoutes: async () => {
    const response = await api.post('/stations/routes/sync')
    return response.data
  },
  getSyncLogs: async (params = {}) => {
    const response = await api.get('/stations/logs/sync', { params })
    return response.data
  },
  getRaces: async (from, to, date) => {
    const response = await api.get('/stations/races/search', {
      params: { from, to, date },
    })
    return response.data
  },
}

// Routes API
export const routesAPI = {
  list: async (params = {}) => {
    const response = await api.get('/routes', { params })
    return response.data
  },
  getRouteNumbers: async () => {
    const response = await api.get('/routes/numbers')
    return response.data
  },
  get: async id => {
    const response = await api.get(`/routes/${id}`)
    return response.data
  },
  create: async data => {
    const response = await api.post('/routes', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/routes/${id}`, data)
    return response.data
  },
  delete: async id => {
    const response = await api.delete(`/routes/${id}`)
    return response.data
  },
}

export default api
