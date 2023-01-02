import {useState} from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { BsArrow90DegRight } from "react-icons/bs";

const AddTaskExtrasBtns = ({setIsSubTask, setIsDependency, showDependencyBtn})=>{

    return (
      <>
      <div className="add_task_extras">
        <i className='add_subtaskBtn' onClick={()=> setIsSubTask()}>
          <FaPlusCircle className="add_subtaskIcon"/>
          <span>Add sub task</span>
        </i>
        {showDependencyBtn && 
         <i className='add_subdependancyBtn' onClick={setIsDependency}>
            <BsArrow90DegRight className="set_dependancy" />
            <span>Set Dependency</span>
         </i>}
      </div>
    </>
    );
  }

export default AddTaskExtrasBtns