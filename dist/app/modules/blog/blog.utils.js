"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
const generateSlug = (text, { maxLength = 50 } = {}) => {
    if (!text || typeof text !== 'string')
        return Date.now().toString();
    let slug = (0, slugify_1.default)(text, {
        lower: true,
        strict: true,
        locale: 'en',
        remove: /[*+~.()'"!:@]/g
    });
    if (slug.length > maxLength) {
        slug = slug.slice(0, maxLength).replace(/-+$/, '');
    }
    return slug || Date.now().toString();
};
exports.generateSlug = generateSlug;
