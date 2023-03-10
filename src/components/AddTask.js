import { useReducer , useRef} from "react";
import { BsToggle2On, BsToggle2Off} from "react-icons/bs";
import { AiFillForward } from "react-icons/ai";

import AddTaskText from "./TaskInputs/AddTaskText";
import AddDayTime from "./TaskInputs/AddDayTime";
import AddDuration from "./TaskInputs/AddDuration";
import AddPriority from "./TaskInputs/AddPriority";
import AddReminder from "./TaskInputs/AddReminder";
import AddSubmitBtn from "./TaskInputs/AddSubmitBtn";

import AddTaskExtrasItems from "./AddTaskExtrasItems";
import AddTaskExtrasBtns from "./AddTaskExtrasBtns";

import AddSubTask from "./AddSubTask";


const AddTask = ({
    allTasks, 
    editTargetTask = null, 
    editTargetSubTask = null, 
    isViewTask = false, 
    onAdd, 
    onEdit}) => {

  const editTargetTaskRef = useRef(editTargetTask);

  const filterCurrentPreceedingTasks = (IDs) => allTasks.filter(task => IDs.includes(task.id));
  const filterPossiblePreceedingTasks = (IDs) => allTasks.filter(task => !IDs.includes(task.id));
  const filterSucceedingTasks = ()=>{
     if(!editTargetTask) return [];

          return allTasks.filter(task => {
          return task.preceedingTaskIDs === undefined? false : 
                task.preceedingTaskIDs.includes(editTargetTask.id);
          });
    };

  const initialState = {
    text : '',
    day : new Date(), 
    reminder : false, 
    durationHrs : 0, 
    durationMin : 0, 
    priority : undefined,
   
    textError : false, 
  
    task : {}, 
    subTasks : [], 
    isSubTask : false,
    targetSubTask : null, 
  
  
    isPreceedingTasks : false,
    preceedingTaskIDs : [], 
    preceedingTasks : {current: [], possible: []}, 
    succeedingTasks : [], 

    isViewTask : false,

   };

   const init = ()=>{
    const obj = editTargetTask;
    let id = allTasks.length + 1;
    let {text, day, reminder, durationHrs, durationMin, priority,subTasks,
          preceedingTaskIDs, preceedingTasks, succeedingTasks, isSubTask} = initialState;
       
    if(obj){
      id = obj.id;
      text = obj.text;
      day = obj.day;
      reminder = obj.reminder;
      durationHrs = obj.durationHrs;
      durationMin = obj.durationMin;
      priority = obj.priority;
      subTasks = obj.subtasks || [];
      preceedingTaskIDs = obj.preceedingTaskIDs || [];
      preceedingTasks = {
        current : filterCurrentPreceedingTasks(preceedingTaskIDs),
        possible : filterPossiblePreceedingTasks(preceedingTaskIDs)
      }
      succeedingTasks  = filterSucceedingTasks();
      isSubTask = (editTargetSubTask !== null);
      
    }

    const task = {id, text, day, reminder, durationHrs, durationMin, priority, subtasks : subTasks, preceedingTaskIDs}
    return {...initialState, ...task, task, subTasks, preceedingTasks, succeedingTasks, targetSubTask : editTargetSubTask, isViewTask, isSubTask};

  }
   
   const clearForm = (state)=>{
      return {...state, 
              text : initialState.text,
              day: initialState.day,
              reminder: initialState.reminder,
              durationHrs: initialState.durationHrs,
              durationMin: initialState.durationMin,
              priority: initialState.priority};
   }
  
   const reducer = (state, action) =>{
       const setTask = ()=> ({...state, ...action.payload, task : {...state.task, ...action.payload}});
     
       switch(action.type){
          case 'setText':         return setTask();
          case 'setDay':          return setTask();
          case 'setDurationHrs':  return setTask();
          case 'setDurationMin':  return setTask();
          case 'setPriority':     return setTask();
          case 'setReminder':     return setTask(); 
          case 'setPreceedingTaskIDs': return setTask();
          case 'setSubTasks' : return {...state, 
                                       subTasks : action.payload, 
                                       task: {...state.task, subtasks: action.payload}};

          case 'setTargetSubtask' : return {...state, targetSubTask: action.payload};
          case 'setIsSubTask' : return {...state, isSubTask: action.payload}; 

          case 'setPreceedingTasksObj': return {...state, preceedingTasks : action.payload};
          case 'setIsPreceedingTasks' : return {...state, isPreceedingTasks : action.payload};

          case 'toggleEditMode' : return {...state, isViewTask: !state.isViewTask};

          case 'resetEditTargetTask' : {
              editTargetTask = action.payload;
              return init();
          }

          case 'init': return init(); 
          case 'clearForm': return clearForm(state);    
          
          default: return state;
       }

   };
   
   const [state, dispatch] = useReducer(reducer, initialState, init);

   const priority_levels = [
    "Urgent and important",
    "Important, but not urgent",
    "Urgent, but not important",
    "Neither urgent nor important"
  ];
   
  const ResetSubTasks = (subTasks) =>{
     dispatch({type : 'setSubTasks', payload : subTasks});
  }
  
  const ResetCurrentPreceedingTasks = (preceedingItems)=>{

    const IDs = preceedingItems.map(item => item.id);
    const current = preceedingItems;
    const possible = filterPossiblePreceedingTasks(IDs)
    const preceedingTasks = {...state.preceedingTasks, current , possible};

    dispatch({type: "setPreceedingTasksObj", payload : preceedingTasks});
}

const ResetPossiblePreceedingTasks = (preceedingItems)=>{

  const IDs = preceedingItems.map(item => item.id);
  const current = filterPossiblePreceedingTasks(IDs);
  const possible = preceedingItems;
  const preceedingTasks = {...state.preceedingTasks, current , possible};

  dispatch({type: "setPreceedingTasksObj", payload : preceedingTasks});
}

const AddPreceedingTaskBtnClick = (preceedingItem) =>{
  
  if(!state.preceedingTaskIDs.includes(preceedingItem.id)){

    const preceedingTaskIDs = [...state.preceedingTaskIDs, preceedingItem.id];
    const preceedingTasks = {
      current : filterCurrentPreceedingTasks(preceedingTaskIDs),
      possible : filterPossiblePreceedingTasks(preceedingTaskIDs),
    }
    dispatch({type: "setPreceedingTaskIDs", payload: {preceedingTaskIDs}});
    dispatch({type: "setPreceedingTasksObj", payload : preceedingTasks});
  } 

}

 const AddSubTaskBtnClick = (targetSubTask = state.targetSubTask)=>{
     
      if(state.text !== '' || (editTargetTask && state.targetSubTask)){ 
 
        dispatch({type : "setTargetSubtask", payload: targetSubTask});
        dispatch({type : "setIsSubTask", payload: true});
       
        return;
      }
      dispatch({type: "setTextError", payload: 'Field cannot be empty'});

}

const backTaskBtnClick =()=>{
  dispatch({type: "setIsSubTask", payload: false});
  dispatch({type : "setTargetSubtask", payload: null});
}


const submit = e =>{
  e.preventDefault();
  editTargetTask? onEdit(state.task) : onAdd(state.task);
  dispatch({type : 'clearForm'});
  
}

return (
    <>
  
      {editTargetTask && isViewTask &&
        <div className="editTask_Btns_wrapper"> 

          <AiFillForward 
            className={`toggleBackTask_btn ${editTargetTaskRef.current.id === editTargetTask.id && 'invisible'}`}
            onClick={()=> dispatch({type: 'resetEditTargetTask', payload: editTargetTaskRef.current})}/>

          <p className="toggleEditMode_btns">
              <span>Edit mode</span>
              <button 
                className="toggleEditMode_btn"
                onClick={() => dispatch({type : 'toggleEditMode'})}>
                 {state.isViewTask? <BsToggle2Off/> : <BsToggle2On/>}
              </button>
            
              <span>{state.isViewTask? 'OFF' : 'ON'}</span>
          </p>

        </div>
      }
      <form className={`add-form Task`} onSubmit={submit}>
          <AddTaskText 
              label={`Task`} 
              value={state.text} 
              onChange={inputVal => dispatch({type: 'setText', payload: {text: inputVal}})} 
              insertError={state.textError}
              disabled = {state.isViewTask}/>

          {state.subTasks.length > 0 &&
              <section className="add_task_extras_items-wrapper subtasks">
                <AddTaskExtrasItems 
                      label = {'Added SubTasks:'}
                      items = {state.subTasks}
                      onClickItem = {AddSubTaskBtnClick}
                      onShiftItems = {ResetSubTasks}
                      onRemoveItem = {ResetSubTasks}
                      initialTargetID = {state.targetSubTask !== null? state.targetSubTask.id: false}
                      markTarget = {state.isSubTask}
                      isViewTask = {state.isViewTask} />
              </section>
            }

            {!state.isSubTask &&
              <>
                {(state.preceedingTasks.current.length > 0 || state.succeedingTasks.length > 0) &&
                    <section className="add_task_extras_items-wrapper dependencies">

                        <AddTaskExtrasItems 
                          label = {'Preceeding tasks:'}
                          items = {state.preceedingTasks.current}
                          onClickItem = {item =>{dispatch({type: 'resetEditTargetTask', payload: item})}}
                          shiftIDs = {true}
                          onShiftItems = {ResetCurrentPreceedingTasks}
                          onRemoveItem = {ResetCurrentPreceedingTasks}
                          isViewTask = {state.isViewTask}
                        />

                        <AddTaskExtrasItems 
                          label = {'Succeeding tasks:'}
                          items = {state.succeedingTasks}
                          onClickItem = {item =>{dispatch({type: 'resetEditTargetTask', payload: item})}}
                          isViewTask = {state.isViewTask}
                        />
                        
                    </section>
                }

                  {!state.isViewTask && 
                    <AddTaskExtrasBtns 
                        setIsSubTask = {AddSubTaskBtnClick} 
                        isPreceedingTasks = {state.isPreceedingTasks}
                        setIsPreceedingTasks={()=>dispatch({type: "setIsPreceedingTasks", payload: !state.isPreceedingTasks})} 
                        showPreceedingTasksBtn={true}
                    />
                  }

                  {state.isPreceedingTasks && !state.isViewTask &&
                    <AddTaskExtrasItems 
                        label = {'Possible preceeding tasks:'}
                        items = {state.preceedingTasks.possible}
                        onClickItem = {AddPreceedingTaskBtnClick}
                        onShiftItems = {ResetPossiblePreceedingTasks}
                        onRemoveItem = {ResetPossiblePreceedingTasks}
                    />
                  }

                    <AddDayTime 
                      value={state.day} 
                      onChange={inputVal => dispatch({type: 'setDay', payload: {day : inputVal}})}
                      disabled = {state.isViewTask}/>

                    <AddDuration 
                        valueHrs={state.durationHrs} 
                        valueMin={state.durationMin} 
                        onChangeHrs={inputVal => dispatch({type: 'setDurationHrs', payload: {durationHrs: inputVal}})} 
                        onChangeMin={inputVal => dispatch({type: 'setDurationMin', payload: {durationMin: inputVal}})}
                        disabled = {state.isViewTask}/>

                    <AddPriority 
                        priority_levels={priority_levels} 
                        priority={state.priority} 
                        onChange={inputVal => dispatch({type: 'setPriority', payload: {priority: inputVal}})}
                        disabled = {state.isViewTask}/>

                    <AddReminder 
                        value={state.reminder} 
                        onChange={inputVal => dispatch({type: 'setReminder', payload : {reminder: inputVal}})}
                        disabled = {state.isViewTask}/>

                    {!state.isViewTask && 
                    <AddSubmitBtn value={"Save Task"}/>
                    }
              </>
            }
              
      </form>

      {state.isSubTask && 
        <>
        <AddSubTask 
            priority_levels={priority_levels} 
            subTasks = {state.subTasks}
            editTargetSubTask={state.targetSubTask} 
            isViewTask={state.isViewTask}
            setSubTasks = {subTasks => dispatch({type : 'setSubTasks', payload : subTasks})}
            backTaskBtnClick = {backTaskBtnClick}/>
        </>
      }

    </>
  )
}

export default AddTask