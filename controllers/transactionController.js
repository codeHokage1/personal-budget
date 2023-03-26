const budgetAPIPool = require('../config/dbConfig');

exports.getAllTransactions = async (req, res) => {
    try {
        const allTransactions = await budgetAPIPool.query(
            'SELECT * FROM transactions'
        );
        res.json(allTransactions.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const {id} = (req.params);
        
        const foundTransaction = await budgetAPIPool.query(
            'SELECT * FROM transactions WHERE id = $1',
            [Number(id)]
        );
        if(!foundTransaction.rowCount) return res.status(404).json({message: `Transaction with id ${id} not found`});

        res.json(foundTransaction.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}


exports.updateTransaction = async (req, res) => {
    try {
        const {id = parseInt(id)} = (req.params);
        
        const foundTransaction = await budgetAPIPool.query(
            'SELECT * FROM transactions WHERE id = $1',
            [id]
        );
        if(!foundTransaction.rowCount) return res.status(404).json({message: `Transaction with id ${id} not found`});

        let updatedTransaction = {};
        const detailsToChange = Object.keys(req.body);
        detailsToChange.forEach(async (detail) => {
            const newUpdate =  await budgetAPIPool.query(
                `UPDATE transactions SET ${detail} = $1 WHERE id = $2 RETURNING *`,
                [req.body[detail], id]            
            );
            updatedTransaction = newUpdate.rows[0];
        })    
        

        res.status(201).json({
            "message": "Transaction updated"
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const {id = parseInt(id)} = (req.params);
        
        const foundTransaction = await budgetAPIPool.query(
            'SELECT * FROM transactions WHERE id = $1',
            [id]
        );
        if(!foundTransaction.rowCount) return res.status(404).json({message: `Transaction with id ${id} not found`});

        const deletedTransaction = await budgetAPIPool.query(
            'DELETE FROM transactions WHERE id = $1',
            [id]
        );

        res.status(201).json({
            "message": "Transaction deleted"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}