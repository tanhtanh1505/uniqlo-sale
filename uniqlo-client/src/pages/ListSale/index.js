import classNames from 'classnames/bind';
import styles from './ListSale.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '~/config';
import { toast } from 'react-toastify';
import Button from '~/components/Button/Button';
import SaleItem from './SaleItem';

const cx = classNames.bind(styles);

function ListSale() {
   const [favorite, setFavorite] = useState([]);
   useEffect(() => {
      axios
         .get(`${config.api.url}/clothes/all`)
         .then((response) => {
            setFavorite(response.data);
         })
         .catch((error) => {
            toast.error(error.response.data.message);
         });
   }, []);

   return (
      <div className={cx('wrapper')}>
         <h1 className={cx('title')}>Sales now!</h1>
         {favorite.length === 0 && (
            <div className={cx('empty')}>
               <h2 className={cx('empty_title')}>No sale now</h2>
               <p className={cx('empty_text')}>Come back later ^^</p>
               <Button primary to={config.routes.addFavorite}>
                  Go to search
               </Button>
            </div>
         )}
         <div className={cx('list_sale')}>
            {favorite && favorite.map((item, index) => <SaleItem key={index} item={item} />)}
         </div>
      </div>
   );
}

export default ListSale;
