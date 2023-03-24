// const allEnvelopes = require('../models/Envelopes')
const budgetAPIPool = require('../config/dbConfig');

// get all envelope details
exports.getAllEnvelopes = async(req, res) => {
    try {
        const allEnvelopes = await budgetAPIPool.query('SELECT * FROM envelopes');
        res.json(allEnvelopes.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message})
    }
}

// create a new envelope
exports.createEnvelope = async (req, res) => {
    const {name, budget, description} = req.body;
    if (!name || !description || !budget) {
        return res.status(400).json({ "message": "Envelope must contain a name, description and amount"})
    }

    try {
        const newEntry = await budgetAPIPool.query(
            'INSERT INTO envelopes (name, budget, description) VALUES ($1, $2, $3) RETURNING *',
            [name, budget, description]
        );
        
        res.status(201).json({
            message: "Envelope created successfully",
            newEnvelope: newEntry.rows[0]
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message})
    }
}

// get an envelope by id
exports.getEnvelope = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const foundEnvelope = await budgetAPIPool.query(
            'SELECT * from envelopes WHERE id = $1',
            [id]
        );
        if(!foundEnvelope.rowCount) return res. status(404).json({ message: `Envelope with id ${id} not found`});
        res.json(foundEnvelope.rows[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message})
    }    
}

// update an envelope's details by id
exports.updateEnvelope = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ "message": "Envelope id must be provided"})
    }

    try {
        const foundEnvelope = await budgetAPIPool.query(
            'SELECT * from envelopes WHERE id = $1',
            [id]
        );
        if(!foundEnvelope.rowCount) return res. status(404).json({ message: `Envelope with id ${id} not found`});

        if (!req.body) {
            return res.status(400).json({ message: "Update details not found"})
        }
        
        let updatedEnvelope = {};
        const detailsToChange = Object.keys(req.body);
        detailsToChange.forEach(async (detail) => {
            const newUpdate =  await budgetAPIPool.query(
                `UPDATE envelopes SET ${detail} = $1 WHERE id = $2 RETURNING *`,
                [req.body[detail], id]            
            );
            updatedEnvelope = newUpdate.rows[0];
        })    
        

        res.status(201).json({
            "message": "Envelope updated"
        }) 

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message})
    }  
}

// delete an envelope by id
exports.deleteEnvelope = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({ "message": "Envelope id must be provided"})
    }

    try {
        const foundEnvelope = await budgetAPIPool.query(
            'SELECT * from envelopes WHERE id = $1',
            [id]
        );
        if(!foundEnvelope.rowCount) return res. status(404).json({ message: `Envelope with id ${id} not found`});

        const deletedenvelope = await budgetAPIPool.query(
            'DELETE FROM envelopes WHERE id = $1',
            [id]
        );
        res.status(204).json({
            message: `Envelope with id ${id} deleted`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message})
    } 

}

// get all transactions by an envelope
exports.getEnvelopesTransactions = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({ "message": "Envelope id must be provided"})
    }

    try {
        const foundEnvelope = await budgetAPIPool.query(
            'SELECT * from envelopes WHERE id = $1',
            [id]
        );
        if(!foundEnvelope.rowCount) return res. status(404).json({ message: `Envelope with id ${id} not found`});

        const allTransactions = await budgetAPIPool.query(
            'SELECT * FROM transactions WHERE envelopeId = $1',
            [id]
        )
        res.json(allTransactions.rows);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}


// add a transaction to envelope
exports.addEnvelopesTransaction = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({ "error": "Envelope id must be provided"})
    }
    const {name, amount} = req.body;
    if(!name || !amount) return res.status(400).json({error: "Transaction must include name and amount"});

    try {
        const foundEnvelope = await budgetAPIPool.query(
            'SELECT * from envelopes WHERE id = $1',
            [id]
        );
        if(!foundEnvelope.rowCount) return res. status(404).json({ message: `Envelope with id ${id} not found`});

        if(amount > foundEnvelope.rows[0].budget) return res.json({message: "Budget for this envelope exceeded. Transaction canceled."});

        const newTransaction = await budgetAPIPool.query(
            'INSERT INTO transactions (name, amount, date, envelopeId) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, amount, new Date(), id]
        );

        const updatedEnvelope = await budgetAPIPool.query(
            'UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *',
            [amount, id]
        );

        res.json({
            message: "Tranaction successful",
            transaction: newTransaction.rows[0],
            updatedEnvelope: updatedEnvelope.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

// transfer amount from envelopes
// exports.transferAmount = (req, res) => {
//     if (!req.query.from || !req.query.to) {
//         return res.status(400).json({ "message": "Query must include 'from' and 'to'"})
//     }

//     const fromEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.query.from))
//     const toEnvelope = allEnvelopes.find(envelope => envelope.id === Number(req.query.to))

//     if (!fromEnvelope || !toEnvelope) {
//         return res.status(400).json({ "message": `Envelope with id ${fromEnvelope ? req.query.to : req.query.from} not found`})
//     }

//     if (!req.body.transferAmount) return res.status(400).json({
//         "message": "Transfer amount must be provided"
//     })

//     if (req.body.transferAmount <= fromEnvelope.budgetBalance) {
//         fromEnvelope.amountSpent += req.body.transferAmount;
//         fromEnvelope.budgetBalance -= req.body.transferAmount;
    
//         toEnvelope.amountSpent ? toEnvelope.amountSpent -= req.body.transferAmount : toEnvelope.amountSpent;
//         toEnvelope.budgetBalance += req.body.transferAmount;    
//     } else {
//         return res.status(400).json({
//             "message": `Balance in ${fromEnvelope.name}: ${fromEnvelope.budgetBalance} is less than ${req.body.transferAmount}`
//         });
//     }

//     res.status(201).json({
//         "message": "Amount transferred",
//         "transferAmount": req.body.transferAmount,
//         "from": fromEnvelope,
//         "to": toEnvelope,
//     })




// }