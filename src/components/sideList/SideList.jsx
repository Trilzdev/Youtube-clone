import React from 'react'
import { IconContext } from 'react-icons'

const SideList = (props) => {
    return (
        <div className=' flex flex-row border-t justify-evenly'>
            <IconContext.Provider value={{ className: "text-2xl text-neutral-700" }}>
                {props.list.map((item) => (
                    <>
                        <div className='flex flex-col items-center w-8'>
                            {item.icon && React.createElement(item.icon)}
                            <a href="/#" key={item.id} className='text-neutral-700 text-sm'>{item.name}</a >
                        </div>
                    </>
                ))}
            </IconContext.Provider>
        </div>
    )
}

export default SideList