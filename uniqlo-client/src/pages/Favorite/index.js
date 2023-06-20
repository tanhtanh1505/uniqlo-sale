import classNames from 'classnames/bind';
import styles from './Favorite.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '~/config';
import { toast } from 'react-toastify';
import FavoriteItem from './FavoriteItem';
import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

function Favorite() {
   const [favorite, setFavorite] = useState([]);
   useEffect(() => {
      if (!localStorage.getItem('token')) {
         toast.error('Please login to use this feature');
         return;
      }

      axios
         .get(`${config.api.url}/favorites/all`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         .then((response) => {
            setFavorite(response.data);
         })
         .catch((error) => {
            toast.error(error.response.data.message);
         });
   }, []);

   const handleDelete = (item) => {
      const { color, size, code } = item;
      axios
         .delete(`${config.api.url}/favorites/delete?color=${color}&size=${size}&code=${code}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
            },
         })
         .then((res) => {
            toast.success('Delete favorite success');
            setFavorite(favorite.filter((item) => !(item.code === code && item.color === color && item.size === size)));
         })
         .catch((err) => {
            toast.error('Delete favorite failed');
         });
   };

   return (
      <div className={cx('wrapper')}>
         <h1 className={cx('title')}>Favorite</h1>
         {favorite.length === 0 && (
            <div className={cx('empty')}>
               <h2 className={cx('empty_title')}>No favorite</h2>
               <p className={cx('empty_text')}>You have no favorite items</p>
               <Button primary to={config.routes.addFavorite}>
                  Go to search
               </Button>
            </div>
         )}
         <div className={cx('list_sale')}>
            {favorite &&
               favorite.map((item, index) => <FavoriteItem key={index} item={item} handleDeleteItem={handleDelete} />)}
         </div>
      </div>
   );
}

export default Favorite;
