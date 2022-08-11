import { IRegisterUser } from "./Typescript";

export const ValidRegister = ({ fullname, username, email, password, cf_password }: IRegisterUser) => {
   const errors: string[] = [];

   if (!fullname) {
      errors.push('Please add your full name!')
   }
   else if (fullname.length > 20) {
      errors.push('Full name must be less than 20 characters!')
   }

   if (!username) {
      errors.push('Please add your user name!')
   }
   else if (username.length > 20) {
      errors.push('User name must be less than 20 characters!')
   }

   // check account
   if (!email) {
      errors.push('Please add your email!')
   }
   else if (!validateEmail(email)) {
      errors.push('Emailformat is incorrect!')
   }
   // check password
   if (password.length < 6) {
      errors.push('Password must be at least 6 characters!')
   }
   else if(password !== cf_password) {
      errors.push('Password and confirm password must be the same!')
   }


   return {
      errMsg: errors,
      errLength: errors.length
   }
}

const validateEmail = (email: string) => {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};