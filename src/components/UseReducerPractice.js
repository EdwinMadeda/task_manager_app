import { useEffect, useReducer } from "react";
import { FaTimes, FaEdit } from 'react-icons/fa'; 

const initialState = {
    users : [],
    name : '',
    email : '',
    activeID: false,
    toggleEdit : false,
};

const init = (payload)=>{
    return {...initialState, ...payload};
};

const reducer = (state, { type, payload }) => {
  switch (type) {

case 'setName':
return Object.assign({}, state, payload);

case 'setEmail':
    return Object.assign({}, state, payload);

case 'setUsers':
    return Object.assign({}, state, {users : [...payload]});

case 'toggleEdit':
    return Object.assign({}, state, {...payload}, {toggleEdit : !state.toggleEdit});
    
case 'reset':
    return init(payload);

  default:
    return state
  }
};

export default function Users(){
    const [state, dispatch] = useReducer(reducer, initialState, init);

    useEffect(()=>{
       if(!state.toggleEdit){
         dispatch({type: 'setName', payload: {name: ''}})
         dispatch({type: 'setEmail', payload: {email: ''}});
       }
    },[state.toggleEdit]);
    
    const submit = e =>{
        e.preventDefault();
        const myUser = {
            id: state.toggleEdit? state.activeID: state.users.length + 1,
            name : state.name,
            email: state.email,
        };

        const users = state.toggleEdit? 
                      state.users.map(user => user.id === state.activeID? myUser: user): 
                      [...state.users, myUser];
    
        dispatch({type: 'setUsers', payload: users});
        dispatch({type: 'reset', payload : {users}});
    }

    return (
        <>
            <ul>
                {state.users.map(user => (
                    <li key={user.id}>
                        <FaEdit onClick={() => dispatch({type: 'toggleEdit', payload: {
                            activeID : user.id,
                            name: user.name,
                            email: user.email,}})}/>

                        {`${user.name} ${user.email}`}
                        <FaTimes onClick={()=> {
                            dispatch({type: 'setUsers', 
                                      payload: state.users.filter(myuser => myuser.id !== user.id)
                            });
                        }}/>
                    </li>
                ))}
            </ul>
            <form onSubmit={submit}>
                <div>
                    <input 
                        type="text"
                        placeholder="name" 
                        value={state.name}
                        onChange={e => dispatch({type: 'setName', payload: {name: e.target.value}})}/>
                </div>
                <div>
                    <input 
                        type="email"
                        placeholder="email" 
                        value={state.email}
                        onChange={e => dispatch({type: 'setEmail', payload: {email: e.target.value}})}/>
                </div>

                <input type="submit" value={`${state.toggleEdit?"Edit":"Add"} User`} />
            </form>
        </>
    )
}
