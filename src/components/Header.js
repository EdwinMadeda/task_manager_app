import PropTypes from 'prop-types';
import Button from './Button';
import { FaSearch } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

const Header = ({title, addBtnClick, showAdd, isSearch, setIsSearch}) => {
  
  return (
    <header className='header'>
         <h1>{title}</h1> 
         <div className='header__btn-wrapper'>
            <div 
              className='header__searchBtn-wrapper'
              onClick={setIsSearch}>
              {isSearch? 
                  (<FaTimes className='header__btn search'/>) :
                  (<FaSearch className='header__btn search'/>)}
            </div>
            
            <Button 
                className='header__btn'
                color={showAdd? 'green': 'red'} 
                text={showAdd? 'Add': 'Close'} 
                onClick={addBtnClick}/>
         </div>
    </header> 
  )
}

Header.defaultProps = {
    title : 'task tracker',
}

Header.propTypes = {
    title : PropTypes.string.isRequired, 
}

export default Header