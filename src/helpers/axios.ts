import axios from 'axios'
import env from 'helpers/env'
import handleError from 'helpers/handleError'

const baseURL = env.VITE_ALLOWLIST_ENDPOINT
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
