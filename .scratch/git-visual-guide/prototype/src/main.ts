import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
// Disposable comparison on the existing prototype route; original study stays intact.
if (new URLSearchParams(location.search).get('study') === 'remote') {
  import('./RemotePrototype.vue').then(({default: RemotePrototype}) => createApp(RemotePrototype).mount('#app'));
} else if (new URLSearchParams(location.search).get('study') === 'history') {
  import('./HistoryPrototype.vue').then(({default: HistoryPrototype}) => createApp(HistoryPrototype).mount('#app'));
} else {
  createApp(App).mount('#app');
}
