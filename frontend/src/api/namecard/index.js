import { apiFetch } from '@/plugins/axiosinterceptor'

const getNamecardInfo = async () => {
  try {
    const res = await apiFetch('namecards/namecardsFront')
    // console.log('불러온 데이터 : ' + res)
    return res
  } catch (error) {
    console.error('API 호출 실패:', error.message)
  }
}

const getProjectsInfo = async () => {
  try {
    const res = await apiFetch('/namecardBack.json')
    return res
  } catch (error) {
    console.error('API 호출 실패:', error.message)
  }
}

export default {
  getNamecardInfo,
  getProjectsInfo,
}
