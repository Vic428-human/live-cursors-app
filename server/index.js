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


function broadcastUserStateUpdate(connections, randomUuid, user) {
  Object.keys(connections).forEach((uuid) => {
    const ws = connections[uuid];
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'userStateUpdateToEveryone',
        user: {
          uuid: randomUuid,
          username: user.username,
          state: user.state
        }
      }));
    }
  });
}

handleMessage = (bytes, randomUuid) => {

  if (!users[randomUuid]) {
    console.error(`User not found: ${randomUuid}`);
    return;
  }
  // 預設 message = { x: 0, y: 0 }
  const message = JSON.parse(bytes.toString());
  // 更新用戶狀態
  const user = users[randomUuid]; 
  user.state = message; 
  console.log(`使用者 ${user.username} 更新座標狀態：`, user.state);

  // 將更新後的用戶狀態發送給所有連接的客戶端
  broadcastUserStateUpdate(connections, randomUuid, user);


}
handleClose = (bytes, randomUuid) => {
   const message = JSON.parse(bytes.toString());
  const user = users[randomUuid]; 
  user.state = message;
  console.log(`使用者: ${user.username}  ${randomUuid} 已斷線`);
  // 將更新後的用戶狀態發送給所有連接的客戶端
  broadcastUserStateUpdate(connections, randomUuid, users);
  // 關閉連線時，從 connections 和 users 中移除該用戶
  delete connections[randomUuid];
  delete users[randomUuid];

}

wsServer.on('connection', (ws, req) =>{
// ws://example.com/path? a=1 & b=2 & username=JaneDoe
// ex:  const { username } = url.parse(req.url, true).query; => username = 'JaneDoe'
  const { username } = url.parse(req.url, true).query;
  // Generate a random UUID
  const randomUuid = uuidv4();
  
  // 存儲當前連線的uuid用戶端識別
  connections[randomUuid] = ws;
  users[randomUuid] = { 
     username,
     state : {}
  };

  // WebSocket 伺服器收到使用者（client）發來的訊息」時要執行的動作。
  ws.on('message', (message) => {
    handleMessage(message, randomUuid);
  });

  // 當 WebSocket 連線關閉時觸發。
  ws.on('close', (message) => {
    handleClose(message, randomUuid);
  });
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});