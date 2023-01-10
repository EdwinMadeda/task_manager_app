import React, { useEffect, useState } from 'react'

const AddDuration = ({valueHrs, valueMin, onChangeHrs, onChangeMin, insertError=false, disabled = false}) => {
  const [hrsWord, setHrsWord] = useState('hrs');
  
  useEffect(()=>{
      setHrsWord(`hr${Number(valueHrs) !== 1?'s':''}`);
  },[valueHrs])

  return (
    <div className='form-control'>
        <label>
          <span>Duration</span>
          {insertError && <p className='errorMsg'>{insertError}</p>}
        </label>
        <div className="addDuration">
        <span>
          <input 
            type="number" 
            min="0" 
            max="24" 
            value={valueHrs} 
            onChange={e => {onChangeHrs(e.target.value)}}
            disabled={disabled}/>{hrsWord}</span>
        <span>
            <input 
              type="number" 
              min="0" 
              max="59" 
              value={valueMin} 
              onChange={e => {onChangeMin(e.target.value)}}
              disabled={disabled}/>min</span>
        </div>
    </div>
  )
}

export default AddDuration