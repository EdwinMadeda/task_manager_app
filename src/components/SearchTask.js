import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchTask = ({searchText, setSearch}) => {
  
  return (
    <form>
        <div className='form-control search__wrapper'>
            <input 
                type="text" 
                id="search_task" 
                placeholder='Search Task' 
                value={searchText} 
                onChange={e => setSearch(e.target.value)}
                className='search__input'/>
            <FaSearch className='search__searchBtn'/>
        </div>
    </form>
  )
}

export default SearchTask