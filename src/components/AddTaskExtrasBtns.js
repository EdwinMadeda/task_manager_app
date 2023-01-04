import {useState} from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { BsArrow90DegRight } from "react-icons/bs";

const AddTaskExtrasBtns = ({setIsSubTask, isPreceedingTasks, setIsPreceedingTasks, showPreceedingTasksBtn})=>{

    return (
      <>
      <div className="add_task_extras">
        <i className={`add_subtaskBtn ${isPreceedingTasks && 'invisible'}`} onClick={()=> setIsSubTask()}>
          <FaPlusCircle className="add_subtaskIcon"/>
          <span>Add sub task</span>
        </i>
        {showPreceedingTasksBtn && 
         <i className='add_subdependancyBtn' onClick={setIsPreceedingTasks}>
            <BsArrow90DegRight className="set_dependancy" />
            <span>Set Preceeding tasks</span>
         </i>}
      </div>
    </>
    );
  }

export default AddTaskExtrasBtns