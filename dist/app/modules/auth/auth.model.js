"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, immutable: true, trim: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, default: 'admin' },
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    this.password = await bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
    next();
});
userSchema.post('save', async function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isUserExist = async function (email) {
    return await exports.User.findOne({ email }).select('+password');
};
userSchema.statics.isThePasswordMatched = async function (plainTextPassword, hashPassword) {
    return await bcrypt_1.default.compare(plainTextPassword, hashPassword);
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=auth.model.js.map