import { useState, useEffect } from "react";
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
    
    const [currSubTaskID, setCurrSubTaskID] = useState(subTasks.length+1);
    const [text, setText] = useState('');
    const [day, setDay] = useState(new Date());
    const [reminder, setReminder] = useState(false);
    const [durationHrs, setDurationHrs] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [priority, setPriority] = useState(undefined);
   

    const clearForm = ()=>{
      setText('');
      setDay(new Date());
      setReminder(false);
      setDurationHrs(0);
      setDurationMin(0);
      setPriority(null);

    }

    useEffect(()=>{
      if(editTargetSubTask){
        const obj = editTargetSubTask;

        setCurrSubTaskID(obj.id);
        setText(obj.text || '');
        setDay(obj.day || new Date());
        setReminder(obj.reminder || false);
        setDurationHrs(obj.durationHrs || 0);
        setDurationMin(obj.durationMin || 0);
        setPriority(obj.priority || null);

      }
    },[editTargetSubTask]);

  
    const submit = (e)=>{
        e.preventDefault();
        const obj = {text, day, reminder, durationHrs, durationMin, priority};
        let newSubTasks;

        if(editTargetSubTask){
          newSubTasks = subTasks.map(subTask => (
            subTask.id === currSubTaskID? {id: currSubTaskID, ...obj}: subTask
          ));
        }
        else newSubTasks = [...subTasks, {id: currSubTaskID, ...obj}];

        setSubTasks(newSubTasks);
        setSubTaskSubmit(true);
        clearForm();

    }

  return (
    <>  
    {!subTaskSubmit && 
      <form className={`add-form subTask`} onSubmit={submit}>
        
          <BsFillBackspaceFill className="subTask_backBtn" onClick={backTaskBtnClick}/>
          <AddTaskText label={`SubTask ${currSubTaskID}`} value={text} onChange={setText}/>
          <AddDayTime value={text} onChange={setDay}/>
          <AddDuration valueHrs={durationHrs} valueMin={durationMin} 
                        onChangeHrs={setDurationHrs} onChangeMin={setDurationMin}/>
          <AddPriority priority_levels={priority_levels} priority={priority} onChange={setPriority}/>
          <AddReminder value={reminder} onChange={setReminder}/>
          <AddSubmitBtn value={"Save Sub Task"}/>
      </form>
    }
    </>
  
  )
}

export default AddSubTask