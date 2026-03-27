import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort(defaultSort: string = '-createdAt') {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || defaultSort;
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page);
    const limit = Number(this?.query?.limit);

    // Only paginate if at least one param is explicitly provided
    if (!limit && !page) return this;

    const resolvedPage = page || 1;
    const resolvedLimit = limit || 10;
    const skip = (resolvedPage - 1) * resolvedLimit;

    this.modelQuery = this.modelQuery.skip(skip).limit(resolvedLimit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQuery = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQuery);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || total || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      total,
      page,
      limit: Number(this?.query?.limit) || total,
      totalPage,
    };
  }
}

export default QueryBuilder;
