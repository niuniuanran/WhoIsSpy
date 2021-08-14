import axios from 'axios'

interface ApiConfig {
  payload?: any,
  path?: string,
  headers?: any,
  method?: "GET"|"POST"|"PUT"|"DELETE"
}

const CallApi = async ({ payload, path, method="POST", headers = {} }:ApiConfig) => {
  try {
    const { data } = await axios({
      method,
      url:`https://${process.env.REACT_APP_API_BASE_URL}/${path}`,
      headers,
      data: payload
    });
  
    return data;
  } catch (error) {
    throw error
  }
}

export { CallApi }