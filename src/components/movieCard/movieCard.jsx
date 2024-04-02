import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
const MovieCard = ({ video }) => {
    return (
        <div className={`rounded-t-[15px] hover:ease-in-out hover:delay-500 transition-border hover:duration-500 hover:rounded-none group cursor-pointer`}>
            <div className='flex overflow-hidden justify-center items-center cursor-pointer relative ' onClick={()=>{window.open(`https://www.youtube.com/watch?v=${video.snippet.link}`)}}>
                < img src={video.snippet.thumbnails.medium.url} alt="thumbnail" className='rounded-[15px] phones:rounded-none phones:group-hover:scale-100 group-hover:delay-500 ease-in-out group-hover:group-hover:rounded-none duration-500 group-hover:scale-105 cursor-pointer min-w-fit tablets:w-[26rem] w-[28rem] smalltablets:w-[40rem] phones:w-screen' />
                <div className='absolute bottom-2 right-2 bg-neutral-950 rounded-lg px-2 py-1 tracking-wider font-semibold text-neutral-300 text-sm group-hover:opacity-0 duration-200 delay-500'>
                    <p>{video.snippet.videoLength}</p>
                </div>
            </div>
            < div className='flex py-2 justify-between phones:py-4 items-start phones:pl-4' >
                <div className='flex space-x-3'>
                    <div className='flex justify-center rounded-full h-10 w-10 cursor-pointer'>
                        <img src={video.snippet.channelThumbnail} alt="profile" className='h-10 w-10 rounded-full border-green-600 border-2 ' />
                    </div>
                    <div className='tracking-tight leading-tight '>
                        <h1 className='tracking-tight cursor-pointer text-neutral-700 dark:text-neutral-300'>{video.snippet.title.length > 40 ? video.snippet.title.slice(0, 40) + '...' : video.snippet.title.length}</h1>
                        <div className='py-1 text-neutral-500'>
                            <p className=' text-sm cursor-pointer truncate'>{video.snippet.channelTitle.length > 30 ? video.snippet.channelTitle.slice(0, 30) + '...' : video.snippet.channelTitle}</p>
                            <p className=' text-sm cursor-pointer truncate'> {video.snippet.viewsDescription}  &middot; {video.snippet.timeDescription}</p>
                        </div>
                    </div>
                </div>
                <div className='text-neutral-700 text-2xl rounded-full dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:text-neutral-200 p-2 cursor-pointer hover:bg-neutral-300 hover:duration-200 active:bg-neutral-400 active:text-neutral-700'>
                    <BsThreeDotsVertical />
                </div>
            </div >
        </div >
    )
}

export default MovieCard