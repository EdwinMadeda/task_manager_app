import React from 'react'

const AddDayTime = ({value, onChange, insertError = false, disabled = false}) => {
 
  return (
    <div className='form-control'>
      <label htmlFor="add_day&time">
         <span>Day & time</span>
         {insertError && <p className='errorMsg'>{insertError}</p>}
      </label>
      
      <input type="datetime-local" id="add_day&time" placeholder='Add Day & Time' value={value} 
            onChange={e => {onChange(e.target.value)}} disabled={disabled}/>

    </div>
  )
}

export default AddDayTime