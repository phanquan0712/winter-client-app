import React from 'react'
import { useParams } from 'react-router-dom'
import { IParams } from '../utils/Typescript'
import NotFound from '../components/global/NotFound'
import { useSelector } from 'react-redux'
import { RootStore } from '../utils/Typescript'
const generatePage = (pageName: string) => {
   const component = () => require(`../pages/${pageName}`).default;

   try {
      return React.createElement(component())
   } catch(err: any) {
      return <NotFound />
   }
}


const PageRender = () => {
   const { auth} = useSelector((state: RootStore) => state);
   const { page, id}: IParams = useParams()
   let pageName = ''
   if(auth.access_token && auth.user)  {
      if(id) {
         pageName = `${page}/[id]`
      } else  {
         pageName = `${page}`
      }
   }
   return generatePage(pageName)
}

export default PageRender