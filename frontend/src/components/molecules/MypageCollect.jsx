import React from "react";
import { useEffect } from "react";
import { MypageLetter } from "../atoms/MypageLetter";

export const MypageCollect = () => {
  useEffect(() => {
    console.log('Collect')
  }, [])
  return (
    <>
      <MypageLetter></MypageLetter>
      <MypageLetter></MypageLetter>
    </>  
  )
}