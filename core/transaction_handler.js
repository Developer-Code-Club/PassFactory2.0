const Transaction = require('./transaction')
const DataLoader = require('./data_loader')

class  TransactionHandler {
    constructor() {
        this.theTransactions = new Map();
    }

    async initialize() {
        this.theTransactions = await DataLoader.getTransactionData();
    }
}