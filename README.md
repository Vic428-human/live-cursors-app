# React + nodejs + Websocket

## 結語

> 目前該專案已於 2025/0614 完成，短時間內不會再更新。

## 前言：

> 本專案是一個即時互動應用範例，前端採用 React.js ，後端以 Node.js 搭配 WebSocket 實現。
> 使用者進入網頁後，會透過 WebSocket 與伺服器建立連線，並即時同步滑鼠座標等狀態。每當有使用者移動滑鼠或狀態變更時，伺服器會即時將最新狀態廣播給所有連線的用戶，實現多人即時互動的效果。

## 這個專案我學到什麼？

> 像是 figma 多人協作平台，我們都會看到其他人鼠標在滑動時的狀態，藉此知道有多少人跟自己協作，這個 side project 就是這些大平台應用的前身，可以看到協作方的鼠標。
> 而這個技術就仰賴前後端的 websocket 交互，也幫助自己對 websocket 有個比較完整的前後端方面配置的了解，不管是後端 server 的實作，還是前端運用套件交互時的邏輯，
> 以及避免高頻觸發運用了 lodash.throttle。

## 給未來的自己

> 如果將來想要優化組件的 UI 可以參考 https://ably.com/

## 核心代碼

關鍵核心代碼，當多人同時連結 websocket 時，A 發送新的座標時，其他所有有連線方(BCD)都會獲得這組新的座標更新，
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
