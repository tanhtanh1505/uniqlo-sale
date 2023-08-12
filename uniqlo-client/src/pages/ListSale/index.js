import classNames from 'classnames/bind';
import styles from './ListSale.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '~/config';
import { toast } from 'react-toastify';
import Button from '~/components/Button/Button';
import SaleItem from './SaleItem';
import { persons } from '~/utils/types/persons';

const cx = classNames.bind(styles);

function ListSale() {
   const [listSale, setListSale] = useState([]);
   const [listSaleFilter, setListSaleFilter] = useState([]);
   const [filter, setFilter] = useState({});

   useEffect(() => {
      axios
         .get(`${config.api.url}/clothes/all`)
         .then((response) => {
            setListSale(response.data);
            setListSaleFilter(response.data);
         })
         .catch((error) => {
            toast.error(error.response.data.message);
         });
   }, []);

   useEffect(() => {
      //check if unselected all, then show all
      if (Object.keys(filter).length === 0) return setListSaleFilter(listSale);
      listSale && setListSaleFilter(listSale.filter((item) => filter[item.person]));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [filter]);

   const setFilterPerson = (person, select) => {
      // check if unselected, then remove from filter
      if (!select) {
         const newFilter = { ...filter };
         delete newFilter[person];
         return setFilter(newFilter);
      }
      // else add to filter
      setFilter({ ...filter, [person]: select });
   };

   const fullTextSearch = (value) => {
      // split value to array of words
      const words = value.split(' ');
      // remove special characters
      words.forEach((word, index) => {
         words[index] = word
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
      });
      // filter listSale by each word
      const listSaleFilter = listSale.filter((item) => {
         for (let word of words) {
            // convert to normal character
            const titleItem = item.title
               .toLowerCase()
               .normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '');
            if (!titleItem.includes(word)) return false;
         }
         return true;
      });
      setListSaleFilter(listSaleFilter);
   };

   return (
      <div className={cx('wrapper')}>
         <h1 className={cx('title')}>Sales now!</h1>
         {listSale.length === 0 && (
            <div className={cx('empty')}>
               <h2 className={cx('empty_title')}>No sale now</h2>
               <p className={cx('empty_text')}>Come back later ^^</p>
               <Button primary to={config.routes.addFavorite}>
                  Go to search
               </Button>
            </div>
         )}
         <div className={cx('filter_search_box')}>
            <div className={cx('search')}>
               <input
                  type="text"
                  placeholder="Search by name"
                  onChange={(e) => {
                     const value = e.target.value;
                     fullTextSearch(value);
                  }}
               />
            </div>
            <div className={cx('filter')}>
               {persons.map((person) => (
                  <div className={cx('filter_option')}>
                     <input
                        type="checkbox"
                        id={person}
                        name={person}
                        value={person}
                        onChange={(e) => setFilterPerson(person, e.target.checked)}
                     />
                     <label for={person}>{person}</label>
                  </div>
               ))}
            </div>
         </div>
         <div className={cx('list_sale')}>
            {listSaleFilter && listSaleFilter.map((item, index) => <SaleItem key={index} item={item} />)}
         </div>
      </div>
   );
}

export default ListSale;
