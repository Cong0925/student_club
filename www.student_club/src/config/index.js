// 开发环境下配置
const DEV_CONFIG = {
  //标题
  APP_NAME: "大学社团管理系统",
  APP_NAME_LOGISTICS: "大学社团管理系统",
  //版本号
  APP_VER: "1.0.0",

  //接口测试地址
  // API_URL: "http://api.student-club.quwancode.com/api_1_0",

  //接口生产上地址
  API_URL: "http://api.student-club.quwancode.com/api_1_0",

  //请求超时
  TIMEOUT: 10000,
  //TokenName
  TOKEN_NAME: "Token",
  //Token前缀，注意最后有个空格，如不需要需设置空字符串
  TOKEN_PREFIX: "Bearer ",
  //追加其他头
  HEADERS: {},
  //请求是否开启缓存
  REQUEST_CACHE: false,
  //布局 默认：default | 通栏：header | 经典：menu | 功能坞：dock
  //dock将关闭标签和面包屑栏
  LAYOUT: 'menu',
  //菜单是否折叠
  MENU_IS_COLLAPSE: false,
  //是否开启多标签
  LAYOUT_TAGS: true,
  //主题颜色
  COLOR: '',
  // 图片前缀
  BASEURL_PIC: 'http://images.quwancode.com',
  // 默认图片
  BASE_PIC: 'http://images.quwancode.com/upload/images/error_image.jpg'
}

// 生产环境下额外的配置，覆盖开发环境的配置
const PRO_CONFIG = {
  API_URL: "https://api.club.ncepu.edu.cn"
}

let APP_CONFIG = DEV_CONFIG
//判断是否在生产环境汇总运行
if (
  import.meta.env.PROD) {
  APP_CONFIG = {
    ...APP_CONFIG,
    ...PRO_CONFIG
  }
}

export default APP_CONFIG