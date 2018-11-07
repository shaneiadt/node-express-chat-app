const express = require('express');

const app = express();

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.send('Hello from server...');
});

server = app.listen(3000);