import api from '@/plugins/axiosinterceptor'

const login = async (req) => {
  const res = await api.post('/user/login', req)

  return res
}

const signup = (req) => {
  return api.post('/user/join', {
    email: req.email,
    name: req.name,
    password: req.password,
  })
}

const profile = async (req) => {
  const token = localStorage.getItem('USERINFO')
  const res = await api.get('/user/profile', {})
  return res
}

const checkEmailDuplicate = async (email) => {
  const res = await api.post('/user/check-email', { email })
  return res
}


export default { login, signup, profile, checkEmailDuplicate }
