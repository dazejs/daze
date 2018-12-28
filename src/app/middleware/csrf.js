
const { Middlewares } = require('@dazejs/framework')

class CSRF extends Middlewares.VerifyCsrfToken {
  /**
   * The URIs that should be excluded from CSRF verification.
   *
   * @type {array}
   */
  get except() {
    return []
  }
}

module.exports = CSRF
