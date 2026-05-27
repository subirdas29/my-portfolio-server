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
exports.StatsServices = void 0;
const blog_model_1 = require("../blog/blog.model");
const project_model_1 = require("../project/project.model");
const message_model_1 = require("../message/message.model");

const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    let Client, Testimonial;
    try { Client = require('../client/client.model').Client; } catch(e) { Client = null; }
    try { Testimonial = require('../testimonial/testimonial.model').Testimonial; } catch(e) { Testimonial = null; }

    const [totalProjects, totalBlogs, totalMessages, totalClients, totalTestimonials] = yield Promise.all([
        project_model_1.Project.countDocuments(),
        blog_model_1.Blog.countDocuments({ status: 'published' }),
        message_model_1.Message.countDocuments(),
        Client ? Client.countDocuments() : Promise.resolve(0),
        Testimonial ? Testimonial.countDocuments() : Promise.resolve(0),
    ]);

    return {
        totalProjects,
        totalBlogs,
        totalMessages,
        totalClients,
        totalTestimonials,
    };
});

exports.StatsServices = { getStats };
