const { Resource } = require('@dazejs/framework')

class Order extends Resource.Transformer {
  /**
   * Transform the resource.
   * @param {object|array} data
   * @returns {object}
   */
  toJSON(data) {
    return {
      ...data,
    }
  }
}

module.exports = Order
