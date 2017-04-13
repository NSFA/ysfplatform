export function initWs(wsPort = 8003, key = '') {
  if(!WebSocket){
    throw (new Error('WebSocket is not supportted on this browser'));
  }

  const wsClient = new WebSocket(`ws://localhost:${wsPort}/${key}`);

  wsClient.onerror = (error) => {
    console.error(error);
  };

  wsClient.onopen = (e) => {
    console.info('websocket opened: ', e);
  };

  wsClient.onclose = (e) => {
    console.info('websocket closed: ', e);
  };

  return wsClient;
}

export default {
  initWs
};

