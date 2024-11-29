require("dotenv").config(!!process.env.CONFIG ? {path: process.env.CONFIG} : {});
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var OpenVidu = require("openvidu-node-client").OpenVidu;
var cors = require("cors");
var app = express();

const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Environment variable: PORT where the node server is listening
var SERVER_PORT = process.env.SERVER_PORT || 5000;
// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

const { router: chatRouter, chatSocketHandler } = require('./routes/chat');
const userRouter = require('./routes/user');
const newsRouter = require('./routes/newsRouter'); // 정책 뉴스 라우터
const roomRouter = require('./routes/room'); // 룸생성 라우터
app.use(express.json());

// HTTP 라우터 추가
app.use('/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/news', newsRouter); 
app.use('/api/room', roomRouter); // 정책 뉴스 라우터
///

// Enable CORS support
app.use(
  cors({
    origin: "*",
  })
);

var server = http.createServer(app);
var openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

///
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/chat/socket.io',
  transports: ['websocket'],
});

// 소켓 핸들러 추가
chatSocketHandler(io);

///////////////////////////

// MongoDB 연결
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000, // 서버 선택 타임아웃 10초
  socketTimeoutMS: 45000, // 소켓 타임아웃 45초
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

//////////////////////////////////////////

// Allow application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Allow application/json
app.use(bodyParser.json());

// Serve static resources if available
app.use(express.static(__dirname + '/public'));

// Serve application
server.listen(SERVER_PORT, () => {
  console.log("Application started on port: ", SERVER_PORT);
  console.warn('Application server connecting to OpenVidu at ' + OPENVIDU_URL);
});

app.post("/api/sessions", async (req, res) => {
  var session = await openvidu.createSession(req.body);
  res.send(session.sessionId);
});

app.post("/api/sessions/:sessionId/connections", async (req, res) => {
  var session = openvidu.activeSessions.find(
    (s) => s.sessionId === req.params.sessionId
  );
  if (!session) {
    res.status(404).send();
  } else {
    var connection = await session.createConnection(req.body);
    res.send(connection.token);
  }
});

process.on('uncaughtException', err => console.error(err));
//askbjsdabjkasdjkbasdjkbsadkjbsadbjkkbjsadkbjsadjkbasbkjdasdasdasd
as
das
d
as
d
asd
as
d
as
fas

as
fgvas
v
as
v
as
vsdff
b
df
bhrtf
h
rtd
hgt
d
df
gd
fgh
der
h
dr
g
dsg
klsd
lgld

ddddddddddddddddddd
d
d
d
d
d
d
d
d
d
d
d
d
ds
d
d
d
d
d
d
d
dfskgdkdsgkf
fd
kfdkf
k
f
kdf
kfdk
fd
kfdk
fd
kfdk
fdfd
kmdfjk
jfd
kdfk
dfk
k
df
kfdk
df
kdfsk
d
kfs
kdfs
kdfskfdk
sfdkdfsk

dkfsfddfdsfsf
dfffgfgff
f
fg
tg
fg
fgf
gf
g
fgf
gf
gf
gf
gf
gf
gf
gf
gf
gf
g
fg
fg
fg
fg
fg
fg
fg
f
gfg
fg
fg
fg
ffg
gf
fg
f
ggf
gf
g
fuugfgygyf
gfyfygfyg

yfgfy
gyf
gfy
yf
fyyfgfgyfgyfgygyfygffgyyfgfyfyy
gf
fg
dgf
g
fg
d
b
df
b
dfn
fg
b
dfg
dfs
g
dfg
dr
g
d
gd
rg
dr
gdr
g
rd
g
jh
df
h
dfg
df
g
dsf
g
rsg
d
gh
df
g
dfh
d
fh
df
hdf
gh
dh
dr
g
sdrh
dr
hg
df
gdf
gh
d
ghdr
h
dsrgh
dfsg
df
gjk
sdjkg
jkdfj
j
dfj
dfj
dgjgdjdgjjgj
sgjfj
jfgjgfj
gddjfgjjgsjdfgjdfgjdj
gj
d
gdf
gdf
gjd
fjj
gsdf
jgf
jfd
jsg
jgfj
g
jgf
jgg
djgdj
gsdj
gsj
srgd
jrgsd
jgrs
jgrdg