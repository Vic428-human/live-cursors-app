# React + nodejs + Websocket

## 前言：

> 本專案是一個即時互動應用範例，前端採用 React.js ，後端以 Node.js 搭配 WebSocket 實現。
> 使用者進入網頁後，會透過 WebSocket 與伺服器建立連線，並即時同步滑鼠座標等狀態。每當有使用者移動滑鼠或狀態變更時，伺服器會即時將最新狀態廣播給所有連線的用戶，實現多人即時互動的效果。

說明：
關鍵核心在這，當多人同時連結 websocket 時，其中一方發送新的座標時，其他所有有連線方，都會獲得這組新的座標更新，你能想像使用者在網頁觀察時候，會因為其中一方更新座標，而在網頁端不斷更新該座標。

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
