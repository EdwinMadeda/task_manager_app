import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { BsArrow90DegRight, BsFillBackspaceFill } from "react-icons/bs";
// import { format } from "date-fns";

const AddTask = ({editTargetTask = null, onAdd, onEdit, toggleAddSubTask, toggleAddDependency}) => {
    
    const [level, setLevel] = useState(0);
    const [parentTask, setParentTask] = useState({});
    const [childTasks, setChildTasks] = useState([]);

    const [textError, setTextError] = useState(null);

    const [text, setText] = useState('');
    const [day, setDay] = useState(new Date());
    const [reminder, setReminder] = useState(false);
    const [durationHrs, setDurationHrs] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [priority, setPriority] = useState(undefined);

    const priority_levels = [
      "Urgent and important",
      "Important, but not urgent",
      "Urgent, but not important",
      "Neither urgent nor important",
    ];

    const clearForm = ()=>{
      setText('');
      setDay(new Date());
      setReminder(false);
      setDurationHrs(0);
      setDurationMin(0);
      setPriority(null);

    }

    useEffect(()=>{

      const obj = {text, day, reminder, durationHrs, durationMin, priority};
      setParentTask(obj);
      clearForm();

    },[level])

    useEffect(()=>{
      clearForm();
      if(editTargetTask){
        const obj = editTargetTask;

         setText(obj.text || '');
         setDay(obj.day || new Date());
         setReminder(obj.reminder || false);
         setDurationHrs(obj.durationHrs || 0);
         setDurationMin(obj.durationMin || 0);
         setPriority(obj.priority || null);
      }
     
    },[editTargetTask]);

    const submit = (e)=>{
        e.preventDefault();

        let obj = {text, day, reminder, durationHrs, durationMin, priority};
        if(level > 0) {
          const id = childTasks.length + 1;
          obj.id = id;
          obj = {...parentTask, subtasks : obj};
          setChildTasks([...childTasks, obj]);
        }
        else{
          setChildTasks([]);
          setParentTask({});
        }

        editTargetTask? onEdit({id: editTargetTask.id, ...obj}) : onAdd(obj);
        clearForm();
    }

    // const date0 = '2022-12-07T03:45';
    // const date1 = format(new Date(date0), 'MMM dd, yyyy p');
    // const date2 = format(new Date(date1), 'yyyy-MM-dd\'T\'HH:mm');

    const AddTaskExtras = ({isSubTask = false})=>{
      return (
        <>
        <div className="add_task_extras">
          <i className='add_subtaskBtn' onClick={() => {
              {text && 
                setLevel(level+1);
                toggleAddSubTask();
              }
              {!text && 
                setTextError('field must not be empty');
              }
          }}>
            <FaPlusCircle className="add_subtaskIcon"/>
            <span>{`${isSubTask? 'Add another sub task': 'Add sub task'}`}</span>
          </i>
          {!isSubTask && 
              <i className='add_subdependancyBtn' onClick={toggleAddDependency}>
                <BsArrow90DegRight className="set_dependancy" />
                <span>Set Dependency</span>
              </i>
          }
         
        </div>
      </>
      );
    }

  return (
    <form className={`add-form level${level}`} onSubmit={submit}>
        {level > 0 && <BsFillBackspaceFill 
                        className="subTask_backBtn" 
                        title="Back to main task"
      
                      />}
        <div className='form-control'>
            <label htmlFor="add_task">
              {level === 0 && 'Task'}
              {level > 0 && `Sub Task ${childTasks.length + 1} (Task : ${parentTask.text})`}
              {textError && <span className="errorMsg">{`(${textError})`}</span>}
            </label>
            <input type="text" id="add_task" placeholder='Add Task' value={text} 
                   onChange={e => {
                    setText(e.target.value);
                    setTextError(null);
                   }}/>

            {level === 0 && <AddTaskExtras/>}
           
        </div>
        <div className='form-control'>
            <label htmlFor="add_day&time">Day & time</label>
            <input type="datetime-local" id="add_day&time" placeholder='Add Day & Time' value={day} 
                   onChange={e => { setDay(e.target.value)}}/>
            
        </div>
        <div className='form-control'>
            <label>Duration</label>
            <div className="addDuration">
              <span><input type="number" min="0" max="24" value={durationHrs} onChange={e => {setDurationHrs(e.target.value)}}/>hrs</span>
              <span><input type="number" min="0" max="59" value={durationMin} onChange={e => {setDurationMin(e.target.value)}}/>min</span>
            </div>
        </div>
        <div className='form-control'>
            <p>Set Flag</p>
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
                        onChange={e => {setPriority(e.target.value)}}/>
                      <label htmlFor={`priority${key}`}>{level}</label>
                    </span>
                 )
              }
              
              )}
            </div>
            
        </div>
        <div className=' form-control-check'>
            <label htmlFor="add_reminder">Set Reminder</label>
            <input type="checkbox" checked={reminder} value={reminder} id="add_reminder" 
                   onChange={e => setReminder(e.currentTarget.checked)}/>
        </div>
        <input className="btn btn-block" type="submit" value={editTargetTask? "Edit Task": "Save Task"} />

        {level > 0 && <AddTaskExtras isSubTask={true}/>}
    </form>
  )
}

export default AddTask