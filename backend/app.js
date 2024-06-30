//app.js
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const morganMiddleware = require('./middleware/logger');


const app = express()

app.use('/uploads', express.static('uploads'));

app.use(morganMiddleware);

app.use(bodyParser.json());

app.use(cors());

const AuthRouter = require('./routes/authroute')
const boardRouter =  require('./routes/boardroute')

app.use('/api', AuthRouter)
app.use('/api', boardRouter)

require('./config/db');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});