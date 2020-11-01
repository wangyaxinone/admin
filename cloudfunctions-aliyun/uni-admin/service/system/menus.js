const {
    Service
} = require('uni-cloud-router')

module.exports = class MenuService extends Service {
    async add(data) {
        return await this.db.collection('opendb-admin-menus').add(data);
    }
}
