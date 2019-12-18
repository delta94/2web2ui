import { blacklist } from 'src/pages';
import App from 'src/components/layout/App';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';
export default [
  {
    path: '/blacklist',
    component: blacklist.IncidentsPage,
    layout: App,
    condition: hasAccountOptionEnabled('blacklist_monitors'),
    title: 'Blacklist Incidents',
    supportDocSearch: 'blacklist',
  },
  {
    path: '/blacklist/watchlist/create',
    component: blacklist.MonitorResourcePage,
    condition: hasAccountOptionEnabled('blacklist_monitors'),
    layout: App,
    title: 'Add to Watch List',
    supportDocSearch: 'blacklist',
  },
];
