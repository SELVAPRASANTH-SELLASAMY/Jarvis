const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const portfolioEmail = require('./routes/portfolio/Email');
const nomadBlog = require('./routes/nomad/Blog');
const nomadAuth = require('./routes/nomad/Auth');
const nomadProfile = require('./routes/nomad/Profile');
const App = express();
App.use(bodyparser.json({limit:'50mb'}));
const AllowedOrigins = [
    "http://localhost:3000",
    "https://prasanth.live",
    "https://nomad.prasanth.live"
];

const protectedCors = cors({
    credentials: true,
    origin: (origin,cb) => {
        if(!origin || AllowedOrigins.includes(origin)){
            cb(null,origin);
        }
        else{
            cb(new Error(`Request from origin ${origin} was blocked by CORS`));
        }
    }
});

const protectedEndpoints = [
    {mountPath: '/portfolio',APIrouter: portfolioEmail},
    {mountPath: '/nomad',APIrouter: nomadAuth},
    {mountPath: '/nomad',APIrouter: nomadProfile},
    {mountPath: '/nomad/blog',APIrouter: nomadBlog},
];

App.use(express.json());
App.use(cookieParser());

protectedEndpoints.forEach((endPoint) => {
    return App.use(endPoint.mountPath, protectedCors, endPoint.APIrouter);
});

App.use(express.static('views'));
App.use('/uploads',express.static('./uploads'));
const port = process.env.PORT;
App.listen(port,()=>{
    console.log(`API Jarvis Awaked at port ${port}...http://localhost:3001/`);
});
App.get('/',(_,res)=>{
    res.sendFile(path.join(__dirname,'/views/index.html'));
});