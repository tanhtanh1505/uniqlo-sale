import classNames from 'classnames/bind';
import styles from './SaleItem.module.scss';
import { Link } from 'react-router-dom';
import Button from '~/components/Button/Button';
import config from '~/config';
const cx = classNames.bind(styles);

function SaleItem({ item }) {
   return (
      <div className={cx('wrapper')}>
         <Link to={item.url} className={cx('content')}>
            <img className={cx('img_item')} src={item.image} alt="img" />
            <div className={cx('detail')}>
               <h3>{item.title}</h3>
               <p>Code: {item.code}</p>
               <p>For {item.person}</p>
               <br />
               <p className={cx('old_price')}>{item.price} VND</p>
               <p className={cx('new_price')}>{item.salePrice} VND</p>
               <p className={cx('sale_tag')}>Sale</p>
            </div>
         </Link>
         <div className={cx('more_btn')}>
            <Button primary to={`${config.routes.addFavorite}/${item.code}`}>
               More details
            </Button>
         </div>
      </div>
   );
}

export default SaleItem;
