import Task from "./Task";

const Tasks = ({tasks, onDelete, onToggleEdit, onToggleReminder}) => {
  
  return (
    <>
        {tasks.map(task => (
            <Task 
              key={task.id} 
              task={task} 
              onDelete={onDelete}
              onToggleEdit={onToggleEdit}
              onToggleReminder={onToggleReminder}
            />
        ))}
    </> 
  )
}

export default Tasks