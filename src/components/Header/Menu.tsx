import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import { logout } from '../../redux/action/authAction'
import { THEME } from '../../redux/types/themeType'
import Avatar from './Avatar'
import NotifyModal from '../global/NotifyModal'
import { INotify } from '../../redux/types/notifyType'
import { STATUS } from '../../redux/types/statusType'


const Menu = () => {
   const dispatch = useDispatch();
   const { auth, theme, notify, status } = useSelector((state: RootStore) => state);
   const { pathname } = useLocation();

   const isActive = (path: string) => {
         return 'active'
   }

   const convertArray = (data: INotify[]) => {
      const newArr: INotify[] = []
      data.forEach((item: INotify) => {
         if (newArr.find(ele => ele._id === item._id)) {
            return;
         }
         else {
            newArr.push(item)
         }
      })
      return newArr;
   }


   const navLinkPc = [
      { label: 'Home', icon: 'home', path: '/' },
      { label: 'Message', icon: 'near_me', path: '/message' },
      { label: 'Discover', icon: 'explore', path: '/discover' },
   ]

   const navLinkMobile = [
      { label: 'Search', icon: 'search', path: '/search' },
      { label: 'Message', icon: 'near_me', path: '/message' },
      { label: 'Add', icon: 'add', path: '/add' },
      { label: 'Discover', icon: 'explore', path: '/discover' },
   ]

   return (
      <div className="menu" id="navbarSupportedContent">
         <ul className="navbar-nav mr-auto d-flex align-items-center"
         >
            {
               window.innerWidth > 768 ?
                  navLinkPc.map((item, index) => (
                     <li className={`nav-item ${isActive(item.path)}`} key={index}>
                        <Link className={`nav-link`} to={item.path} >
                           <span className='material-icons'>{item.icon}</span>
                        </Link>
                     </li>
                  ))
                  :
                  navLinkMobile.map((item, index) => (
                     <li className={`nav-item ${isActive(item.path)}`} key={index}>
                        <Link className={`nav-link`} to={item.path} >
                           <span className='material-icons'
                           style={{
                              border: item.label === 'Add' ? '1px solid' : '',
                              padding: item.label === 'Add' ? '0.125rem' : '',
                              borderRadius: item.label === 'Add' ? '50%' : '',
                              fontSize: item.label === 'Add' ? '1.25rem' : '',
                              color: '#333'
                           }}
                           >{item.icon}</span>
                        </Link>
                     </li>
                  ))
            }


            <li className="nav-item dropdown mb-1 active postsition-relative">
               <span className="nav-link material-icons" id="navbarDropdown" role="button" data-toggle="dropdown">
                  favorite
               </span>
               <span
                  className='position-absolute'
                  style={{
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     fontSize: '12px',
                     color: '#fff',
                     pointerEvents: 'none',
                  }}
               >{convertArray(notify.data).length}</span>
               <div className="dropdown-menu dropdown_notify" aria-labelledby="navbarDropdown">
                  <NotifyModal data={convertArray(notify.data)} sound={notify.sound} />
               </div>
            </li>

            <li className="nav-item dropdown mb-1">
               <span className="nav-link" id="navbarDropdown" role="button" data-toggle="dropdown">
                  {auth.user &&
                     <Avatar src={auth.user.avatar} size='medium' />
                  }
               </span>
               <div className="dropdown-menu dropdown_profile" aria-labelledby="navbarDropdown">
                  <Link className="dropdown-item" to={`/profile/${auth.user?._id}`}>Profile</Link>
                  <label className="dropdown-item" htmlFor='theme'
                     onClick={() => dispatch({ type: THEME, payload: !theme })}
                     style={{ cursor: 'pointer' }}
                  >
                     {theme ? 'Light Mode' : 'Dark Mode'}
                  </label>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item"
                     onClick={() => dispatch(logout())}
                     to={`/logout`}>Logout</Link>
               </div>
            </li>
         </ul>
      </div >
   )
}

export default Menu