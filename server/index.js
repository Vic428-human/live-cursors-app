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

handleMessage = (bytes, randomUuid) => {
  // 預設 message = { x: 0, y: 0 }
  const message = JSON.parse(bytes.toString());
  console.log(message, randomUuid);
}
handleClose = (randomUuid) => {
  console.log(`Client disconnected: ${randomUuid}`);
  
}

wsServer.on('connection', (ws, req) =>{
// ws://example.com/path? a=1 & b=2 & username=JaneDoe
// ex:  const { username } = url.parse(req.url, true).query; => username = 'JaneDoe'
  const { username, lastname } = url.parse(req.url, true).query;
  // Generate a random UUID
  const randomUuid = uuidv4();

  console.log('randomUuid', randomUuid);
  console.log(`New client connected: ${username} + ${lastname}`);
  
  // 存儲當前連線的uuid用戶端識別
  connections[randomUuid] = ws;
  users[randomUuid] = { 
     username ,
    // 跟 x 和 y 有關的狀態 
     state :{ }
  };

  // 當 WebSocket 接收到消息時觸發。（例如：用戶 uuid 端發送的訊息）
  ws.on('message', (message) => {
    handleMessage(message, randomUuid);
  });

  // 當 WebSocket 連線關閉時觸發。
  ws.on('close', () => {
    handleClose(randomUuid);
  });
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});