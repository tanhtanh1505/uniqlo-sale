import classNames from 'classnames/bind';
import styles from './FavoriteItem.module.scss';
import { Link } from 'react-router-dom';
import Button from '~/components/Button/Button';
import config from '~/config';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function FavoriteItem({ item, handleDeleteItem }) {
   const navigate = useNavigate();

   return (
      <div className={cx('wrapper')}>
         <div className={cx('body')}>
            <Link to={item.url} className={cx('content')}>
               <img className={cx('img_item')} src={item.image} alt="img" />
               <div className={cx('detail')}>
                  <h3>{item.title}</h3>
                  <p>Code: {item.code}</p>
                  <p className={cx('color_size')}>Color: {item.color}</p>
                  <p className={cx('color_size')}>Size: {item.size}</p>

                  {item.sale ? (
                     <>
                        <p className={cx('old_price')}>{item.curPrice} VND</p>
                        <p className={cx('new_price')}>{item.curSalePrice} VND</p>
                        <p className={cx('sale_tag')}>Sale</p>
                     </>
                  ) : (
                     <p className={cx('normal_price')}>{item.curPrice} VND</p>
                  )}
                  <p className={cx('expected_price')}>Expected price: {item.price} VND</p>
               </div>
            </Link>
            <div className={cx('delete_btn')}>
               <Button outline onClick={() => handleDeleteItem(item)}>
                  Delete
               </Button>
               <Button
                  primary
                  onClick={() => {
                     navigate(`${config.routes.addFavorite}/${item.code}`);
                  }}
               >
                  Change
               </Button>
            </div>
         </div>
         <div className={cx('line')}></div>
      </div>
   );
}

export default FavoriteItem;
