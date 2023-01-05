
import Task from "./Task";

const Tasks = ({tasks, searchText, onDelete, onToggleEdit, onToggleReminder}) => {
 
  const filterSearch = (mytasks)=>{
    const searchItem = (item)=>{
       return item.toLowerCase().includes(searchText.toLowerCase());
    }
    
    return mytasks.filter(task => {
       
          const searchResult = searchItem(task.text);
          const subtasks = task.subtasks === undefined? []: 
                          task.subtasks.filter(subtask => searchItem(subtask.text));
              
          if(subtasks.length > 0 || searchResult) return {...task, subtasks};
   });
 }
  
  return (
    <>
        {filterSearch(tasks).map(task => (
            <Task 
              key={task.id} 
              task={task} 
              onDelete={onDelete}
              onToggleEdit={onToggleEdit}
              onToggleReminder={onToggleReminder}
              searchText = {searchText}
            />
        ))}
    </> 
  )
}

export default Tasks