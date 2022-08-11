import React from 'react'
import { useSelector } from 'react-redux'
import { RootStore } from '../../utils/Typescript'

interface IProps {
   src: string
   size: string
}
const Avatar = ({ src, size }: IProps) => {
   const { theme } = useSelector((state: RootStore) => state);


   return (
      <img src={src} alt="avatar" className={`${size}-avatar avatar`}
         style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
      />
   )
}

export default Avatar