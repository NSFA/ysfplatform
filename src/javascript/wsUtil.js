export function initWs(wsPort = 8003, key = '') {
  if (!WebSocket) {
    throw (new Error('WebSocket is not supportted on this browser'));
  }
//59.111.99.122
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

  //5分钟发送一条垃圾信息
  setInterval(function () {

    wsClient.send('pump...');
    console.info("pump...")

  }, 1000 * 60 * 5);

  return wsClient;
}

export default {
  initWs
};

