import { apiFetch } from "./interceptor.js";

const getUserInfo = async () => {
  try {
    const res = await apiFetch("/userInfo.json");
    console.log(res);
  } catch (error) {
    console.error("API 호출 실패:", error.message);
  }
};

const getNamecardInfo = async () => {
  try {
    const res = await apiFetch("/namecard.json");
    return res;
  } catch (error) {
    console.error("API 호출 실패:", error.message);
  }
};

const getProjectsInfo = async () => {
  try {
    const res = await apiFetch("/projects.json");
    return res;
  } catch (error) {
    console.error("API 호출 실패:", error.message);
  }
};

export default {
  getUserInfo, getNamecardInfo, getProjectsInfo
};
