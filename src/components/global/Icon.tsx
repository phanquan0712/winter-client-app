import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore } from '../../utils/Typescript'

interface IProps {
   content: string
   setContent: (value: string) => void
}
const Icon = ({ content, setContent }: IProps) => {
   const reactions = [
      '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
      '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
      '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵',
      '💩','😡'
   ]

const { theme } = useSelector((state: RootStore) => state)
return (
   <div className="nav-item dropdown"
      style={{ opacity: 1, filter: theme ? 'invert(1)' : 'invert(0)' }}>

      <span className="nav-link position-relative px-1" id="navbarDropdown"
         role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
         <span style={{ fontSize: '20px' }}>😄</span>
      </span>

      <div className="dropdown-menu" aria-labelledby="navbarDropdown"
         style={{ zIndex: 99}}
      >
         <div className="reactions">
            {
               reactions.map((icon, index) => (
                  <span key={index} onClick={() => setContent(content + icon)}>
                     {icon}
                  </span>
               ))
            }
         </div>
      </div>

   </div>
)
}

export default Icon