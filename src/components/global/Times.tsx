import React, { useState, useEffect } from 'react'


interface IProps {
   total: number
}
const Times = ({ total }: IProps) => {
   const [hour, setHour] = useState<number>(0)
   const [mins, setMins] = useState<number>(0)
   const [second, setSecond] = useState<number>(0)

   
   useEffect(() => {
      setSecond(total % 60);
      setMins(parseInt((total / 60).toString()));
      setHour(parseInt((total / 3600).toString()));
   }, [total])

   return (
      <div>
         <span>{hour.toString().length < 2 ? '0' + hour : hour}</span>
         <span>:</span>
         <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
         <span>:</span>
         <span>{second.toString().length < 2 ? '0' + second : second}</span>
      </div>
   )
}

export default Times