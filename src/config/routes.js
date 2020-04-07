
import HomePage from '@/pages/HomePage';
import BlankLayout from '@/layouts/BlankLayout';
import MyToken from '@/pages/HomePage/components/MyTokens';
import Exchange from '@/pages/HomePage/components/Exchange';

const routerConfig = [
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: '/MyToken',
        component: MyToken,
      },
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
