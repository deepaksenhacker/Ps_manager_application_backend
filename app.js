const express =require('express');
const morgan = require('morgan');
const bodyparser =require('body-parser')
const app = express();
const cors = require('cors')
const dbconn = require('./config/databaseConnection.js');
const router = require('./routes/users.js');
const passwords = require('./routes/passwords.js')
const ps = require('./routes/psbackend.js');
require('dotenv').config()

dbconn.dbconn();    
app.use(express.json());
app.use(express.urlencoded({extended :false}))
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(cors());
app.use('/api/users',router);
app.use('/psbackend',ps);

app.use('/passwords',passwords)

app.get('/',(req,res)=>{
    res.send('Hello')
})

app.listen(process.env.PORT || 3000,()=>{
    console.log(`localhost:${process.env.PORT}/`);
})
