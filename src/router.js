import { createRouter, createWebHistory } from 'vue-router';
import TableView from './components/TableView.vue';
import DetailsView from './components/DetailsView.vue';

const routes = [
  { path: '/', component: TableView },
  { path: '/details/:id', component: DetailsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
