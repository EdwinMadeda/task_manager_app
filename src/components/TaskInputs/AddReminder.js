import React from 'react'

const AddReminder = ({value, onChange, insertError = false}) => {
  return (
    <div className=' form-control-check'>
        <label htmlFor="add_reminder">
          <span>Set Reminder</span>
          {insertError && <p className='errorMsg'>{insertError}</p>}
        </label>
        <input type="checkbox" checked={value} value={value} id="add_reminder" 
            onChange={e => onChange(e.currentTarget.checked)}/>
    </div>
  )
}

export default AddReminder