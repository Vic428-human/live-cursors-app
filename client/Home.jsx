import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

  
export const Home = ({username}) => {
  const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:8000');


  const { 
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  } = useWebSocket(socketUrl,{ share: true, queryParams: {   //<url>?username='Eric'
    username
  }});
  return (
    <div>
      <h2>
        Welcome <span style={{ color: 'blue' }}>{username}</span> to the Home Page
      </h2>
    </div>
  );
}
       
  // sendJsonMessage => 消息將首先通過 JSON.stringify 處理。

  // share: true 如果 WebSocket 是共享的，調用此函數將懶加載一個包裝底層 WebSocket 的 Proxy 實例。您可以在返回值上獲取和設置屬性，
  // 這將直接與 WebSocket 互動，然而某些屬性/方法是受保護的（無法調用 close 或 send，並且無法重新定義任何事件處理程序，
  // 如 onmessage、onclose、onopen 和 onerror）。以下是使用此功能的示例