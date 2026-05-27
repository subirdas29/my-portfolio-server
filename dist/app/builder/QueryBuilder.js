"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort(defaultSort = '-createdAt') {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || defaultSort;
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page);
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit);
        if (!limit && !page)
            return this;
        const resolvedPage = page || 1;
        const resolvedLimit = limit || 10;
        const skip = (resolvedPage - 1) * resolvedLimit;
        this.modelQuery = this.modelQuery.skip(skip).limit(resolvedLimit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    async countTotal() {
        var _a, _b, _c;
        const totalQuery = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQuery);
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || total || 10;
        const totalPage = Math.ceil(total / limit);
        return {
            total,
            page,
            limit: Number((_c = this === null || this === void 0 ? void 0 : this.query) === null || _c === void 0 ? void 0 : _c.limit) || total,
            totalPage,
        };
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map