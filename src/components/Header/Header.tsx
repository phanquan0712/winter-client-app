import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'
import WinterLogo from '../../images/winter_logo2.png'
const Header = () => {


   const handleClickLogo = () => {
      window.scrollTo(0, 0);
   }
   return (
      <div className="header bg-light">
         <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between align-items-center">
            <Link to={`/`} className="logo_link d-flex align-items-center" onClick={handleClickLogo}
               style={{ textDecoration: 'none' }}
            >
               {
                  window.innerWidth > 768 ?
                     <div style={{ width: '45px', height: '45px'}} className='mr-2'>
                        <img src={WinterLogo} alt="logo" className="logo w-100 h-100" />
                     </div>
                  :
                  ''
               }
               <h1 className="navbar-brand text-uppercase logo" style={{ letterSpacing: 2 }}>Winter</h1>
            </Link>
            {
               window.innerWidth > 768 &&
               <Search />
            }
            <Menu />
         </nav>
      </div>
   )
}

export default Header 