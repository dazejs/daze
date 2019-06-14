const { Resource } = require('@dazejs/framework');

@Resource()
class UserResource {
  resolve(data) {
    return {
      username: data.name,
      age: 18,
    };
  }
}

module.exports = UserResource;
