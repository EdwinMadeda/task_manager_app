import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { format } from "date-fns";

const Task = ({
  task, 
  onDelete, 
  onToggleEdit, 
  onToggleReminder, 
  onToggleViewTask, 
  searchText = ''}) => {

   const day_task = format(new Date(task.day), 'do MMM, yyyy - p');
   const targetToggleReminder = (e)=>{
      const editBtn = document.getElementsByClassName('editBtn')[0];
      !editBtn.contains(e.target) && onToggleReminder(task.id);
   }
  //  const duration = (
  //       task.durationHrs !==0 && task.durationMin !==0? (
  //         `${task.durationHrs} hr ${task.durationMin} min`
  //       ) : (
  //         task.durationHrs !==0 && task.durationMin ===0? `${task.durationHrs} hr` : (
  //           task.durationHrs ===0 && task.durationMin !==0? `${task.durationMin} min` : ''
  //         )
  //       )
  //   );

    const searchSubTasks = (task.subtasks || []).filter(subtask => {
      const isSearchItem = (item)=>{
         return searchText === ''? false: item.toLowerCase().includes(searchText.toLowerCase());
      }
      return isSearchItem(subtask.text)
  
    });

   const subTasks = (searchSubTasks.length > 0)? searchSubTasks : task.subtasks || [];
   const subTasksCount = Object.keys(subTasks).length;
   const [visible, setVisible] = useState(false);

  //  const onToggleView = ()=>{
  //     const taskId = parentTaskID? parentTaskID: task.id;
  //     onToggleEdit(taskId);
  //     setIsViewTask(true);
  //  }

   useEffect(()=>{
      setVisible(searchSubTasks.length > 0);
   },[searchSubTasks.length])


  return (
    <div className={`task ${task.reminder? 'reminder': ''}`}>
        
        <FaEdit className='editBtn' onClick={()=>{onToggleEdit(task.id)}} title='edit task'/>
        <div>
             <div className='text-label'> 
                <h3 onDoubleClick={targetToggleReminder}>{task.text}</h3>
                <button className='moreBtn'
                   onClick={()=> onToggleViewTask(task.id)}>...more</button>
             </div>
             <p className='dayTimeText'>{`Day & Time: ${day_task}`}</p>
          
            {subTasksCount > 0 && 
              <p>
                  <i className="drop_down" onClick={()=> setVisible(!visible)}>
                    <span>
                      {`${subTasksCount} ${searchSubTasks.length > 0? 'matching':''} subtask${subTasksCount === 1?'':'s'}`}
                    </span>
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
                    onToggleViewTask = {()=>onToggleViewTask({taskId: task.id, subTaskId: subtask.id})}
                    />
                ))}
              </>}

        </div>
        <FaTrash onClick={()=>onDelete(task.id)}/>
    </div>
  )
}
export default Task