import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Button from '~/components/Button/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Category from './Category';
const cx = classNames.bind(styles);

function Home() {
   const [url, setUrl] = useState('');
   const navigate = useNavigate();

   const handleChangeUrl = (e) => {
      setUrl(e.target.value);
   };

   const handleSearch = () => {
      if (!url) return;
      // convert url to code
      const code = url.split('?')[0].split('/').pop();
      navigate(`/add-favorite/${code}`);
   };

   return (
      <div className={cx('wrapper')}>
         <h1>
            <span className={cx('text_sale')}>Săn sale,</span> theo dõi sản phẩm bạn yêu thích ngay nào!
         </h1>
         <div className={cx('search_box')}>
            <input type="text" placeholder="Copy link sản phẩm và paste vào đây nha!" onChange={handleChangeUrl} />

            <Button primary onClick={handleSearch}>
               Go to search
            </Button>
         </div>
         <h1 className={cx('special')}>
            Sản phẩm
            <span className={cx('text_sale')}> nổi bật</span>
         </h1>
         <div className={cx('categories')}>
            <Category key="men" person="men" title="Nam" />
            <Category key="women" person="women" title="Nữ" />
            <Category key="kids" person="kids" title="Trẻ em" />
         </div>
      </div>
   );
}

export default Home;
