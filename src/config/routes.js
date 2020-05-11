
import HomePage from '@/pages/HomePage';
import BlankLayout from '@/layouts/BlankLayout';
import Exchange from '@/pages/HomePage/components/Exchange';

const routerConfig = [
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: '/Exchange',
        component: Exchange,
      },
      {
        path: '/',
        component: HomePage,
      },
    ],
  },
];

export default routerConfig;
