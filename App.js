const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyparser = require('body-parser');
const routes = require('./routes/portfolio/Email');
const nomadBlog = require('./routes/nomad/Blog');
dotenv.config();
const App = express();
App.use(bodyparser.json({limit:'50mb'}));
App.use(cors());
App.use(express.json());
App.use('/portfolio',routes);
App.use('/nomad/blog',nomadBlog);
App.use(express.static('views'));
const port = process.env.PORT;
App.listen(port,()=>{
    console.log(`API Jarvis Awaked at port ${port}...http://localhost:3001/`);
});
App.get("/",(_,res)=>{
    res.sendFile(path.join(__dirname,'/views/index.html'));
});