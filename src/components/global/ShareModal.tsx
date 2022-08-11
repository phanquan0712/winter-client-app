import React from 'react'

import {
   EmailShareButton,
   FacebookShareButton,
   TelegramShareButton,
   TwitterShareButton,
   WhatsappShareButton,
} from "react-share";

import {
   EmailIcon,
   FacebookIcon,
   TelegramIcon,
   TwitterIcon,
   WhatsappIcon,
} from "react-share";

interface IProps {
   url: string
   theme: boolean
}
const ShareModal = ({ url, theme }: IProps) => {

   return (
      <div className='share_modal d-flex justify-content-between px-4 py-3'
         style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
      >
         <FacebookShareButton url={url}>
            <FacebookIcon round={true} size={32} />
         </FacebookShareButton>

         <TwitterShareButton url={url}>
            <TwitterIcon round={true} size={32} />
         </TwitterShareButton>

         <EmailShareButton url={url}>
            <EmailIcon round={true} size={32} />
         </EmailShareButton>


         <TelegramShareButton url={url}>
            <TelegramIcon round={true} size={32} />
         </TelegramShareButton>

         <WhatsappShareButton url={url}>
            <WhatsappIcon round={true} size={32} />
         </WhatsappShareButton>
      </div>
   )
}

export default ShareModal