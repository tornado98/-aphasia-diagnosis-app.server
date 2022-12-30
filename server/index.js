require('dotenv').config();
const express = require('express');
const app = express()
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const PORT = process.env.PORT || 3500
console.log(process.env.NODE_ENV)


app.use(logger)

app.use(cors(corsOptions))


app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'));
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepted('json')) {
        res.json({ message: '404 NOT FOUND' })
    } else {
        res.type('txt').send('404 NOT FOUND')
    }
})

app.use(errorHandler);


app.listen(PORT, () => console.log(`Ssrver runing on port ${PORT}`));