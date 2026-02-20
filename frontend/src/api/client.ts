import axios from 'axios'

/**
 * API base URL: production uses VITE_API_BASE_URL; dev uses relative /api (Vite proxy).
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', data)

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data)

// Profile
export const getProfile = () => api.get<UserProfile>('/profile')

// Analysis
export const analyzeResume = (jobDescription: string, file: File) => {
  const form = new FormData()
  form.append('jobDescription', jobDescription)
  form.append('resume', file)
  return api.post<AnalysisResponse>('/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getHistory = (page = 0, size = 20) =>
  api.get<AnalysisHistoryItem[]>(`/analyze/history?page=${page}&size=${size}`)

export const getAnalysis = (id: number) => api.get<AnalysisResponse>(`/analyze/${id}`)

export const deleteAnalysis = (id: number) => api.delete(`/analyze/${id}`)

export const downloadReport = (id: number) =>
  api.get(`/analyze/${id}/report`, { responseType: 'blob' })

// Types
export interface AuthResponse {
  token: string
  type: string
  id: number
  name: string
  email: string
  role: string
}

export interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export interface AnalysisResponse {
  analysisId: number
  matchPercentage: number
  resumeScore: number
  matchedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  readabilityScore?: number
  atsCompatible?: boolean
}

export interface AnalysisHistoryItem {
  id: number
  matchPercentage: number
  resumeScore: number
  createdAt: string
}
