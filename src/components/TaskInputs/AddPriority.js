import React from 'react'

const AddPriority = ({priority_levels, priority, onChange, insertError=false, disabled = false}) => {

  if(disabled)
  priority_levels = priority_levels.filter((level, key) => {
     return key === Number(priority) && level 
  });

  return (
    <div className='form-control'>
        <p>
          <span>
            Priority
            {priority_levels.length === 0 && '  unspecified!'}
          </span>
          {insertError && <p className='errorMsg'>{insertError}</p>}
        </p>
        <div>
            {priority_levels.map((level, key) => {
                return (
                    <span className="radio__container" key={`span${key+1}`}>
                      <input 
                          defaultChecked={key === Number(priority)}
                          type="radio" 
                          id={`priority${key+1}`} 
                          name="priority" 
                          value={key} 
                          onChange={e => {onChange(e.target.value)}}
                          disabled={disabled}/>
                      <label htmlFor={`priority${key+1}`}>{level}</label>
                    </span>
                )
              })
            }
        </div>  
    </div>
  )
}

export default AddPriority