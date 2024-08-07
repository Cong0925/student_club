import { useCookies } from '@vueuse/integrations/useCookies'
const cookie = useCookies()
import { useRouter } from "vue-router"
const router = useRouter()

// 获取token
export function getCookies(data) {
  return cookie.get(data)
}

// 设置token
export function setCookies(data1, data2) {
  // 设置 登录凭证时间
  // const expirationDays = 1;
  // const expirationDate = new Date();
  // expirationDate.setDate(expirationDate.getDate() + expirationDays);
  const expirationMinutes = 60;
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + expirationMinutes * 60 * 1000);
  return cookie.set(data1, data2, { expires: expirationDate })
}

// 清除token
export function removeCookies(data) {
  return cookie.remove(data)
}
import { ElNotification } from 'element-plus'

// 成功提示
export function toast(message, type = 'success', title = 'Success') {
  ElNotification({
    message: message,
    type: type,
    title: title,
    duration: 1000
  })
}

export function groupBy(data) {
  let newData = [];
  data.forEach(item => {
    newData[item.category_name] = [
      ...(newData[item.category_name] || []),
      ...[item]
    ];
  })
  return newData
}