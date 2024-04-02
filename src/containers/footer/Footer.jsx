import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { IoAddCircle, IoSettingsOutline } from 'react-icons/io5';
import { MdAppShortcut, MdSubscriptions } from 'react-icons/md';
const Footer = () => {
  return (
    <>
      <div className="bg-neutral-100 dark:bg-black border-t dark:border-neutral-900 w-screen fixed bottom-0 hidden phones:flex justify-evenly text-neutral-700 text-xs items-center py-1 gap-x-4">
        <div className='flex flex-col items-center w-8 rounded-full dark:active: dark:hover:text-neutral-400 dark:text-neutral-300'>
          <AiOutlineHome className='text-2xl' />
          <a href="/#">Home</a>
        </div>
        <div className='flex flex-col items-center w-8  dark:text-neutral-300 dark:hover:text-neutral-400'>
          <MdSubscriptions className='text-2xl' />
          <a href="/#">Subscriptions</a>
        </div>
        <div className='flex flex-col items-center w-8 dark:text-neutral-300 dark:hover:text-neutral-400'>
          <IoAddCircle className='text-3xl' />
        </div>
        <div className='flex flex-col items-center w-8 dark:text-neutral-300 dark:hover:text-neutral-400'>
          <MdAppShortcut className='text-2xl' />
          <a href="/#">Shorts</a>
        </div>
        <div className='flex flex-col items-center w-8 dark:text-neutral-300 dark:hover:text-neutral-400'>
          <IoSettingsOutline className='text-2xl' />
          <a href="/#">Settings</a>
        </div>
      </div>
    </>
  )
}

export default Footer