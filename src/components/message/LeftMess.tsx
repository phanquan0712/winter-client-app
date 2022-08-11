import React, { useEffect, useState, useRef } from 'react'
import UserCard from '../card/UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { FormSubmit, RootStore, IUser } from '../../utils/Typescript'
import NotFound from '../global/NotFound'
import { ALERT } from '../../redux/types/alertType'
import { getApi } from '../../utils/fetchData'
import { getConversation, getMessages } from '../../redux/action/messageAction'
import { useNavigate, useParams } from 'react-router-dom'
import { ADD_USER, CHECK_USER_ONLINE, IUserMessage } from '../../redux/types/messageType'


const LeftMess = () => {
   const { auth, message, online } = useSelector((state: RootStore) => state);
   const [search, setSearch] = useState<string>('')
   const [searchUsers, setSearchUsers] = useState<IUserMessage[]>([])
   const dispatch = useDispatch();
   const navigatte = useNavigate();
   const { id } = useParams();

   const pageEnd = useRef<HTMLButtonElement>(null)
   const [page, setPage] = useState<number>(0)


   useEffect(() => {
      const observer = new IntersectionObserver(entries => {
         if (entries[0].isIntersecting) {
            setPage(prev => prev + 1)
         }
      }, {
         threshold: 0.1
      })
      if (pageEnd.current) {
         observer.observe(pageEnd.current)
      }
   }, [setPage, pageEnd.current])


   useEffect(() => {
      if (message.totalUser >= (page - 1) * 9 && page > 1 && message.firstLoad) {
            dispatch(getConversation(auth, page))
            
      }
   }, [message.totalUser, page, dispatch, auth])




   const handleSubmit = async (e: FormSubmit) => {
      e.preventDefault();
      if (!search) return setSearchUsers([])

      try {
         const res = await getApi(`search?username=${search}`, auth.access_token);
         setSearchUsers(res.data.users);
      } catch (err: any) {
         dispatch({ type: ALERT, payload: err.response.data.msg })
      }

   }

   const handleAddUser = (user: IUser) => {
      setSearch('');
      setSearchUsers([]);
      if (message.users.every(item => item._id !== user._id)) {
         dispatch({ type: ADD_USER, payload: user });
      }
      return navigatte(`/message/${user._id}`)
   }

   const isActive = (user: IUser) => {
      if (user._id === id) return 'active'
   }


   useEffect(() => {
      if (message.firstLoad) return;
      dispatch(getConversation(auth))
      console.log('Hello')
   }, [auth, dispatch, message.firstLoad])

   useEffect(() => {
      if (message.firstLoad) {
         dispatch({ type: CHECK_USER_ONLINE, payload: online })
      }
   }, [dispatch, message.firstLoad, online])


   if (!auth.user || !auth.access_token) return <NotFound />;
   return (
      <>
         <form className="message_header" onSubmit={handleSubmit}>
            <input type="text" placeholder='Search'
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' id='search'>Search</button>
         </form>

         <div className='message_chat_list'>
            <div>
               {
                  searchUsers.length !== 0 ?
                     <>
                        {
                           searchUsers.map(item => (
                              <div key={item._id} className={`message_user ${isActive(item)} `}
                                 onClick={() => handleAddUser(item)}
                              >
                                 <div style={{ pointerEvents: 'none' }}>
                                    <UserCard user={item} border={''}>
                                       {
                                          item.online ?
                                             <i className='fas fa-circle active'></i>
                                             :
                                             auth.user?.following.find(ele => ele._id === item._id) &&
                                             <i className='fas fa-circle'></i>
                                       }
                                    </UserCard>
                                 </div>
                              </div>
                           ))
                        }
                     </>
                     :
                     <>
                        {
                           message.users.map(item => (
                              <div key={item._id} className={`message_user ${isActive(item)} `}
                                 onClick={() => handleAddUser(item)}
                              >
                                 <UserCard user={item} border={''}>
                                    {
                                       item.online ?
                                          <i className='fas fa-circle active'></i>
                                          :
                                          auth.user?.following.find(ele => ele._id === item._id) &&
                                          <i className='fas fa-circle'></i>
                                    }
                                 </UserCard>
                              </div>
                           ))
                        }
                     </>
               }
            </div>
            <button ref={pageEnd} style={{ opacity: 0 }}>Load more</button>
         </div>
      </>
   )
}

export default LeftMess