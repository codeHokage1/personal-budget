const express = require('express')
const transactionsRoutes = express.Router();
const transactionController = require('../controllers/transactionController')

transactionsRoutes
    .get('/', transactionController.getAllTransactions)
    .get('/:id', transactionController.getTransaction)
    .put('/:id', transactionController.updateTransaction)
    .delete('/:id', transactionController.deleteTransaction)

module.exports = transactionsRoutes;