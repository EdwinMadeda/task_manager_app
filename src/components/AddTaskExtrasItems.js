import { useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { BsArrowUpShort, BsArrowDownShort, BsChevronCompactUp, BsChevronCompactDown } from "react-icons/bs";

const AddTaskExtrasItems = ({label, items, onClickItem, initialTargetID=false, markTarget = null, onRemoveItem = false, onShiftItems = false, shiftIDs = false})=>{
  
  const [showItems, setShowItems] = useState(true);
  const [targetItemID, setTargetItemID] = useState(initialTargetID);

  useEffect(()=>{
    //setTargetItemID(false);
  },[items, markTarget]);
    
    if(items === undefined) return;

    const returnItems = (items)=>{
      return shiftIDs? items.map(item => item.id).filter(item => typeof(item) === 'number'): items;
    }

    const shiftItems = (index, direction) =>{
      const index1 = direction === 'up'? index-1: index+1;
      items[index] = items.splice(index1, 1, items[index])[0];

      return items.filter(item => item !== undefined);
    }

    const onRemoveItemClick = (targetItem)=>{
        const filteredItems = items.filter(item => item.id !== targetItem.id);
        onRemoveItem && onRemoveItem(returnItems(filteredItems));
    }

    const onTargetItemClick = (item)=>{
      onClickItem(item);
      markTarget !== null && setTargetItemID(item.id);
    }

    

   
    return(
      <>{items.length > 0 && 
          <>
              <p className='add_task_extras_label'>
                <span className='add_task_extras_dropDownBtn_wrapper'>
                  {label}
                  <i className='add_task_extras_dropDownBtn' 
                     onClick={()=>setShowItems(!showItems)}>
                    {showItems? <BsChevronCompactUp/>: <BsChevronCompactDown/>}
                  </i>
                </span>
                <span>{items.length}</span>
              </p>
              {showItems && 

                <ol className="add_task_extras_items">
                    {items.map(item => (
                      <li key={item.id}>
                        <div>
                          {onShiftItems && items.length > 1 &&
                            <span className="itemSortBtns">

                              {items.indexOf(item) > 0 &&
                                <BsArrowUpShort 
                                  className='itemSortBtn' 
                                  onClick={() => onShiftItems(shiftItems(items.indexOf(item), 'up'))}/>
                              }

                              {items.indexOf(item) < items.length - 1 && 
                                <BsArrowDownShort 
                                  className='itemSortBtn' 
                                  onClick={()=>onShiftItems(shiftItems(items.indexOf(item), 'down'))}/>
                              }

                            </span>}
                            <span 
                                className={`itemName ${item.id === targetItemID && 'target'}`} 
                                onClick={()=> onTargetItemClick(item)}>{item.text}
                            </span>
                        </div>
                        {onRemoveItem && <FaTrash
                              title='remove' 
                              className='removeItemBtn'
                              onClick={()=> onRemoveItemClick(item)}/>
                        }
                      </li>
                    ))}
                </ol>

              }
          </>
        }</>
    )
  }

export default AddTaskExtrasItems