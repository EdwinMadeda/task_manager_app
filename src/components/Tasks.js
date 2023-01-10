
import Task from "./Task";

const Tasks = ({tasks, searchText, onDelete, onToggleEdit, onToggleReminder, onToggleViewTask}) => {
 
  const filterSearch = (mytasks)=>{
    const searchItem = (item)=>{
       return item.toLowerCase().includes(searchText.toLowerCase());
    }
    
    return mytasks.map(task => {
       
          const searchResult = searchItem(task.text);
          const subtasks = task.subtasks === undefined? []: 
                          task.subtasks.filter(subtask => searchItem(subtask.text));
          
          return subtasks.length > 0 || searchResult? {...task, subtasks} : {};
          
   }).filter(item => item.id !== undefined);
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
              onToggleViewTask={onToggleViewTask}
              searchText = {searchText}
            />
        ))}
    </> 
  )
}

export default Tasks