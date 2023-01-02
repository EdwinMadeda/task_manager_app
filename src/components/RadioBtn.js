import React from 'react'

const RadioBtn = ({checked =false}) => {
  return (
    <>
     <input 
        type="radio" 
        id={`priority${key}`} 
        name="priority" 
        value={key} 
        onChange={e => {setPriority(e.target.value)}}/>
    </>
   
  )
}

export default RadioBtn