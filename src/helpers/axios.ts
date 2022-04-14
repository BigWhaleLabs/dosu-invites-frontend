import { handleError } from 'helpers/handleError'
import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND as string
const headers = { 'Content-Type': 'application/json' }

const Api = axios.create({ baseURL, headers })

Api.interceptors.request.use((request) => {
  request.headers = { ...request.headers }
  return request
})

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleError(error)
    throw error
  }
)

export default Api
