import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '~/config';
import { toast } from 'react-toastify';
import Button from '~/components/Button/Button';
import SaleItem from '~/pages/ListSale/SaleItem';

const cx = classNames.bind(styles);

function Category({ title, person }) {
   const [listSale, setListSale] = useState([]);

   useEffect(() => {
      axios
         .get(`${config.api.url}/clothes/filter`, {
            params: {
               persons: person,
               limit: 4,
            },
         })
         .then((response) => {
            setListSale(response.data);
         })
         .catch((error) => {
            toast.error(error.response.data.message);
         });
   }, [person]);

   return (
      <div className={cx('wrapper')}>
         <h1 className={cx('title')}>{title}</h1>
         {listSale.length === 0 && (
            <div className={cx('empty')}>
               <h2 className={cx('empty_title')}>No sale now</h2>
               <p className={cx('empty_text')}>Come back later ^^</p>
               <Button primary to={config.routes.addFavorite}>
                  Go to search
               </Button>
            </div>
         )}
         <div className={cx('list_sale')}>
            {listSale && listSale.map((item, index) => <SaleItem key={index} item={item} />)}
         </div>
      </div>
   );
}

export default Category;
