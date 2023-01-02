import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import {useState} from 'react';
import apiRequest from './apiRequest';
import SearchTask from './components/SearchTask';


// const tasks = [
//   {
//     id: 1,
//     text: 'Doctors Appointment',
//     day: 'Feb 5th at 2:30pm',
//     reminder: true,
// },
// {
//     id: 2,
//     text: 'Meeting at School',
//     day: 'Feb 6th at 1:30pm',
//     reminder: true,
// },
// {
//     id: 3,
//     text: 'Food Shopping',
//     day: 'Feb 5th at 2:30pm',
//     reminder: false
// }
// ]

function App() {

  const [addTaskForm, setAddTaskForm] = useState(false);
  const [openAddTaskFormID, setOpenAddTaskFormID] = useState(undefined); 
 
  const [tasks, setTasks] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [editTargetTask, setEditTargetTask] = useState(null);
  const [editTargetSubTask, setEditTargetSubTask] = useState(null);

  const URL = 'http://localhost:3500/tasks';

  const effectRan = useRef(false);

  useEffect(()=>{

    const sortTasks = tasks.sort(function(a, b) {
      var c = new Date(a.day);
      var d = new Date(b.day);
      return c-d;
    });

    setTasks(sortTasks);

  },[tasks])

  useEffect(()=>{

    if(effectRan.current === false) {

        const fetchTasks = async ()=>{

          const {errMsg, result, loading} = await apiRequest(URL);
          !errMsg && setTasks(result)
            setFetchError(errMsg);
            setIsLoading(loading);
            
        }
    
        setTimeout(()=>{
          (async ()=> await fetchTasks())();
        }, 5);

        return () => {
          effectRan.current = true;
        }
    }

  },[]);

  useEffect(()=>{
    if(!addTaskForm){
      setEditTargetTask(null);
      setEditTargetSubTask(null);
    }
  }, [addTaskForm])

  //console.log(tasks.sort((a,b)=>a.getTime()-b.getTime()))

  const addTask = async (task) =>{

    const newTask = {id: tasks.length + 1, ...task}
    setTasks([...tasks, newTask]);
    setFetchError(await apiRequest(URL,{
      method : 'POST',
      body: JSON.stringify(newTask)
    }).errMsg);

     setAddTaskForm(false);
  }

  const editTask = async (edited_task) =>{

    const reqUrl = `${URL}/${edited_task.id}`;
     const filteredTasks = tasks.filter(task => task.id !== edited_task.id);
     const newTasks = [...filteredTasks, edited_task];
     setTasks(newTasks);

     
     setFetchError(await apiRequest(reqUrl,{
      method : 'PUT',
      body: JSON.stringify(edited_task)
    }).errMsg);

    setAddTaskForm(false);
    setEditTargetTask(null);
    setEditTargetSubTask(null);

    setAddTaskForm(false);
  }

  const deleteTask = async (id) =>{

    if(typeof(id) === 'object'){
      const {taskId, subTaskId} = id;
      const reqUrl = `${URL}/${taskId}`;

      const targetTask = tasks.filter(task => task.id === taskId)[0];
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      const filteredSubTasks = targetTask.subtasks.filter(subtask => subtask.id !== subTaskId);

      delete targetTask.subtasks;
      const edited_task = {...targetTask, subtasks: filteredSubTasks};
      setTasks([...filteredTasks, edited_task]);

      setFetchError(await apiRequest(reqUrl,{
        method : 'PUT',
        body: JSON.stringify(edited_task)
      }).errMsg);

      return;
    }

    const reqUrl = `${URL}/${id}`;

    setTasks(tasks.filter(task => task.id !== id));

    setFetchError(await apiRequest(reqUrl,{
      method: 'DELETE'
    }).errMsg);

  }

  const toggleEdit = async (id) => {

    if(typeof(id) === 'object'){
      const {taskId, subTaskId} = id;
      const targetTask = tasks.filter(task => taskId === task.id)[0];
      const targetSubTask = targetTask.subtasks.filter(subTask => subTaskId === subTask.id)[0];
            setEditTargetSubTask(targetSubTask);
            id = taskId;

    }
    
    const targetTask = tasks.filter(task => id === task.id)[0];
    setEditTargetTask(targetTask);    
    setOpenAddTaskFormID(openAddTaskFormID === id? undefined : id);
    setAddTaskForm(openAddTaskFormID === id? !addTaskForm : true);
  }

  const toggleReminder = async (id) =>{
    if(typeof(id) === 'object'){
      
      const {taskId, subTaskId} = id;
      const reqUrl = `${URL}/${taskId}`;

      const targetTask = tasks.filter(task => task.id === taskId)[0];
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      const editedSubTasks = targetTask.subtasks.map(subTask => (
        subTask.id === subTaskId? {...subTask, reminder: !subTask.reminder} : subTask
      ));
      
      const edited_task = {...targetTask, subtasks: editedSubTasks};
      setTasks([...filteredTasks, edited_task]);

      setFetchError(await apiRequest(reqUrl,{
        method : 'PUT',
        body: JSON.stringify(edited_task)
      }).errMsg);
      
      return;
    }

    setTasks(tasks.map(task => (
      task.id === id? {...task, reminder: !task.reminder } : task
    )));

    const reqUrl = `${URL}/${id}`;
    const myTask = tasks.filter(task => id === task.id)[0];
  
    setFetchError(await apiRequest(reqUrl, {
      method: 'PATCH',
      body: JSON.stringify({reminder: !myTask.reminder})
    }).errMsg);

  }

  const styleEffectRun = {display: !effectRan.current? '': 'none'}

  const toggleAddBtnClick = ()=>{
    setIsSearch(false)
    setAddTaskForm(!addTaskForm);
    !addTaskForm && setEditTargetTask(null);
  }


  return (

    <div className="container">

     <Header addBtnClick={toggleAddBtnClick} showAdd={!addTaskForm} isSearch={isSearch} setIsSearch = {()=>{
              setAddTaskForm(false);
              setIsSearch(!isSearch)}}/>
     {addTaskForm && <AddTask 
                              allTasks={editTargetTask? tasks.filter(task => editTargetTask.id !== task.id): tasks}
                              editTargetTask = {editTargetTask}
                              editTargetSubTask = {editTargetSubTask}
                              setEditTargetSubTask = {setEditTargetSubTask}
                              onAdd={addTask} 
                              onEdit={editTask}
                              />}

      {isSearch && <SearchTask  
                              searchText={searchText}
                              setSearch={setSearchText} />}
     
     {fetchError && fetchError}
     {!addTaskForm && 
        <>
        {tasks.length > 0? (
            <Tasks 
                tasks={tasks.filter(task => task.text.toLowerCase().includes(searchText.toLowerCase()))} 
                onDelete={deleteTask} 
                onToggleEdit = {toggleEdit}
                onToggleReminder={toggleReminder} />
          ) : (
            
            <p style={styleEffectRun}>{isLoading ? `Loading....` : (
                fetchError? fetchError : 'No tasks to show'
              )}
            </p>

          )}
        </>
     }
    
    </div>

  );  
}

// class App extends React.Component{
//   render(){
//     return <h1>Hello from a class</h1>
//   }
// }

export default App;
