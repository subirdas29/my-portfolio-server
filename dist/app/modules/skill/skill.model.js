"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const mongoose_1 = require("mongoose");
const ai_service_1 = require("../ai/ai.service");
const SkillSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    logo: { type: [String], required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });
// Auto-sync with Pinecone on save, update, delete
SkillSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = this;
                yield ai_service_1.AIServices.upsertSkillToAI({
                    _id: doc._id,
                    title: doc.title,
                    logo: doc.logo,
                    order: doc.order,
                });
            }
            catch (error) {
                console.error('Error syncing skill to Pinecone:', error);
            }
        }
    });
});
SkillSchema.post('findOneAndUpdate', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = yield this.model.findOne(this.getQuery());
                if (doc) {
                    const d = doc;
                    yield ai_service_1.AIServices.upsertSkillToAI({
                        _id: d._id,
                        title: d.title,
                        logo: d.logo,
                        order: d.order,
                    });
                }
            }
            catch (error) {
                console.error('Error updating skill in Pinecone:', error);
            }
        }
    });
});
SkillSchema.post('findOneAndDelete', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = (yield this.model.findOne(this.getQuery()).lean());
                if (doc && doc._id) {
                    yield ai_service_1.AIServices.deleteFromAI(`skill_${doc._id.toString()}`);
                }
            }
            catch (error) {
                console.error('Error deleting skill from Pinecone:', error);
            }
        }
    });
});
exports.Skill = (0, mongoose_1.model)('Skill', SkillSchema);
