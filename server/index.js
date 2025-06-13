const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const { v4: uuidv4 } = require('uuid');


const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!\n');
});

const wsServer = new WebSocket.Server({ server: httpServer });

// 這兩個物件是用來儲存 WebSocket 連接和用戶信息的。
const connections = {}; 
const users = {};

wsServer.on('connection', (ws, req) =>{
// ws://example.com/path? a=1 & b=2 & username=JaneDoe
// ex:  const { username } = url.parse(req.url, true).query; => username = 'JaneDoe'
  const { username, lastname } = url.parse(req.url, true).query;
  // Generate a random UUID
  const randomUuid = uuidv4();

  console.log('randomUuid', randomUuid);
  console.log(`New client connected: ${username} + ${lastname}`);
  

  connections[randomUuid] = ws;
  users[randomUuid] = { username : username };

  ws.on('close', () => {
    console.log('Client disconnected');
    delete connections[randomUuid];
  });
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});