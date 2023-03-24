const express = require('express')
const envelopeRoutes = express.Router();
const envelopeControllers = require('../controllers/envelopeControllers')

envelopeRoutes
    .get('/', envelopeControllers.getAllEnvelopes)
    .get('/:id', envelopeControllers.getEnvelope)
    .post('/', envelopeControllers.createEnvelope)
    .put('/:id', envelopeControllers.updateEnvelope)
    .delete('/:id', envelopeControllers.deleteEnvelope)

    .get('/:id/transactions', envelopeControllers.getEnvelopesTransactions)
    .post('/:id/transactions', envelopeControllers.addEnvelopesTransaction)


module.exports = envelopeRoutes;