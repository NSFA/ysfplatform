import {_getlatestLog} from '../javascript/getData'

const actions = {

  reloadList({commit}){
    _getlatestLog().then((res) => {
      commit('SET_WS_LIST', {
        type: "init",
        data: res.data.result
      });
    });
  },

  clearList({commit}){
    commit('SET_WS_LIST', {
      type: "clear",
    });
  },

  onWsMessage({commit,state}, event) {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'updateMultiple') {
        const res = data.content;
        if (state.recording) {
          const data = res[res.length - 1], index = _.findIndex(state.wsList, function (o) {
            return o.id === data.id;
          });
          if (index === -1) {
            commit('SET_WS_LIST', {
              type: "add",
              data: data
            })
          } else {
            commit('SET_WS_LIST', {
              type: "change",
              data: data,
              index: index
            })
          }
        }
      }
    } catch (error) {
      console.error(error);
      console.error('Failed to parse the websocket data with message: ', event.data);
    }
  },

};
export default actions;
