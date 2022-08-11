import React from 'react'
import { useDispatch } from 'react-redux'
import { GoogleLoginResponse, GoogleLogin } from 'react-google-login-lite';
// import { facebookLogin, googlelogin } from '../../redux/action/authAction';
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
const SocialLogin = () => {
   const dispatch = useDispatch();
   // Google
   const onSuccess = (googleUser: GoogleLoginResponse) => {
      console.log(googleUser);
      
      const id_token = googleUser.getAuthResponse().id_token;      
      // dispatch(googlelogin(id_token));
   }

   // Facebook
   const onFbSuccess = (response: FacebookLoginAuthResponse) => {
      console.log(response);
      const { accessToken, userID } = response.authResponse
      // dispatch(facebookLogin(accessToken, userID));
   }

   return (
      <div className='my-2'>
         <GoogleLogin
            client_id='393258030309-nvs8hgp1j0urrpn59fgfg2qllpngn2ij.apps.googleusercontent.com'
            cookiepolicy='single_host_origin'
            onSuccess={onSuccess}
         />
         <FacebookLogin
            appId="1400497563753220"
            onSuccess={onFbSuccess}
         />
      </div>
   )
}

export default SocialLogin