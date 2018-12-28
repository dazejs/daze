module.exports = {

  /** session 存储的 key */
  key: 'daze:sess',

  /** 强制在每个响应上设置会话标识符cookie。过期值重置为原始maxAge，重新设置过期倒计时 */
  rolling: false,

  /** 当会话快过期时更新会话，这样我们可以始终保持用户登录 */
  renew: false,

  /** session 存储类型： 可选 redis */
  type: '',
  /** type 为 'redis' 时，并且存在多个 redis 配置时使用，用于配置使用哪个redis配置 */
  database: '',

  /** type 为空或者 'cookie' 时使用如下 cookie 配置 */
  /** 过期时间（毫秒） */
  maxAge: 8640000,
  /** 是否覆盖前面设置的同名cookie */
  overwrite: true,
  /** 是否可以被 js 访问，默认为 true，不允许被 js 访问 */
  httpOnly: true,
  /** 设置是否对 Cookie 进行签名 */
  signed: true,
}
