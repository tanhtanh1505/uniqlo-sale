import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Login.module.scss';
import useFetch from '~/hooks/useFetch';
import { useEffect } from 'react';
import config from '~/config';
import images from '~/assets/images';
const cx = classNames.bind(styles);

function Login() {
   const { handleGoogle, loading, error } = useFetch(`${config.api.url}/auth/login`);

   useEffect(() => {
      /* global google */
      if (window.google) {
         google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleGoogle,
         });

         google.accounts.id.renderButton(document.getElementById('loginDiv'), {
            // type: "standard",
            theme: 'filled_black',
            // size: "small",
            text: 'signin_with',
            shape: 'pill',
         });

         // google.accounts.id.prompt()
      }
   }, [handleGoogle]);

   return (
      <div className={cx('wrapper')}>
         <img className={cx('logo')} src={images.logo} alt="logo" />

         <h1 className={cx('header')}>Uniqlo Sale</h1>

         <main
            style={{
               display: 'flex',
               justifyContent: 'center',
               flexDirection: 'column',
               alignItems: 'center',
            }}
         >
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <div>Loading....</div> : <div id="loginDiv"></div>}
         </main>

         <Link to={config.routes.home} className={cx('guest')}>
            🥷 Or try as guest
         </Link>
      </div>
   );
}

export default Login;
