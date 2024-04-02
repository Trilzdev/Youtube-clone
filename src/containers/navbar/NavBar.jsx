import React, { useState } from 'react'
import profile from './profile-picture.jpg'
import { FaYoutube, AiOutlineBell, IoSearchOutline, RiVideoAddLine, FaMicrophone, RiMenuFill } from './imports.js'
import { useEffect } from 'react';
// import { FaClosedCaptioning } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
const NavBar = ({ searchTerm, setSearchTerm, setVideos }) => {
    const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    function getTimeDescription(publishTime) {
        const currentTime = new Date();
        const publishedAt = new Date(publishTime);

        const timeDifferenceInSeconds = Math.floor((currentTime - publishedAt) / 1000);
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
        const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
        const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);
        const timeDifferenceInMonths = Math.floor(timeDifferenceInDays / 30);
        const timeDifferenceInYears = Math.floor(timeDifferenceInMonths / 12);

        if (timeDifferenceInYears > 0) {
            return `${timeDifferenceInYears} year${timeDifferenceInYears === 1 ? '' : 's'} ago`;
        } else if (timeDifferenceInMonths > 0) {
            return `${timeDifferenceInMonths} month${timeDifferenceInMonths === 1 ? '' : 's'} ago`;
        } else if (timeDifferenceInDays > 0) {
            return `${timeDifferenceInDays} day${timeDifferenceInDays === 1 ? '' : 's'} ago`;
        } else if (timeDifferenceInHours > 0) {
            return `${timeDifferenceInHours} hour${timeDifferenceInHours === 1 ? '' : 's'} ago`;
        } else if (timeDifferenceInMinutes > 0) {
            return `${timeDifferenceInMinutes} minute${timeDifferenceInMinutes === 1 ? '' : 's'} ago`;
        } else {
            return 'just now';
        }
    }
    function getViewCountDescription(viewCount) {
        const viewInBillions = Math.floor(viewCount / 1000000000)
        const viewInMillions = Math.floor((viewCount - (viewInBillions * 1000000000)) / 1000000)
        const viewInThousands = Math.floor((viewCount - ((viewInMillions * 1000000) + (viewInBillions * 1000000000))) / 1000)
        const viewInHundreds = Math.floor((viewCount - ((viewInThousands * 1000) + (viewInMillions * 1000000) + (viewInBillions * 1000000000))))
        if (viewInBillions > 0) {
            return `${viewInBillions}B views`
        } else if (viewInMillions > 0) {
            return `${viewInMillions}M views`
        } else if (viewInThousands > 0) {
            return `${viewInThousands}K views`
        } else if (viewInThousands > 0) {
            return `${viewInHundreds} views`
        } else {
            return `0 views`
        }
    }
    async function getViewCount(apiKey, videoId) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            const viewCount = data.items[0].statistics.viewCount;
            return viewCount;
        } catch (error) {
            console.error('Error occurred during API request:', error);
            throw error;
        }
    }
    async function getChannelThumbnail(apiKey, channelId) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            const channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            return channelThumbnail;
        } catch (error) {
            console.error('Error occurred during API request:', error);
            throw error;
        }
    }
    async function getVideoLength(apiKey, videoId) {
        try {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            const duration = data.items[0].contentDetails.duration;
            console.log(parseDurationToReadable(duration))
            return parseDurationToReadable(duration);
        } catch (error) {
            console.error('Error occurred during API request:', error);
            throw error;
        }
    }
    function parseDurationToReadable(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) {
            return "00:00";
        }
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;

        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }
    // Function to parse ISO 8601 duration format to seconds
    // function parseDuration(duration) {
    //     const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    //     const hours = (parseInt(match[1]) || 0);
    //     const minutes = (parseInt(match[2]) || 0);
    //     const seconds = (parseInt(match[3]) || 0);
    //     return hours * 3600 + minutes * 60 + seconds;
    // }

    const searchVideos = async (searchQuery) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                    searchQuery
                )
                }&type=video&maxResults=${20}&key=${apiKey}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            await Promise.all(data.items.map(async (item) => {
                item.snippet.channelThumbnail = await getChannelThumbnail(apiKey, item.snippet.channelId);
            }));
            await Promise.all(data.items.map(async (item) => {
                item.snippet.viewCount = await getViewCount(apiKey, item.id.videoId);
            }));
            await Promise.all(data.items.map(async (item) => {
                item.snippet.videoLength = await getVideoLength(apiKey, item.id.videoId);
            }));
            data.items.map((item) => {
                item.snippet.viewsDescription = getViewCountDescription(item.snippet.viewCount)
                item.snippet.timeDescription = getTimeDescription(item.snippet.publishTime)
                item.snippet.link = `${item.id.videoId}`
                // console.log(item)
            })
            setVideos(data.items)
        } catch (error) {
            console.error('Error searching for videos:', error);
        }
    };

    useEffect(() => { searchVideos('recent') }, [])
    const [isMobilesearch, setIsMobileSearch] = useState(false)
    return (
        <>
            <div className='flex border-b border-neutral-300 dark:border-neutral-800 justify-between items-center py-3 px-4 bg-neutral-100 w-full select-none dark:bg-black relative'>
                {
                    isMobilesearch && (
                        <div className='absolute  w-full h-full dark:bg-black bg-neutral-200 left-0'>
                            <div className='flex justify-center place-items-center h-full pr-2 pl-2 gap-3' >
                                <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className='outline-none  pl-3 w-full dark:bg-neutral-900 bg-neutral-300 py-3 focus:shadow-inner  dark:text-neutral-400' type="text" placeholder='Search' />
                                <div className='flex items-center'>
                                    < button onClick={() => { searchVideos(searchTerm) }} className=' p-4' >
                                        <IoSearchOutline className='text-neutral-700 dark:text-neutral-300 text-2xl ' />
                                    </button >
                                    <button className='p-4' onClick={() => { setIsMobileSearch(false) }} >
                                        <IoClose className='text-neutral-700 dark:text-neutral-300 text-2xl' />
                                    </button>
                                </div>
                            </div >
                        </div>
                    )
                }
                <div className='flex items-center gap-4 basis-1/4'>
                    <div className='text-neutral-700 text-2xl rounded-full p-2 cursor-pointer dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:text-neutral-200 hover:bg-neutral-300 hover:duration-200 active:text-neutral-700 active:bg-neutral-400 phones:hidden'>
                        <RiMenuFill />
                    </div>
                    <div className='flex min-w-fit px-2 gap-1 items-center place-items-start'>
                        <FaYoutube className='text-green-600  text-4xl' />
                        <p className=' font-extrabold text-2xl font-[codystar] text-neutral-700 dark:text-neutral-100 phones:text-base'>TrilzTube</p>
                    </div>
                </div>
                <div className='flex w-full items-center justify-center gap-2 phones:hidden '>
                    <div className='flex justify-center place-items-center basis-1/2' >
                        <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className=' outline-none border-neutral-300 dark:border-neutral-900  pl-4 w-full  shadow-neutral-200 dark:shadow-black py-2 focus:shadow-neutral-400 text-neutral-700 border rounded-l-full border-r-0 bg-neutral-100 dark:bg-neutral-800 focus:bg-neutral-200 dark:focus:shadow-black dark:focus:bg-neutral-900 dark:placeholder:text-neutral-700 focus:duration-100 w-full`' type="text" placeholder='Search' />
                        < button onClick={() => { searchVideos(searchTerm) }} className=' border-neutral-300 dark:border-neutral-900 cursor-pointer border px-4 py-2 justify-center flex rounded-r-full dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 bg-neutral-200 hover:text-neutral-500 active:text-neutral-700 hover:bg-neutral-300 hover:duration-200 active:bg-neutral-400' >
                            <IoSearchOutline className='text-neutral-700 dark:text-neutral-300 text-2xl ' />
                        </button >
                    </div >
                    <div className='text-neutral-700 text-2xl bg-neutral-200 dark:border-neutral-900 dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 border cursor-pointer border-neutral-300 rounded-full p-2 hover:text-neutral-500 active:text-neutral-700 hover:bg-neutral-300 hover:duration-200 active:bg-neutral-400'>
                        <FaMicrophone />
                    </div>
                </div >
                <div className='text-neutral-700 items-center flex place-content-end gap-4'>
                    <div className='text-neutral-700 text-2xl rounded-full dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:text-neutral-200 p-2 cursor-pointer hover:bg-neutral-300 hover:duration-200 active:bg-neutral-400 active:text-neutral-700'>
                        <AiOutlineBell />
                    </div>
                    <button onClick={() => { setIsMobileSearch(true) }} className='text-neutral-700 text-2xl rounded-full dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:text-neutral-200 p-2 cursor-pointer hidden phones:block hover:bg-neutral-300 hover:duration-200 active:bg-neutral-400 active:text-neutral-700'>
                        <IoSearchOutline />
                    </button>
                    <div className='text-neutral-700 text-2xl rounded-full dark:active:bg-neutral-800 dark:hover:bg-neutral-900 dark:text-neutral-200 p-2 cursor-pointer phones:hidden hover:bg-neutral-300 hover:duration-200 active:text-neutral-700 active:bg-neutral-400'>
                        <RiVideoAddLine />
                    </div>
                    <div className='flex justify-center rounded-full h-10 w-10 cursor-pointer'>
                        <img src={profile} alt="profile" className='h-10 w-10 rounded-full border-green-600 border-2 ' />
                    </div>
                </div>
            </div >
        </>
    )
}
export default NavBar  