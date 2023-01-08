import { useEffect, useState} from "react";

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

    const [isPreceedingTasks, setIsPreceedingTasks] = useState(false);
    const [preceedingTaskIDs, setPreceedingTaskIDs] = useState([]);
    const [preceedingTasks, setPreceedingTasks] = useState({current: [], possible: []});
    const [succeedingTasks, setSucceedingTasks] = useState([]);

    const filterCurrentPreceedingTasks = (IDs) => allTasks.filter(task => IDs.includes(task.id));
    const filterPossiblePreceedingTasks = (IDs) => allTasks.filter(task => !IDs.includes(task.id));
    const filterSucceedingTasks = ()=>{
       if(!editTargetTask) return [];
            return allTasks.filter(task => {
            return task.preceedingtasks === undefined? false : 
                  task.preceedingtasks.includes(editTargetTask.id);
            });
      };

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

      const refreshVals = ()=>{
        const id = editTargetTask? editTargetTask.id : allTasks.length + 1;
        setTextError(false);
        setTask({id, text, day, reminder, durationHrs, durationMin, priority, subtasks : subTasks});

      }
      refreshVals();

    },[text, day, reminder, durationHrs, durationMin, priority, subTasks]);

    useEffect(()=> {

      const refreshVals = ()=>{
        setTask({...task, preceedingtasks: preceedingTaskIDs});
      
        setPreceedingTasks({
          current : filterCurrentPreceedingTasks(preceedingTaskIDs),
          possible : filterPossiblePreceedingTasks(preceedingTaskIDs),
        });

      }
      refreshVals();
     
    }, [preceedingTaskIDs]);
   
    useEffect(()=>{
      const refreshVals = ()=>{
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
          setPreceedingTaskIDs(editTargetTask.preceedingtasks || []);
          setSucceedingTasks(filterSucceedingTasks());
  
          editTargetSubTask && AddSubTaskBtnClick();
        }
      }
      refreshVals();
    
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

    const AddPreceedingTaskBtnClick = (preceedingItem) =>{
      setPreceedingTaskIDs([...preceedingTaskIDs, preceedingItem.id])
    }

    const ResetCurrentPreceedingTasks = (preceedingItems)=>{

        const IDs = preceedingItems.map(item => item.id);
        const current = preceedingItems;
        const possible = filterPossiblePreceedingTasks(IDs)

        setPreceedingTasks({...preceedingTasks, current , possible});
    }

    const ResetPossiblePreceedingTasks = (preceedingItems)=>{

      const IDs = preceedingItems.map(item => item.id);
      const current = filterPossiblePreceedingTasks(IDs);
      const possible = preceedingItems;

      setPreceedingTasks({...preceedingTasks, current , possible});
  }

  return (
    <>
      <form className={`add-form Task`} onSubmit={submit}>
          
            <AddTaskText 
              label={`Task`} 
              value={text} 
              onChange={setText} 
              insertError={textError}/>
            
            {subTasks.length > 0 &&
              <section className="add_task_extras_items-wrapper subtasks">
                <AddTaskExtrasItems 
                      label = {'Added SubTasks:'}
                      items = {subTasks}
                      onClickItem = {AddSubTaskBtnClick}
                      onShiftItems = {setSubTasks}
                      onRemoveItem = {setSubTasks}
                      initialTargetID = {editTargetSubTask !== null? editTargetSubTask.id: false}
                      markTarget = {isSubTask} />
              </section>
            }

            {!isSubTask &&
              <>
                {(preceedingTasks.current.length > 0 || succeedingTasks.length > 0) &&
                    <section className="add_task_extras_items-wrapper dependencies">

                        <AddTaskExtrasItems 
                          label = {'Preceeding tasks:'}
                          items = {preceedingTasks.current}
                          shiftIDs = {true}
                          onShiftItems = {ResetCurrentPreceedingTasks}
                          onRemoveItem = {ResetCurrentPreceedingTasks}
                        />

                        <AddTaskExtrasItems 
                          label = {'Succeeding tasks:'}
                          items = {succeedingTasks}
                        />
                        
                    </section>
                }

                  <AddTaskExtrasBtns 
                      setIsSubTask = {AddSubTaskBtnClick} 
                      isPreceedingTasks = {isPreceedingTasks}
                      setIsPreceedingTasks={()=>setIsPreceedingTasks(!isPreceedingTasks)} 
                      showPreceedingTasksBtn={true}/>

                  {isPreceedingTasks &&
                    <AddTaskExtrasItems 
                        label = {'Possible preceeding tasks:'}
                        items = {preceedingTasks.possible}
                        onClickItem = {AddPreceedingTaskBtnClick}
                        onShiftItems = {ResetPossiblePreceedingTasks}
                        onRemoveItem = {ResetPossiblePreceedingTasks}
                    />
                  }

                  <AddDayTime value={text} onChange={setDay}/>
                  <AddDuration valueHrs={durationHrs} valueMin={durationMin} 
                                onChangeHrs={setDurationHrs} onChangeMin={setDurationMin}/>
                  <AddPriority priority_levels={priority_levels} priority={priority} onChange={setPriority}/>
                  <AddReminder value={reminder} onChange={setReminder}/>
                  <AddSubmitBtn value={"Save Task"}/>
              </>
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
            setSubTaskSubmit = {setSubTaskSubmit}
            backTaskBtnClick = {backTaskBtnClick}/>
        </>
      }
    </>
  )
}

export default AddTask