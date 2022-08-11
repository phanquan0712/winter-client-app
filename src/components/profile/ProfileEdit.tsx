import React, { useState, useEffect } from 'react'
import { FormSubmit, IUser } from '../../utils/Typescript'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'
import { InputChange } from '../../utils/Typescript'
import { checkImage } from '../../utils/imageUpload'
import { ALERT } from '../../redux/types/alertType'
import { updateProfileUser } from '../../redux/action/userAction'


interface IProps {
   user: IUser
   setOnEdit: (value: boolean) => void
}
const ProfileEdit = ({ user, setOnEdit }: IProps) => {
   const initState = {
      fullname: '', mobile: '', address: '', website: '', story: '', gender: ''
   }
   const { auth, theme, alert } = useSelector((state: RootStore) => state)
   const [userData, setUserData] = useState(initState)
   const { fullname, mobile, address, story, gender, website } = userData
   const dispatch = useDispatch()
   const [avatar, setAvatar] = useState<string | File>('')

   useEffect(() => {
      setUserData(user)
      return () => setUserData(initState)
   }, [user])


   const changeAvatar = (event: InputChange) => {
      const target = event.target as HTMLInputElement
      const files = target.files;
      if (files) {
         const file = files[0];
         const err = checkImage(file)
         if (err) {
            return dispatch({ type: ALERT, payload: { error: err } })
         }
         setAvatar(file)
      }
   }

   const handleChangeInput = (event: InputChange) => {
      const { name, value } = event.target;
      setUserData({ ...userData, [name]: value })
   }


   const handleSubmit = (e: FormSubmit) => {
      e.preventDefault();
      if(auth.access_token)
      dispatch(updateProfileUser({ ...userData, avatar }, auth))
   }

   useEffect(() => {
      if(alert.errCode === 2) {
         setOnEdit(false)
      }
   }, [alert])
   
   return (
      <div className="edit_profile">
         <button className='btn btn-danger btn_close'
            onClick={() => setOnEdit(false)}
         >
            Close
         </button>

         <form onSubmit={handleSubmit}>
            <div className="info_avatar">
               <img src={avatar ? typeof (avatar) === 'string' ? avatar : URL.createObjectURL((avatar as File)) : auth.user?.avatar} alt="avatar"
                  style={{ filter: theme ? 'invert(1)' : 'intvert(0)' }}
               />
               <span>
                  <i className='fas fa-camera'></i>
                  <p>Change</p>
                  <input type="file" name='file' id='file_up' accept='image/*' onChange={changeAvatar} />
               </span>
            </div>

            <div className='form-group'>
               <label htmlFor="fullname">Full Name</label>
               <div className='position-relative'>
                  <input
                     type="text"
                     name='fullname'
                     id='fullname'
                     className='form-control'
                     value={fullname}
                     onChange={handleChangeInput}
                  />
                  <small className='text-danger position-absolute'
                     style={{ position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)' }}
                  >
                     {fullname.length}/25
                  </small>
               </div>
            </div>

            <div className='form-group'>
               <label htmlFor="mobile">Mobile</label>
               <input type="text" name='mobile' id='mobile' className='form-control'
                  value={mobile} onChange={handleChangeInput}
               />
            </div>

            <div className='form-group'>
               <label htmlFor="address">Address</label>
               <input type="text" name='address' id='address' className='form-control'
                  value={address} onChange={handleChangeInput}
               />
            </div>

            <div className='form-group'>
               <label htmlFor="website">Website</label>
               <input type="text" name='website' id='website' className='form-control'
                  value={website} onChange={handleChangeInput}
               />
            </div>

            <div className='form-group'>
               <label htmlFor="story">Story</label>
               <div className='position-relative'>
                  <textarea name='story' id='story' className='form-control' cols={30} rows={4}
                     value={story} onChange={handleChangeInput}
                  />
                  <small style={{ position: 'absolute', right: '7px', bottom: '3px', opacity: '0.7' }}>
                     {story.length}/200
                  </small>
               </div>
            </div>

            <div className='form-group'>
               <label htmlFor="gender">Gender</label>
               <div className="form-group">
                  <select value={gender} name='gender' id='gender' className='w-100 py-2 my-2' onChange={handleChangeInput}>
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                     <option value="other">Other</option>
                  </select>
               </div>
            </div>

         <button className='btn btn-dark w-100'>
            Save
         </button>

         </form>
      </div>
   )
}

export default ProfileEdit