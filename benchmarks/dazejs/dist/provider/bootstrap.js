"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@dazejs/framework");
class default_1 extends framework_1.Provider {
    launch() {
        for (let index1 = 1; index1 <= 10; index1++) {
            for (let index2 = 1; index2 <= 10; index2++) {
                for (let index3 = 1; index3 <= 10; index3++) {
                    const url = `/pathto${index1}/pathto${index2}/pathto${index3}`;
                    this.app.get('router').register(url, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
                }
            }
        }
    }
}
exports.default = default_1;
