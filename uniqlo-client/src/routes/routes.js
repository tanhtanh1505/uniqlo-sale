import config from '~/config';

// Layouts
import { ContentOnly } from '~/layouts';

// Pages
import Login from '~/pages/Login';
import Home from '~/pages/Home';
import AddFavorite from '~/pages/AddFavorite';
import ListSale from '~/pages/ListSale';
import Favorite from '~/pages/Favorite';

// Public routes
const publicRoutes = [
   { path: config.routes.login, component: Login, layout: ContentOnly },
   { path: config.routes.home, component: Home },
   { path: config.routes.favorites, component: Favorite },
   { path: config.routes.listSale, component: ListSale },
   { path: config.routes.addFavorite, component: AddFavorite },
   { path: `${config.routes.addFavorite}/:code`, component: AddFavorite },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
