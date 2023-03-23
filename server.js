const express = require('express')
const app = express()

const envelopeRoutes = require('./routes/envelopes')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.use('/api/v1/envelopes', envelopeRoutes)

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})