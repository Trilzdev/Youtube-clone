import React from 'react'
import MovieCard from '../../components/movieCard/movieCard'
const MainContent = ({ videos }) => {
  return (
    <div className="flex overflow-y-scroll content-start justify-center phones:py-0 py-8 phones:px-0 px-2 items-start w-full h-full flex-wrap gap-x-4 gap-y-8 phones:gap-0 shadow-inner dark:shadow-none shadow-neutral-300 dark:bg-black bg-neutral-200 ">
      {
        videos.map((item) => (
          <MovieCard video={item} />
        ))
      }
    </div>
  )
}

export default MainContent