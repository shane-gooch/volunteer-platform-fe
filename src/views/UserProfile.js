import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import {useStateValue} from '../hooks/useStateValue';
import {
  UserInfo, UserEvents, UserGoal, UserStats, UserGraph,
} from '../components/UserProfile/index';
import {OrgPhoto} from '../components/OrgDashboard/index';
import {
  updateRegisteredUser, getFileUrl, deleteUserImage, getUserById,
} from '../actions';
import moment from 'moment';

export const UserProfile = (props) => {
  const [state, dispatch] = useStateValue();
  //const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [calendarValue, setCalendarValue] = useState(moment());
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  //I need to use another variable or else if the page is refreshed, state.auth.registeredUser is null so it will throw an error
  
  useEffect(() => {
    if (state.auth.registeredUser){
      if (state.auth.registeredUser.uid !== props.match.params.id){
        getUserById(props.match.params.id)
          .then(foundUser => {
            if (foundUser){
              setUser(foundUser);
            }else{
              props.history.push('/notfound');
            }
          });
      }else{
        setUser(state.auth.registeredUser);
        setIsEditable(true);
      }
    }
  }, [state.auth.registeredUser, props.match.params.id]);
  
  const onFileUpload = path => {
    getFileUrl(path)
      .then(url => {
        
        const updatedUser = {
          ...user,
          imagePath: path,
          imageUrl: url,
        };
        updateRegisteredUser(updatedUser, dispatch);
      })
      .catch(err => console.log(err));
  };
  
  const deleteImage = (user) => {
    deleteUserImage(user, dispatch);
    setImageUrl(null);
  };
  
  const updateUser = (user) => {
    updateRegisteredUser(user, dispatch);
  };
  
  const selectDate = (date) => {
    const beginning = date.startOf('date');
    const newValue = moment.unix(beginning.unix());
    
    if (selectedDate){
      const date2 = newValue.unix();
      if (selectedDate === date2){
        setSelectedDate(null);
        setCalendarValue(moment());
      }else{
        setSelectedDate(newValue.unix());
        setCalendarValue(newValue);
      }
    }else{
      setSelectedDate(newValue.unix());
      setCalendarValue(newValue);
    }
  };
  
  const changePanel = value => {
    setCalendarValue(moment.unix(value.unix()));
  };
  
  const displayAll = e => {
    e.preventDefault();
    setSelectedDate(null);
    setCalendarValue(moment());
  };
  
  const updateInfo = (bio, location) => {
    let updateUser = {
      ...user,
      bio: bio,
      city: location.city,
      state: location.state,
    };
    updateRegisteredUser(updateUser, dispatch);
  };
  
  return (
    <StyledDiv>
      <div className='profile-container'>
        <h3>Welcome {user.firstName},</h3>
        <div className='profile-top'>
          <OrgPhoto
            imageUrl={user && user.imageUrl ? user.imageUrl : ''}
            imageOwner={user}
            deleteImage={deleteImage}
            onFileUpload={onFileUpload}
            imageName={state.auth.googleAuthUser ?
              state.auth.googleAuthUser.uid :
              undefined}
          />
          <UserInfo
            user={user}
            isEditable={isEditable}
            updateInfo={updateInfo}/>
        </div>
        <h2>Overview</h2>
        <div className='profile-middle'>
          <UserGoal
            updateUser={updateUser}
            user={user}/>
        </div>
        <div className='profile-bottom'>
          <div className='profile-bottom-left'>
            <h4>Stats</h4>
            <UserStats user={user}/>
            <h4>Stats so far</h4>
            <UserGraph user={user}/>
          </div>
          <div className='profile-bottom-right'>
            <UserEvents
              events={user.registeredEvents}
              calendarValue={calendarValue}
              changePanel={changePanel}
              selectDate={selectDate}
              selectedDate={selectedDate}
              displayAll={displayAll}/>
          </div>
        </div>
      </div>
    </StyledDiv>
  );
};

export default withRouter(UserProfile);

const StyledDiv = styled.div`
  background: ${({theme}) => theme.gray2};

  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  h3 {
    align-self: flex-start;
  }

  .profile-top, .profile-middle, .profile-bottom {
    width: 900px;
  }

  .profile-top {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    height: 260px;

    .ant-card {
      padding: 0;
      margin: 0;
    }
  }

  .profile-bottom {
    display: flex;
    justify-content: space-between;
  }

  .profile-bottom-left {
    width: 40%;
  }
`;