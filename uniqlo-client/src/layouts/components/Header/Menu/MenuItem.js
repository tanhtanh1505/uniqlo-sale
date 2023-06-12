import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MenuItem.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon, onClick }) {
   return (
      <NavLink onClick={onClick} to={to} className={(nav) => cx('wrapper', { active: nav.isActive })}>
         {icon && <div className={cx('icon')}>{icon}</div>}
         <span className={cx('content')}>{title}</span>
      </NavLink>
   );
}

MenuItem.propTypes = {
   to: PropTypes.string.isRequired,
   title: PropTypes.string.isRequired,
};

export default MenuItem;
