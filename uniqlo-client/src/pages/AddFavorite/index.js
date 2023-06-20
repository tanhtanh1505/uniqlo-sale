import classNames from 'classnames/bind';
import styles from './AddFavorite.module.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '~/config';
import Button from '~/components/Button/Button';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function AddFavorite() {
   const code = useParams().code ?? 'E458104-001';
   const [url, setUrl] = useState('');
   const [product, setProduct] = useState({});
   const [loading, setLoading] = useState(false);
   const [selected, setSelected] = useState(null);
   const [added, setAdded] = useState(false);
   const [expectedPrice, setExpectedPrice] = useState(0);

   useEffect(() => {
      if (code) {
         setLoading(true);
         axios
            .get(`${config.api.url}/clothes/find-by-code?code=${code}`)
            .then((res) => {
               setProduct(res.data);
               setLoading(false);
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }, [code]);

   const handleSearch = async () => {
      setLoading(true);
      if (!url || loading) return;

      axios
         .get(`${config.api.url}/clothes/find-by-url?url=${url}`)
         .then((res) => {
            setProduct(res.data);
            setLoading(false);
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleChangeUrl = (e) => {
      if (loading) return;

      setUrl(e.target.value);
   };

   const handlePick = async (index) => {
      setSelected(index);
      await compare(index, expectedPrice);
   };

   const handleChangeExpectedPrice = async (e) => {
      setExpectedPrice(e.target.value);
   };

   const handleAddFavorite = async () => {
      if (selected == null) {
         toast.error('Please pick a color and size');
         return;
      }
      const { color, size } = product.sizeColor[selected];
      const data = {
         code: product.code,
         size: size,
         color: color,
         price: expectedPrice,
      };

      if (!localStorage.getItem('token')) {
         toast.error('Please login to add favorite');
         return;
      }

      axios
         .post(`${config.api.url}/favorites/add`, data, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
            },
         })
         .then((res) => {
            toast.success('Add favorite success');
            setAdded(true);
         })
         .catch((err) => {
            toast.error('Add favorite failed');
         });
   };

   const handleRemoveFavorite = async () => {
      if (selected == null) {
         toast.error('Please pick a color and size');
         return;
      }
      const { color, size } = product.sizeColor[selected];

      axios
         .delete(`${config.api.url}/favorites/delete?color=${color}&size=${size}&code=${product.code}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
            },
         })
         .then((res) => {
            toast.success('Delete favorite success');
            setAdded(false);
         })
         .catch((err) => {
            toast.error('Delete favorite failed');
         });
   };

   const compare = async (index) => {
      const { color, size } = product.sizeColor[index];
      axios
         .get(`${config.api.url}/favorites/compare?code=${product.code}&color=${color}&size=${size}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
            },
         })
         .then((res) => {
            console.log(res.data);
            setAdded(res.data.exist);
            if (res.data.exist) {
               // change value expect price input
               setExpectedPrice(res.data.price);
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <div className={cx('wrapper')}>
         <div className={cx('search_box')}>
            <input type="text" placeholder="Enter a product URL" onChange={handleChangeUrl} />

            <Button onClick={handleSearch} primary>
               Search
            </Button>
         </div>
         {loading ? (
            <>
               <div className={cx('loading')}>Loading...</div>
            </>
         ) : (
            <>
               {product ? (
                  <>
                     <div className={cx('product')}>
                        <div className={cx('product_img')}>
                           <a href={product.url}>
                              <img src={product.image} alt="" />
                           </a>
                        </div>
                        <div className={cx('product_detail')}>
                           <div className={cx('')}>
                              <h1>
                                 <a href={product.url}> {product.title}</a>
                              </h1>
                           </div>
                           <div className={cx('product_sale')}>
                              <h3 className={cx('product_sale_old')}>
                                 {product.price === product.salePrice ? '' : `${product.price} VND`}
                              </h3>
                              <h1 className={cx('product_sale_new')}>
                                 {product.sale ? `${product.salePrice} VND` : ''}
                              </h1>
                              <p>{product.sale ? 'Sale' : ''}</p>
                           </div>
                           <div className={cx('product_color')}>
                              <h2>Color and Size</h2>
                              <div className={cx('list_color')}>
                                 {product.sizeColor &&
                                    product.sizeColor.map((item, index) => {
                                       return (
                                          <div
                                             className={`${cx('item_color')} ${
                                                selected === index ? cx('selected_color') : null
                                             } ${item.sale ? cx('sale_item') : null}`}
                                             key={index}
                                          >
                                             <input
                                                type="radio"
                                                name="color"
                                                id={index}
                                                onClick={() => handlePick(index)}
                                             />
                                             <label htmlFor={index}>
                                                {item.color} - {item.size} - {item.price}
                                             </label>
                                          </div>
                                       );
                                    })}
                              </div>
                           </div>
                           <div className={cx('expect_price')}>
                              <h2>Expected price</h2>
                              <input type="number" onChange={handleChangeExpectedPrice} value={expectedPrice} />
                           </div>

                           <div className={cx('add_btn')}>
                              <Button onClick={handleAddFavorite} primary>
                                 {added ? 'Replace price' : 'Add to Favorites'}
                              </Button>
                              {added ? (
                                 <Button onClick={handleRemoveFavorite} outline>
                                    Remove from Favorites
                                 </Button>
                              ) : null}
                           </div>
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className={cx('')}>Product not found</div>
                  </>
               )}
            </>
         )}
      </div>
   );
}

export default AddFavorite;
