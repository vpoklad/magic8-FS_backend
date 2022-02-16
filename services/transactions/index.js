import months from '../../lib/months';
import UsersRepository from '../../repository/user';
import mongoose from 'mongoose';
const { Types } = mongoose;

class TransactionsService {
  constructor(id, queryParams, TransactionsObj, typeOfTransaction) {
    this.id = id;
    this.queryParams = queryParams;
    this.TransactionsObj = TransactionsObj;
    this.typeOfTransaction = typeOfTransaction;
  }

  getMinMonth(dateUserCreated) {
    const { year, month } = this.queryParams;
    const yearReg = Number(dateUserCreated.getFullYear());
    const monthReg = Number(dateUserCreated.getMonth()) - 1;
    const minM = yearReg === year ? monthReg : 0;
    const minMonth = Math.max(minM, month - 5);
    return minMonth;
  }

  async statisticSummery() {
    const { year, month } = this.queryParams;
    const typeOfTransaction = this.typeOfTransaction;
    const owner = Types.ObjectId(this.id);
    const user = await UsersRepository.findById(owner);
    const dateUserCreated = user.createdAt;
    const minMonth = this.getMinMonth(dateUserCreated);
    const total = this.typeOfTransaction ? 'totalIncome' : 'totalExpense';
    const pipeline = [
      {
        $match: {
          $and: [
            { owner },
            { typeOfTransaction },
            { year },
            { month: { $gte: minMonth, $lte: month } },
          ],
        },
      },
      { $group: { _id: '$month', [`${total}`]: { $sum: '$sum' } } },
      {
        $project: {
          month: { $arrayElemAt: [months, '$_id'] },
          [`${total}`]: { $round: [`$${total}`, 2] },
        },
      },
      { $sort: { _id: -1 } },
    ];
    return this.TransactionsObj.aggregate(pipeline);
  }

  totalExpInc() {
    const { year, month } = this.queryParams;
    console.log(this.typeOfTransaction);
    const result = this.TransactionsObj.aggregate([
      {
        $match: {
          $and: [{ owner: Types.ObjectId(this.id) }, { year }, { month }],
        },
      },
      {
        $group: {
          _id: '$typeOfTransaction',
          total: { $sum: '$sum' },
        },
      },
      { $project: { total: { $round: ['$total', 2] } } },
      { $sort: { _id: 1 } },
    ]);
    return result;
  }

  detailedCategoryStatistic() {
    const { year, month } = this.queryParams;
    const result = this.TransactionsObj.aggregate([
      {
        $match: {
          $and: [{ owner: Types.ObjectId(this.id) }, { year }, { month }],
        },
      },
      {
        $group: {
          _id: {
            typeOfTransaction: '$typeOfTransaction',
            category: '$category',
            categoryLabel: '$categoryLabel',
          },
          total: { $sum: '$sum' },
        },
      },
      { $project: { total: { $round: ['$total', 2] } } },
    ]);
    return result;
  }

  detailedDescriptionStatistic() {
    const { year, month } = this.queryParams;
    const result = this.TransactionsObj.aggregate([
      {
        $match: {
          $and: [{ owner: Types.ObjectId(this.id) }, { year }, { month }],
        },
      },
      {
        $group: {
          _id: {
            typeOfTransaction: '$typeOfTransaction',
            description: '$description',
            category: '$category',
          },
          total: { $sum: '$sum' },
        },
      },
      { $project: { total: { $round: ['$total', 0] } } },
      { $sort: { total: -1 } },
    ]);
    return result;
  }
}

export default TransactionsService;

