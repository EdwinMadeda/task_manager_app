import React from 'react'

const AddPriority = ({priority_levels, priority, onChange, insertError=false}) => {
  return (
    <div className='form-control'>
        <p>
          <span>Set Flag</span>
          {insertError && <p className='errorMsg'>{insertError}</p>}
        </p>
        <div>
            {priority_levels.map((level, key) => {
            
                return (
                    <span className="radio__container" key={`span${key}`}>
                    <input 
                        defaultChecked={key === Number(priority)}
                        type="radio" 
                        id={`priority${key}`} 
                        name="priority" 
                        value={key} 
                        onChange={e => {onChange(e.target.value)}}/>
                    <label htmlFor={`priority${key}`}>{level}</label>
                    </span>
                )
            }
            )}
        </div>  
    </div>
  )
}

export default AddPriority