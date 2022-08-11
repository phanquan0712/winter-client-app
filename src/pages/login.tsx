import React, { useState, useEffect } from 'react'
import { InputChange, FormSubmit } from '../utils/Typescript';
import { Link } from 'react-router-dom';
import { login } from '../redux/action/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { ILoginUser } from '../utils/Typescript';
import { RootStore } from '../utils/Typescript';
import { useNavigate } from 'react-router-dom';
import WinterLogo from '../images/winter_logo2.png'

const Login = () => {
   const initState: ILoginUser = { email: '', password: '' };
   const [userData, setUserData] = useState<ILoginUser>(initState);
   const [typePass, setTypePass] = useState<boolean>(false);
   const { email, password } = userData;
   const dispatch = useDispatch();
   const { auth } = useSelector((state: RootStore) => state);
   const navigate = useNavigate();
   useEffect(() => {
      if (auth.access_token) {
         navigate('/');
      }
   }, [auth.access_token, navigate])


   const handleChangeInput = (e: InputChange) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
   }

   const handleSubmit = (e: FormSubmit) => {
      e.preventDefault();
      dispatch(login(userData));
   }

   return (
      <div className='auth_page'>
         <div className="auth_box">
            <div className='w-100 text-center mb-2' >
                  {/* <h1 className="navbar-brand text-uppercase logo" >Winter</h1> */}
                  <img src={WinterLogo} alt="logo" className="logo"
                     style={{ borderRadius: '50rem'}}
                  />
            </div>
            <form onSubmit={handleSubmit}>
               <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input type="email" className="form-control" name='email' id="exampleInputEmail1" aria-describedby="emailHelp"
                     onChange={handleChangeInput}
                  />
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
               </div>
               <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <div className='pass'>
                     <input type={typePass ? 'text' : 'password'} name="password" className="form-control" id="exampleInputPassword1"
                        onChange={handleChangeInput}
                     />
                     <small onClick={() => setTypePass(!typePass)}>
                        {
                           typePass ?
                              <i className="far fa-eye-slash"></i>
                              :
                              <i className="fas fa-eye"></i>
                        }
                     </small>
                  </div>
               </div>
               <button type="submit"
                  disabled={(email && password) ? false : true}
                  className="btn btn-dark w-100">Login</button>

               <p className='my-2'>
                  You don't have an account? <Link style={{ color: 'crimson' }} to={'/register'}>Register now</Link>
               </p>
            </form>
         </div>
      </div>
   )
}

export default Login