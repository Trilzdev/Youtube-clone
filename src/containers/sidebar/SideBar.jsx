import React from 'react'
import {
    LiaLaughSquintSolid, PiTelevisionSimpleLight, MdOutlineAppShortcut, IoSettingsOutline, MdOutlineSubscriptions, AiOutlineHeart, LiaGhostSolid, AiOutlineAim, AiOutlineHome, GiMaterialsScience
} from './imports'
const DynamicIcons = ({ iconComponent }) => {
    const IconComponent = iconComponent
    return <IconComponent className="text-2xl text-neutral-700 dark:text-neutral-400" />
}
const SideBar = ({ setVideos, setSearchTerm }) => {
    const apiKey = 'AIzaSyC3IZ_L2P9Z6c80o-yNU3vyI_lJQyXm9Tk';
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
            return `${viewInThousands} views`
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


    const searchVideos = async (searchQuery) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                    searchQuery
                )
                }&type=video&maxResults=${10}&key=${apiKey}`
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
            })
            setVideos(data.items)
            setSearchTerm('')
        } catch (error) {
            console.error('Error searching for videos:', error);
        }
    };
    const sideLinksList = [ // Renamed the variable to sideLinksList
        { id: 1, name: "Action", icon: AiOutlineAim, search: 'action movies' },
        { id: 2, name: "Comedy", icon: LiaLaughSquintSolid, search: 'Comedy skits' },
        { id: 3, name: "Drama", icon: AiOutlineHeart, search: ' youtube Drama' },
        { id: 4, name: "Science Fiction", icon: GiMaterialsScience, search: 'Science fiction movies' },
        { id: 5, name: "Horror", icon: LiaGhostSolid, search: 'horror shorts ' },
        { id: 6, name: "Channel", icon: PiTelevisionSimpleLight, search: 'best youtube chanels' },
        { id: 7, name: "Settings", icon: IoSettingsOutline, search: 'settings for' }
    ];
    return (
        <>
            <div className='bg-neutral-100 dark:bg-black border-r dark:border-black border-neutral-300  overflow-y-scroll px-2 min-w-fit phones:hidden basis-1/4'>
                <div className=' flex flex-col border-b dark:border-neutral-800 py-2'>
                    <div className='flex py-3 items-center justify-start px-8 gap-2 cursor-pointer rounded-2xl hover:bg-neutral-300 hover:duration-200 active:text-neutral-700 dark:hover:bg-neutral-900  dark:active:bg-neutral-800 dark:active:text-neutral-400 active:bg-neutral-400'>
                        <AiOutlineHome className="text-2xl text-neutral-700 dark:text-neutral-400" />
                        <a href="/#" className='text-neutral-700 dark:text-neutral-400'>Home</a >
                    </div>
                    <div className='flex py-3 items-center justify-start px-8 gap-2 cursor-pointer rounded-2xl hover:bg-neutral-300 hover:duration-200 active:text-neutral-700 dark:hover:bg-neutral-900  dark:active:bg-neutral-800 dark:active:text-neutral-400 active:bg-neutral-400'>
                        <MdOutlineSubscriptions className="text-2xl text-neutral-700 dark:text-neutral-400" />
                        <a href="/#" className='text-neutral-700 dark:text-neutral-400'>Subscriptions</a >
                    </div>
                    <div className='flex py-3 items-center justify-start px-8 gap-2 cursor-pointer rounded-2xl hover:bg-neutral-300 hover:duration-200 active:text-neutral-700 dark:hover:bg-neutral-900  dark:active:bg-neutral-800 dark:active:text-neutral-400 active:bg-neutral-400'>
                        <MdOutlineAppShortcut className="text-2xl text-neutral-700 dark:text-neutral-400" />
                        <a href="/#" className='text-neutral-700 dark:text-neutral-400'>Shorts</a >
                    </div>
                </div>
                <div className=' flex flex-col border-b dark:border-neutral-800 py-2'>
                    {sideLinksList.map((item) => (
                        <div onClick={() => { searchVideos(item.name) }} className='flex py-3 items-center justify-start px-8 gap-2 cursor-pointer rounded-2xl hover:bg-neutral-300 hover:duration-200 active:text-neutral-700 dark:hover:bg-neutral-900  dark:active:bg-neutral-800 dark:active:text-neutral-400 active:bg-neutral-400'>
                            <DynamicIcons iconComponent={item.icon} />
                            <a href="/#" className='text-neutral-700 dark:text-neutral-400'>{item.name}</a >
                        </div>))}
                </div>
                <div className='flex flex-wrap w-44 gap-x-2 my-2 text-neutral-500 px-2'>
                    <p className=' cursor-pointer hover:text-neutral-600'>About</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Press</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Copyright</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Contact us</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Creator</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Advertise</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Developers</p>
                </div>
                <div className='flex flex-wrap w-44 gap-x-2 my-2 text-neutral-500 px-2'>
                    <p className=' cursor-pointer hover:text-neutral-600'>Terms</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Privacy</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Policy & Safety</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>How TrilzTube works</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Test new features</p>
                    <p className=' cursor-pointer hover:text-neutral-600'>Created with React and Tailwind using Youtube API</p>
                </div>
            </div >
        </>
    )
}

export default SideBar