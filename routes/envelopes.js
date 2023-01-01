const express = require('express')
const envelopeRoutes = express.Router();
const envelopeControllers = require('../controllers/envelopeControllers')

envelopeRoutes
    .get('/', envelopeControllers.getAllEnvelopes)
    .get('/:id', envelopeControllers.getEnvelope)
    .post('/', envelopeControllers.createEnvelope)
    .post('/transfer', envelopeControllers.transferAmount)
    .put('/:id', envelopeControllers.updateEnvelope)
    .delete('/:id', envelopeControllers.deleteEnvelope)


module.exports = envelopeRoutes;