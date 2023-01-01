const allEnvelopes = require('../models/Envelopes')

// get all envelope details
exports.getAllEnvelopes = (req, res) => {
    res.json({allEnvelopes})
}

// create a new envelope
exports.createEnvelope = (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.budget) {
        return res.status(400).json({ "message": "Envelope must contain a name, description and amount"})
    }

    const newEntry = {
        id: allEnvelopes.length ? allEnvelopes[allEnvelopes.length - 1].id + 1 : 1,
        ...req.body,
        amountSpent: 0,
        budgetBalance: req.body.budget
    }
    allEnvelopes.push(newEntry);
    res.status(201).json({
        "message": "Envelope created",
        "envelope": newEntry
    })
}

// get an envelope by id
exports.getEnvelope = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ "message": "Envelope id must be provided"})
    }

    const foundEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.params.id));
    if (!foundEnvelope) return res.status(404).json(
        { "message": `Envelope with id ${req.params.id} not found` }
    )
    
    res.json({
        "message": "Envelope found",
        "envelope": foundEnvelope
    })
}

// update an envelope's details by id
exports.updateEnvelope = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ "message": "Envelope id must be provided"})
    }

    const foundEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.params.id));
    if (!foundEnvelope) return res.status(404).json(
        { "message": `Envelope with id ${req.params.id} not found` }
    )

    if (!req.body) {
        return res.status(400).json({ "message": "Update details not found"})
    }

    const detailsToChange = Object.keys(req.body);
    detailsToChange.forEach(detail => {
        if (detail !== "amountSpent") {
            foundEnvelope[detail] = req.body[detail];
        }
    })

    if (req.body.amountSpent) {
        foundEnvelope.amountSpent += req.body.amountSpent;
        foundEnvelope.budgetBalance -= req.body.amountSpent;
    }

    res.status(201).json({
        "message": "Envelope updated",
        "envelope": foundEnvelope
    }) 
}

// delete an envelope by id
exports.deleteEnvelope = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ "message": "Envelope id must be provided"})
    }

    const foundEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.params.id));
    if (!foundEnvelope) return res.status(404).json(
        { "message": `Envelope with id ${req.params.id} not found` }
    )

    allEnvelopes.splice(allEnvelopes.indexOf(foundEnvelope), 1);
    res.status(201).json({
        "message": "Envelope deleted"
    })
}

// transfer amount from envelopes
exports.transferAmount = (req, res) => {
    if (!req.query.from || !req.query.to) {
        return res.status(400).json({ "message": "Query must include 'from' and 'to'"})
    }

    const fromEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.query.from))
    const toEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.query.to))

    if (!fromEnvelope || !toEnvelope) {
        return res.status(400).json({ "message": `Envelope with id ${fromEnvelope ? req.query.to : req.query.from} not found`})
    }

    if (!req.body.transferAmount) return res.status(400).json({
        "message": "Transfer amount must be provided"
    })

    if (req.body.transferAmount <= fromEnvelope.budgetBalance) {
        fromEnvelope.amountSpent += req.body.transferAmount;
        fromEnvelope.budgetBalance -= req.body.transferAmount;
    
        toEnvelope.amountSpent ? toEnvelope.amountSpent -= req.body.transferAmount : toEnvelope.amountSpent;
        toEnvelope.budgetBalance += req.body.transferAmount;    
    } else {
        return res.status(400).json({
            "message": `Balance in ${fromEnvelope.name}: ${fromEnvelope.budgetBalance} is less than ${req.body.transferAmount}`
        });
    }

    res.status(201).json({
        "message": "Amount transferred",
        "transferAmount": req.body.transferAmount,
        "from": fromEnvelope,
        "to": toEnvelope,
    })




}