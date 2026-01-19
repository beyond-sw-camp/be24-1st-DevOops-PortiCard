import { apiFetch } from "./axiosinterceptor.js";

const getCommunityInfo = async () => {
  try {
    const res = await apiFetch("/community.json");
    return res;
  } catch (error) {
    console.error("API 호출 실패:", error.message);
  }
};

export default {
  getCommunityInfo
};
