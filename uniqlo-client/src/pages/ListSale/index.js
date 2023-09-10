import classNames from 'classnames/bind';
import styles from './ListSale.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '~/config';
import { toast } from 'react-toastify';
import Button from '~/components/Button/Button';
import SaleItem from './SaleItem';
import { persons as listTypePerson } from '~/utils/types/persons';

const cx = classNames.bind(styles);

function ListSale() {
   const [listSale, setListSale] = useState([]);
   const [keyword, setKeyword] = useState('');
   const [persons, setPersons] = useState(['men', 'women']);

   useEffect(() => {
      axios
         .get(`${config.api.url}/clothes/filter`, {
            params: {
               keyword: keyword,
               persons: persons,
            },
         })
         .then((response) => {
            setListSale(response.data);
         })
         .catch((error) => {
            toast.error(error.response.data.message);
         });
   }, [keyword, persons]);

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
                  placeholder="Tìm kiếm theo tên sp"
                  onChange={(e) => {
                     setKeyword(e.target.value);
                  }}
               />
            </div>
            <div className={cx('filter')}>
               {listTypePerson.map((person) => (
                  <div className={cx('filter_option')}>
                     <input
                        type="checkbox"
                        id={person}
                        name={person}
                        value={person}
                        defaultChecked={persons.includes(person)}
                        onChange={(e) => {
                           if (e.target.checked) {
                              setPersons([...persons, e.target.value]);
                           } else {
                              setPersons(persons.filter((item) => item !== e.target.value));
                           }
                        }}
                     />
                     <label for={person}>{person}</label>
                  </div>
               ))}
            </div>
         </div>
         <div className={cx('list_sale')}>
            {listSale && listSale.map((item, index) => <SaleItem key={index} item={item} />)}
         </div>
      </div>
   );
}

export default ListSale;
