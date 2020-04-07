import ReactDOM from 'react-dom';
// 载入默认全局样式 normalize
import './global.scss';
import router from './router';
import * as global from './utils/global';

const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

global.initQkcWeb3();


ReactDOM.render(router(), ICE_CONTAINER);
