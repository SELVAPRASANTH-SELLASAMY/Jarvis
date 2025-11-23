const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/portfolio/Email');
const nomadBlog = require('./routes/nomad/Blog');
const nomadAuth = require('./routes/nomad/Auth');
const nomadProfile = require('./routes/nomad/Profile');
dotenv.config();
const App = express();
App.use(bodyparser.json({limit:'50mb'}));
const AllowedOrigins = [
    "http://localhost:3000",
    "https://prasanth.live"
];
App.use(
    cors({
        credentials: true,
        origin: (origin,cb) => {
            if(!origin || AllowedOrigins.includes(origin)){
                cb(null,origin);
            }
            else{
                cb(new Error(`Request from origin ${origin} was blocked by CORS`));
            }
        }
    })
);
App.use(express.json());
App.use(cookieParser());
App.use('/portfolio',routes);
App.use('/nomad',nomadAuth);
App.use('/nomad',nomadProfile);
App.use('/nomad/blog',nomadBlog);
App.use(express.static('views'));
App.use('/uploads',express.static('./uploads'));
const port = process.env.PORT;
App.listen(port,()=>{
    console.log(`API Jarvis Awaked at port ${port}...http://localhost:3001/`);
});
App.get('/',(_,res)=>{
    res.sendFile(path.join(__dirname,'/views/index.html'));
});