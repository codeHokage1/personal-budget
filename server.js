const express = require('express');
const app = express();

require('dotenv').config();

const envelopeRoutes = require('./routes/envelopes');
const transactionsRoutes = require('./routes/transactionsRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!')
});

app.use('/api/v1/envelopes', envelopeRoutes);
app.use('/api/v1/transactions', transactionsRoutes);


const PORT =  process.env.PORT || 5008;
app.listen(PORT, () => {
    console.log('Server listening on port ', PORT)
});