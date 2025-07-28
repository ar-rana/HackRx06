import React from 'react'

const MessageComponent = (props) => {
  return (
    <div className={`${props.user ? 'ml-auto' : 'mr-auto'} p-2.5 bg-gray-500 m-3 max-w-[55%] rounded-md`}>
        <p className='text-white font-semibold w-full'>{props.text}</p>
    </div>
  )
}

export default MessageComponent
