import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Menu, { MenuItem } from './Menu';
import config from '~/config';
import { useState, useEffect } from 'react';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Header() {
   const [user, setUser] = useState({});

   useEffect(() => {
      const theUser = localStorage.getItem('user');
      if (theUser && !theUser.includes('undefined')) {
         setUser(JSON.parse(theUser));
      }
   }, []);

   const logout = () => {
      localStorage.removeItem('user');
   };

   return (
      <header className={cx('wrapper')}>
         <div className={cx('logo')}>
            <img src={images.logo} alt="logo" />
         </div>
         <Menu>
            <MenuItem title="Home" to={config.routes.home} />
            <MenuItem title="Sales" to={config.routes.listSale} />
            <MenuItem title="Favorites" to={config.routes.favorites} />
            <MenuItem title="Search" to={config.routes.addFavorite} />
            <MenuItem title={user?.email ? 'Logout' : 'Login'} onClick={logout} to={config.routes.login} />
         </Menu>
      </header>
   );
}

export default Header;
