export default {
  /** 浏览器的最长保存时间。是一个从服务器当前时刻开始的毫秒数。 */
  maxAge: 0,

  /** 失效时间，如果设置了 maxAge，expires 将会被覆盖。 */
  expires: '',

  /** 生效的 URL 路径，默认设置在根路径上（/） */
  path: '/',

  /** 设置是否对 Cookie 进行签名 */
  signed: false,

  /** 生效的域名 */
  domain: '',

  /** 是否可以被 js 访问，默认为 true，不允许被 js 访问 */
  httpOnly: true,

  /** 设置 key 相同的键值对如何处理，如果设置为 true，则后设置的值会覆盖前面设置的，否则将会发送两个 set-cookie 响应头 */
  overwrite: false,

  /** 设置只在 HTTPS 连接上传输 */
  secure: false,
};
