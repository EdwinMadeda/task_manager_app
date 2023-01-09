import { useState, useEffect, useReducer } from "react";
import { BsFillBackspaceFill } from "react-icons/bs";

import AddTaskText from "./TaskInputs/AddTaskText";
import AddDayTime from "./TaskInputs/AddDayTime";
import AddDuration from "./TaskInputs/AddDuration";
import AddPriority from "./TaskInputs/AddPriority";
import AddReminder from "./TaskInputs/AddReminder";
import AddSubmitBtn from "./TaskInputs/AddSubmitBtn";


  const AddSubTask = ({
    priority_levels, 
    subTasks, 
    setSubTasks, 
    editTargetSubTask = null, 
    subTaskSubmit, 
    setSubTaskSubmit,
    backTaskBtnClick}) => {
      
  const initialState = {
    subTask : {},
    currSubTaskID : undefined,
    text : '',
    day : new Date(),
    reminder : false,
    durationHrs : 0,
    durationMin : 0,
    priority : undefined
  };

  const init = ()=>{
    let {currSubTaskID, text, day, reminder, durationHrs, durationMin, priority} = initialState;
          currSubTaskID = subTasks.length+1;

    if(editTargetSubTask){
      const obj = editTargetSubTask;
            currSubTaskID = obj.id;
            text = obj.text || '';
            day = obj.day || new Date();
            reminder = obj.reminder || false;
            durationHrs = obj.durationHrs || 0;
            durationMin = obj.durationMin || 0;
            priority = obj.priority || undefined;

    }

    const subTask = {text, day, reminder, durationHrs, durationMin, priority}
    return {
      ...initialState,
      ...subTask,
      currSubTaskID,
      subTask : {...subTask,  id : currSubTaskID}
    }

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
    const setTask = ()=> ({...state, ...action.payload, subTask : {...state.subTask, ...action.payload}});

    switch(action.type){
        case 'setText':         return setTask();
        case 'setDay':          return setTask();
        case 'setDurationHrs':  return setTask();
        case 'setDurationMin':  return setTask();
        case 'setPriority':     return setTask();
        case 'setReminder':     return setTask(); 

        case 'init': return init(); 
        case 'clearForm': return clearForm(state); 
    }
  }

  const submit = (e)=>{
        e.preventDefault();
        let newSubTasks = [...subTasks, state.subTask];

        if(editTargetSubTask){
          newSubTasks = subTasks.map(subTask => 
            subTask.id === state.currSubTaskID? state.subTask: subTask
          );
        }
      
        setSubTasks(newSubTasks);
        setSubTaskSubmit(true);
        clearForm();

  }

  const [state, dispatch] = useReducer(reducer, initialState, init);

  return (
    <>  
    {!subTaskSubmit && 
      <form className={`add-form subTask`} onSubmit={submit}>
        
          <BsFillBackspaceFill 
            className="subTask_backBtn" 
            onClick={backTaskBtnClick}/>

          <AddTaskText 
              label={`SubTask ${state.currSubTaskID}`} 
              value={state.text} 
              onChange={inputVal => dispatch({type: 'setText', payload: {text: inputVal}})} 
          />

          <AddDayTime 
              value={state.day} 
              onChange={inputVal => dispatch({type: 'setDay', payload: {day : inputVal}})}/>

          <AddDuration 
              valueHrs={state.durationHrs} 
              valueMin={state.durationMin} 
              onChangeHrs={inputVal => dispatch({type: 'setDurationHrs', payload: {durationHrs: inputVal}})} 
              onChangeMin={inputVal => dispatch({type: 'setDurationMin', payload: {durationMin: inputVal}})}/>

          <AddPriority 
              priority_levels={priority_levels} 
              priority={state.priority} 
              onChange={inputVal => dispatch({type: 'setPriority', payload: {priority: inputVal}})}/>

          <AddReminder 
              value={state.reminder} 
              onChange={inputVal => dispatch({type: 'setReminder', payload : {reminder: inputVal}})}/>

          <AddSubmitBtn value={"Save Sub Task"}/>
      </form>
    }
    </>

  )
}

export default AddSubTask