import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ContentOnly.module.scss';

const cx = classNames.bind(styles);

function ContentOnly({ children }) {
   return <div className={cx('wrapper')}>{children}</div>;
}

ContentOnly.propTypes = {
   children: PropTypes.node.isRequired,
};

export default ContentOnly;
