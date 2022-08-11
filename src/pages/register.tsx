import React, { useState } from 'react'
import { IRegisterUser } from '../utils/Typescript';
import { useDispatch } from 'react-redux';
import { InputChange, FormSubmit } from '../utils/Typescript';
import { Link } from 'react-router-dom';
import { register } from '../redux/action/authAction';
import { useSelector } from 'react-redux';
import { RootStore } from '../utils/Typescript';
import WinterLogo from '../images/winter_logo2.png'


const Register = () => {
   const initState: IRegisterUser = { fullname: '', email: '', password: '', cf_password: '', username: '', gender: 'male' };
   const [userData, setUserData] = useState<IRegisterUser>(initState);
   const [typePass, setTypePass] = useState<boolean>(false);
   const [cfTypePass, setCfTypePass] = useState<boolean>(false);
   const {  gender } = userData;
   const { alert } = useSelector((state: RootStore) => state)
   const dispatch = useDispatch();



   const handleChangeInput = (e: InputChange) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
   }

   const handleSubmit = (e: FormSubmit) => {
      e.preventDefault();
      dispatch(register(userData));
   }
   return (
      <div className='auth_page'>
         <div className="auth_box">
         <div className='w-100 text-center' >
                  {/* <h1 className="navbar-brand text-uppercase logo" >Winter</h1> */}
                  <img src={WinterLogo} alt="logo" className="logo"
                     style={{ borderRadius: '50rem'}}
                  />
            </div>
            <form onSubmit={handleSubmit}>

               <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input type="text" className="form-control" name='fullname' id="fullname"
                     onChange={handleChangeInput}
                  />
               </div>


               <div className="form-group">
                  <label htmlFor="username">User Name</label>
                  <input type="text" className="form-control" name='username' id="username"
                     onChange={handleChangeInput}
                  />
               </div>


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


               <div className="form-group">
                  <label htmlFor="cf_password">Confirm Password</label>
                  <div className='pass'>
                     <input type={cfTypePass ? 'text' : 'password'} name="cf_password" className="form-control" id="cf_password"
                        onChange={handleChangeInput}
                     />
                     <small onClick={() => setCfTypePass(!cfTypePass)}>
                        {
                           cfTypePass ?
                              <i className="far fa-eye-slash"></i>
                              :
                              <i className="fas fa-eye"></i>
                        }
                     </small>
                  </div>
               </div>

               <div className="form-group">
                     <select value={gender} name='gender' className='w-100 py-2 my-2' onChange={handleChangeInput}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                     </select>
               </div>



               <button type="submit"
                  className="btn btn-dark w-100">Register</button>

               <p className='my-2'>
                  Already have an account? <Link style={{ color: 'crimson' }} to={'/'}>Login now!</Link>
               </p>
            </form>
         </div>
      </div>
   )
}

export default Register