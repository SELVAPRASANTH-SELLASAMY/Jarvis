const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/portfolio/Email');
const blog_routes = require('./routes/portfolio/Blog');
dotenv.config();
const App = express();
App.use(cors());
App.use(express.json());
App.use('/portfolio',routes);
App.use('/portfolio/blogs',blog_routes);
App.use(express.static('views'));
App.use('/uploads',express.static('uploads'));
const port = process.env.PORT;
App.listen(port,()=>{
    console.log(`API Jarvis Awaked at port ${port}...http://localhost:3001/`);
});
App.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/index.html'));
});