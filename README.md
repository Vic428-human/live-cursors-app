# React + nodejs + Websocket

## 前言：

> 本專案是一個即時互動應用範例，前端採用 React.js ，後端以 Node.js 搭配 WebSocket 實現。
> 使用者進入網頁後，會透過 WebSocket 與伺服器建立連線，並即時同步滑鼠座標等狀態。每當有使用者移動滑鼠或狀態變更時，伺服器會即時將最新狀態廣播給所有連線的用戶，實現多人即時互動的效果。

說明：
關鍵核心在這，當多人同時連結 websocket 時，A 發送新的座標時，其他所有有連線方(BCD)都會獲得這組新的座標更新，
BCD 使用者在網頁觀察時候，BCD 使用者會同步接受到來自 A 更新的座標。

```

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
```

## 開始專案

### 前端啟用

```
cd client
nvm use 18
npm run dev
```

### 後端啟用

```
cd server
nvm use 18
node index.js
```

### 使用者 A 連線時

> 備註：目前專案只能在本地運行

```
ws://127.0.0.1:8000?username=ken
```

### 套件使用說明

- perfect-cursors
  > perfect-cursors 是一個用於實現平滑、自然的光標動畫效果的 JavaScript 庫，特別適合需要多人協作或實時光標共享的場景（如在線文檔、協同編輯工具、白板應用等）。它可以幫助開發者在 Web 應用中模擬其他用戶的光標移動，使光標動畫更加流暢和逼真。
