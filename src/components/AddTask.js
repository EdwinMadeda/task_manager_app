import { useEffect, useState } from "react";
import { BsFillBackspaceFill } from "react-icons/bs";

import AddTaskText from "./TaskInputs/AddTaskText";
import AddDayTime from "./TaskInputs/AddDayTime";
import AddDuration from "./TaskInputs/AddDuration";
import AddPriority from "./TaskInputs/AddPriority";
import AddReminder from "./TaskInputs/AddReminder";
import AddSubmitBtn from "./TaskInputs/AddSubmitBtn";

import AddTaskExtrasItems from "./AddTaskExtrasItems";
import AddTaskExtrasBtns from "./AddTaskExtrasBtns";

import AddSubTask from "./AddSubTask";

const AddTask = ({allTasks, editTargetTask = null, editTargetSubTask = null,setEditTargetSubTask, onAdd, onEdit}) => {

    const [text, setText] = useState('');
    const [day, setDay] = useState(new Date());
    const [reminder, setReminder] = useState(false);
    const [durationHrs, setDurationHrs] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [priority, setPriority] = useState(undefined);

    const [textError, setTextError] = useState(false);

    const [task, setTask] = useState({});
    const [subTasks, setSubTasks] = useState([]);
    const [isSubTask,setIsSubTask] = useState(false);
    const [targetSubTask, setTargetSubtask] = useState(editTargetSubTask? editTargetSubTask: {});
    const [subTaskSubmit, setSubTaskSubmit] = useState(false);

    const [dependencies, setDependencies] = useState([]); 
    const [possibleDependencies, setPossibleDependencies] = useState(allTasks);
    const [isDependency, setIsDependency] = useState(false);
    const [dependencyIDs, setDependencyIDs] = useState([]);

    const priority_levels = [
      "Urgent and important",
      "Important, but not urgent",
      "Urgent, but not important",
      "Neither urgent nor important"
    ];

    const clearForm = ()=>{
      setText('');
      setDay(new Date());
      setReminder(false);
      setDurationHrs(0);
      setDurationMin(0);
      setPriority(undefined);

    }

    useEffect(()=>{

      const id = editTargetTask? editTargetTask.id : allTasks.length + 1;
      setTextError(false);
      setTask({id, text, day, reminder, durationHrs, durationMin, priority, subtasks : subTasks, dependencies: dependencyIDs});
      setDependencies(allTasks.filter(task => dependencyIDs.includes(task.id)));
      setPossibleDependencies(allTasks.filter(task => !dependencyIDs.includes(task.id)))

    },[text, day, reminder, durationHrs, durationMin, priority, dependencyIDs])
   
    useEffect(()=>{
 
      if(editTargetTask){
        const obj = editTargetTask;
        clearForm();

        setText(obj.text || '');
        setDay(obj.day || new Date());
        setReminder(obj.reminder || false);
        setDurationHrs(obj.durationHrs || 0);
        setDurationMin(obj.durationMin || 0);
        setPriority(obj.priority || undefined);

        setTask(editTargetTask);
        setSubTasks(editTargetTask.subtasks);
        ResetDependencies(editTargetTask.dependencies || []);

        editTargetSubTask && AddSubTaskBtnClick();
        
      }
    
    },[editTargetTask]);

    useEffect(()=>{

      if(subTasks.length > 0 && subTaskSubmit){
        setTask({...task, subtasks: subTasks})
        backTaskBtnClick();
        setSubTaskSubmit(false);
      }

    }, [subTasks, subTaskSubmit])
    
    const submit = (e)=>{
        e.preventDefault();
        editTargetTask? onEdit(task) : onAdd(task);
        clearForm();
    }

    const AddSubTaskBtnClick = (targetSubTask = editTargetSubTask)=>{
     
      if(text !== '' || (editTargetTask && targetSubTask)){ 
        setTargetSubtask(targetSubTask);
        setIsSubTask(true);
        return;
      }
      setTextError('Field cannot be empty')
    }

    const backTaskBtnClick =()=>{
       setIsSubTask(false);
    }

    const ResetDependencies = (IDs) =>{
      const myIDs = IDs.filter(ID => typeof(ID) === 'number');

      setDependencyIDs(myIDs);
      setDependencies(allTasks.filter(task => dependencyIDs.includes(task.id)));
      setPossibleDependencies(allTasks.filter(task => !dependencyIDs.includes(task.id)))
    }

    const AddDependencyBtnClick = (dependencyItem) =>{
      ResetDependencies([...dependencyIDs, dependencyItem.id]);
    }

    const onResetDependencies = (IDs) =>{
      console.log(IDs);
      //ResetDependencies(IDs);
    }

    

  return (
    <>
      <form className={`add-form Task`} onSubmit={submit}>
          
            <AddTaskText 
              label={`Task`} 
              value={text} 
              onChange={setText} 
              insertError={textError}/>

            <AddTaskExtrasItems 
                  label = {'Added SubTasks:'}
                  items = {subTasks}
                  onClickItem = {AddSubTaskBtnClick}
                  onShiftItems = {setSubTasks}
                  onRemoveItem = {setSubTasks}
                  initialTargetID = {editTargetSubTask !== null? editTargetSubTask.id: false}
                  markTarget = {isSubTask} />

            {isSubTask? (<BsFillBackspaceFill 
              className="subTask_backBtn"
              onClick={backTaskBtnClick}/>) :
              (<>

                <AddTaskExtrasItems 
                  label = {'Added dependencies:'}
                  items = {dependencies}
                  shiftIDs = {true}
                  onShiftItems = {onResetDependencies}
                  onRemoveItem = {onResetDependencies}
                />

                <AddTaskExtrasBtns 
                    setIsSubTask = {AddSubTaskBtnClick} 
                    setIsDependency={()=>setIsDependency(!isDependency)} 
                    showDependencyBtn={true}/>

                {isDependency &&
                  <AddTaskExtrasItems 
                      label = {'Possible dependencies:'}
                      items = {possibleDependencies}
                      onClickItem = {AddDependencyBtnClick}
                  />
                }

                <AddDayTime value={text} onChange={setDay}/>
                <AddDuration valueHrs={durationHrs} valueMin={durationMin} 
                              onChangeHrs={setDurationHrs} onChangeMin={setDurationMin}/>
                <AddPriority priority_levels={priority_levels} priority={priority} onChange={setPriority}/>
                <AddReminder value={reminder} onChange={setReminder}/>
                <AddSubmitBtn value={"Save Task"}/>
              </>)
            }
      </form>

      {isSubTask && 
        <>
        <AddSubTask 
            priority_levels={priority_levels} 
            subTasks = {subTasks}
            setSubTasks = {setSubTasks}
            editTargetSubTask={targetSubTask} 
            subTaskSubmit = {subTaskSubmit}
            setSubTaskSubmit = {setSubTaskSubmit}/>
        </>
      }
    </>
  )
}

export default AddTask