import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyledForm, StyledInput } from '../styled';
import { useStateValue } from '../hooks/useStateValue';
import EventList from '../components/EventList';
import { getAllEventsByState } from '../actions';
import { stateConversion } from '../utility/stateConversion';

const MainDashboard = () => {
  const [ state, dispatch ] = useStateValue();
  const [ localState, setInputState ] = useState( { state: '' } );
  
  //fetching user's location by IP
  useEffect(() => {
    axios.get(`http://ipinfo.io?token=${process.env.REACT_APP_ipinfoKey}`)
      .then(res => {
        let stateAbbrev = Object.keys(stateConversion).find(key => stateConversion[key] === res.data.region);
        if (stateAbbrev) {
          setInputState({
            ...localState,
            state: stateAbbrev
          })
        }
      })
      .catch(err => {
        console.log('Error detecting location');
      })
  }, [])

  useEffect( () => {
    
    if( localState.state.length === 2 ){
      getAllEventsByState( localState.state, dispatch );
    }
  }, [ localState ] );
  
  const onChange = e => {
    setInputState( { ...localState, [ e.target.name ]: e.target.value } );
  };
  return ( <div>
    <h1>Shows a list of events.</h1>
    <div style={ { display: 'flex', justifyContent: 'center' } }>
      <StyledForm maxWidth='500px'>
        <StyledInput
          values={ localState }
          name={ 'State' }
          onChange={ onChange }
          placeholder="Enter State Initials"
        />
      </StyledForm>
    </div>
    <EventList events={ state.events.events }/>
  </div> );
};

export default MainDashboard;