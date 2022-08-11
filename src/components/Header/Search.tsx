import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { IUser, FormSubmit } from '../../utils/Typescript'
import { RootStore } from '../../utils/Typescript';
import { getApi } from '../../utils/fetchData';
import { ALERT } from '../../redux/types/alertType';
import UserCard from '../card/UserCard';
import { Link } from 'react-router-dom';
const loadIcon = require('../../images/loading.gif');

const Search = () => {
   const [search, setSearch] = useState<string>('')
   const [users, setUsers] = useState<IUser[]>([]);

   const { auth } = useSelector((state: RootStore) => state);
   const dispatch = useDispatch();
   const [load, setLoad] = useState<boolean>(false)

   const handleSearch = async (e: FormSubmit) => {
      e.preventDefault();
      if (!search) return;

      try {
         setLoad(true);
         const res = await getApi(`search?username=${search}`, auth.access_token);
         setUsers(res.data.users);
         setLoad(false)
      } catch (err: any) {
         dispatch({ type: ALERT, payload: err.response.data.msg })
      }
   }


   const handleClose = () => {
      setSearch('');
      setUsers([]);
   }

   return (
      <form className='search_form' onSubmit={handleSearch}>
         <input type="text " name='search' id='search' value={search} placeholder=" "
            onChange={(e) => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
         />
         <label htmlFor="search" className='search_label'>
            <span className='material-icons'>search</span>
            <span>Search</span>
         </label>

         <div className='close-icon' onClick={handleClose}>&times;</div>
         <button type='submit' style={{ display: 'none' }}>Search</button>
         {load && <img src={loadIcon} alt='loading' className='loading' />}
         <div className="users">
            {
               users.length > 0 &&
               users.map((user) => (
                     <UserCard
                        user={user}
                        key={user._id}
                        border='border'
                        handleClose={handleClose}
                     />
               ))
            }
         </div>
      </form>
   )
}

export default Search