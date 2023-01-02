import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { format } from "date-fns";

const Task = ({task, onDelete, onToggleEdit, onToggleReminder, isSubtask = ''}) => {

   const day_task = format(new Date(task.day), 'MMM dd, yyyy p');
   const targetToggleReminder = (e)=>{
      const editBtn = document.getElementsByClassName('editBtn')[0];
      !editBtn.contains(e.target) && onToggleReminder(task.id);
   }
   const duration = (
        task.durationHrs !==0 && task.durationMin !==0? (
          `${task.durationHrs} hr ${task.durationMin} min`
        ) : (
          task.durationHrs !==0 && task.durationMin ===0? `${task.durationHrs} hr` : (
            task.durationHrs ===0 && task.durationMin !==0? `${task.durationMin} min` : ''
          )
        )
    );

   const subTasks = task.subtasks || [];
   const subTasksCount = Object.keys(subTasks).length;
   const [visible, setVisible] = useState(false);

  return (
    <div className={`task ${task.reminder? 'reminder': ''}`}>
        <h3 onDoubleClick={targetToggleReminder}> 
          <span> 
            <i className='editBtn'>
              <FaEdit 
                onClick={()=>{onToggleEdit(task.id)}} 
                title='edit task'/></i> 
                {task.text} 
                {duration !== '' && ` (${duration})`}
           </span> 
          <FaTrash onClick={()=>onDelete(task.id)}/>
        </h3>
        <p>{`Day & Time: ${day_task}`}</p>

          {subTasksCount > 0 && 
            <p>
                <i className="drop_down" onClick={()=> setVisible(!visible)}>
                  <span>{subTasksCount} {`Subtask${subTasksCount === 1?'':'s'}`}</span>
                  {visible? <BsChevronCompactUp/> : <BsChevronCompactDown/>}
                </i>
            </p>
          }
        
          {visible && 
            <>
             {subTasks.map(subtask => (
                  <Task 
                  key={subtask.id} 
                  task={subtask} 
                  onDelete={()=>onDelete({taskId: task.id, subTaskId: subtask.id})}
                  onToggleEdit={()=>onToggleEdit({taskId: task.id, subTaskId: subtask.id})}
                  onToggleReminder={()=>onToggleReminder({taskId: task.id, subTaskId: subtask.id})}

                  isSubtask = {'subTask'}
                  />
              ))}
            </>}

    </div>
  )
}
export default Task