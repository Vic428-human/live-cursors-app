import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Cursor } from './src/components/Cursor';


const renderCursors = (users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];
    if (!user || !user.state) return null; // 防呆
    return (
      <React.Fragment key={uuid}>
        <Cursor point={[user.state.x, user.state.y]} />
        <div
          key={uuid}
          onClick={() => {
            console.log(`點擊到使用者：${user.username} (${user.state.x}, ${user.state.y})`);
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,255,0,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
          }}
          style={{
            position: 'fixed',
            left: user.state.x + 10,
            top: user.state.y + 10,
            background: 'rgba(255,255,255,0.8)',
            color: '#333',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          使用者：{user.username} 座標：({user.state.x}, {user.state.y})
        </div>
      </React.Fragment>
    );
  }
  );
}
export const Home = ({username}) => {
  const [socketUrl] = useState('ws://127.0.0.1:8000');
  
  // 用 ref 儲存最新座標與 animation frame 狀態
  const { 
    sendJsonMessage,
    // 在接收到第一條消息之前為null。如果message.data無法解析為JSON，則這將是一個靜態的空對象。
    // lastJsonMessage 儲存了WebSocket連線上接收到的最後一封JSON格式的訊息。你可以直接存取這個變數來取得最新的數據，而不需要手動解析訊息
    lastJsonMessage, 
    // https://www.npmjs.com/package/react-use-websocket
  } = useWebSocket(socketUrl,{ share: true, queryParams: {   //<url>?username='Eric'
    username
  }});

  //  限制 sendJsonMessage，僅當 sendJsonMessage 發生變化時重新創建
  const throttledSend = useRef();
    useEffect(() => {
      throttledSend.current = throttle(sendJsonMessage, 3000);
    }, [sendJsonMessage]);

    useEffect(() => {
      sendJsonMessage({ x: 0, y: 0 });
      const handleMouseMove = (e) => {
        throttledSend.current({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [sendJsonMessage]);
  
  // 從別的畫面會看到橘色鼠標，你可以看到其他人的鼠標移動，黑色是自己
  if(lastJsonMessage) {
    return <>
      <h2>
      當前使用者：<span style={{ color: 'blue' }}>{username}</span> 
      </h2>
      {/* lastJsonMessage 把裡面的username 跟 座標顯示出來 */}
      <div>
      <span style={{ color: 'orange' }}>其他使用者：</span>
      {Object.keys(lastJsonMessage).map((uuid) => {
        const user = lastJsonMessage[uuid];
        if (!user || !user.state) return null;
        return (
        <span
          key={uuid}
          style={{ marginLeft: '10px', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => {
            console.log(`點擊到使用者：${user.username} (${user.state.x}, ${user.state.y})`);
          }}
        >
          {user.username} ({user.state.x}, {user.state.y})
        </span>
        );
      })} 
      </div>
      {renderCursors(lastJsonMessage)}
    </>;
  }
  
  return (
    <div>
      <h2>
        歡迎 <span style={{ color: 'blue' }}>{username}</span> 進入鼠標追逐遊戲！
      </h2>
    </div>
  );
}
       
  // sendJsonMessage => 消息將首先通過 JSON.stringify 處理。

  // share: true 如果 WebSocket 是共享的，調用此函數將懶加載一個包裝底層 WebSocket 的 Proxy 實例。您可以在返回值上獲取和設置屬性，
  // 這將直接與 WebSocket 互動，然而某些屬性/方法是受保護的（無法調用 close 或 send，並且無法重新定義任何事件處理程序，