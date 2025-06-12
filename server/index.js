const http = require('http');
const WebSocket = require('ws');
const url = require('url');


const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!\n');
});

const wsServer = new WebSocket.Server({ server: httpServer });


wsServer.on('connection', (ws, req) =>{
// ws://example.com/path? a=1 & b=2 & username=JaneDoe
// ex:  const { username } = url.parse(req.url, true).query; => username = 'JaneDoe'
const { username,lastname } = url.parse(req.url, true).query;

  console.log(`New client connected: ${username} + ${lastname}`);
  ws.on('message', (message) => {
    if (message.type === 'test') {
      const { param1, param2 } = message.data;
      console.log(`Received message with params: ${param1}, ${param2}`);
      // 處理 message.data 中的參數
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});