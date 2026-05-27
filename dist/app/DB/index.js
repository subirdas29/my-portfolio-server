"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const auth_model_1 = require("../modules/auth/auth.model");
const superUser = {
    email: 'subirdas1045@gmail.com',
    password: config_1.default.admin_password,
    role: 'admin',
};
const seedAdmin = async () => {
    const isAdminExist = await auth_model_1.User.findOne({ role: 'admin' });
    if (!isAdminExist) {
        await auth_model_1.User.create(superUser);
    }
};
exports.default = seedAdmin;
//# sourceMappingURL=index.js.map