"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@dazejs/framework");
const controller_1 = __importDefault(require("../app/controller"));
class default_1 extends framework_1.Provider {
    launch() {
        for (let index1 = 1; index1 <= 10; index1++) {
            for (let index2 = 1; index2 <= 10; index2++) {
                for (let index3 = 1; index3 <= 10; index3++) {
                    const url = `/pathto${index1}/pathto${index2}/pathto${index3}`;
                    this.app.get('router').register(url, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], controller_1.default, 'hello', []);
                }
            }
        }
    }
}
exports.default = default_1;
