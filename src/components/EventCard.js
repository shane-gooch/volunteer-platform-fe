import React, {useState, useEffect} from 'react';
import manHiking from '../assets/man-hiking.jpg';
import styled from 'styled-components';
import {StyledCard} from '../styled';
import {Tag} from 'antd';
import moment from 'moment';
import {findNext} from '../utility/findNextRecurEvent';
import PropTypes from 'prop-types';
import Editor from './EventComments/Editor';
import CommentList from './EventComments/CommentsList';
import {useStateValue} from '../hooks/useStateValue';
import {addComment, addCommentToComment} from '../actions';
import uuid4 from 'uuid4';

export const EventCard = ({event, match}) => {
  
  const [{auth, comments}, dispatch] = useStateValue();
  
  useEffect(() => {
  
  }, [comments]);
  
  const [localState, setLocalState] = useState({
    interest: [],
    typesOfCauses: [],
    volunteerRequirements: [],
    orgName: '',
    nameOfEvent: '',
    startTime: '',
    endTime: '',
    numberOfVolunteers: null,
    eventDetails: '',
    otherNotes: '',
    nextDate: '',
    recurringInfo: {},
  });
  
  useEffect(() => {
    if ('recurringInfo' in event){
      let nextDate = findNext(event.startTimeStamp, event.recurringInfo);
      setLocalState({
        ...localState,
        nextDate: moment(
          moment.unix(nextDate).format('LL') + ' ' + event.startTime,
        ).unix(), ...event,
      });
    }else{
      setLocalState({...localState, nextDate: event.startTimeStamp, ...event});
    }
  }, [event]);
  
  const causes = localState.typesOfCauses.map(item => {
    return <Tag>{(item = [item])}</Tag>;
  });
  
  const interest = localState.interest.map(item => {
    return <Tag>{(item = [item])}</Tag>;
  });
  
  const requirements = localState.volunteerRequirements.map(item => {
    return <Tag>{(item = [item])}</Tag>;
  });
  
  console.log('LocalState', localState);
  
  const submitComment = (text) => {
    
    const comment = {
      commentId: uuid4(),
      comment: text.comment,
      avatarPath: auth.registeredUser.imagePath,
      createdAt: moment().unix(),
      usersUid: auth.googleAuthUser.uid,
      name: auth.registeredUser.firstName + ' ' + auth.registeredUser.lastName,
    };
    addComment(comment, event, dispatch);
  };
  
  const handleAddCommentToComment = (text, comment) => {
    
    const newComment = {
      commentId: uuid4(),
      comment: text.comment,
      avatarPath: auth.registeredUser.imagePath,
      createdAt: moment().unix(),
      usersUid: auth.googleAuthUser.uid,
      name: auth.registeredUser.firstName + ' ' + auth.registeredUser.lastName,
    };
    addCommentToComment(newComment, event, comment, dispatch);
  };
  
  return (
    <div>
      <div style={heading}>
        <h4> {localState.nameOfEvent} </h4>
        <h6> {moment.unix(localState.nextDate).format('LLLL')} </h6>
        <h6> {localState.orgName} </h6>
      </div>
      <StyledEventPage>
        <div className="card">
          <div className="photo">
            <img src={manHiking} alt="dude" width={175} height={175}/>
          </div>
          <div className="tags">
            <h5>Interests: </h5>
            <div className="subtag">{interest}</div>
            <h5>Causes: </h5>
            <div className="subtag">{causes}</div>
            <h5>Requirements: </h5>
            <div className="subtag">{requirements}</div>
          </div>
        </div>
      </StyledEventPage>
      <StyledEventDetails>
        <div className="details">
          <h5>Details</h5>
        </div>
        <div className="description">{localState.eventDetails}</div>
      </StyledEventDetails>
      <StyledEventTime>
        <div className="time">
          <h5>
            {localState.startTime} - {localState.endTime}
          </h5>
        </div>
        <div className="info">
          <h6>{localState.recurringInfo.days}</h6>
        </div>
      </StyledEventTime>
      <CommentList comments={event.comments}
                   addCommentToComment={handleAddCommentToComment}
                   isLoading={comments.isLoadingReplyToComment}
                   event={event}
      />
      <Editor onSubmit={submitComment} submitting={comments.isLoading}/>
    </div>
  );
};

const StyledEventPage = styled(StyledCard)`
.ant-card-body {
    padding: 0;
}
&& {
    // margin-left: 15%;
    border-radius: 2px;
    width: 100%;
    max-width: 100%;
    padding: 0;
    //border: 1px solid purple
}   
.card {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    
    .photo {
        margin-right: 3%;
    }

    .tags {
        width: 75%;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        margin: 2% 0;
        .subtag {
            flex-direction: row;
            justify-content: flex-start;
        }
    }
}
`;

const StyledEventDetails = styled(StyledCard)`
.ant-card-body {
    padding: 0;
}
&&& {
    background-color: white;
    border-radius: 2px;
    margin-top: 1.5%;
    width: 100%;

    .container {
        display: flex;
    }
    .details {
        border-bottom: 1px solid black;
        text-align:center;
    }

    .description {
        background-color: white;
        padding: 1% 0;
        text-align:left;
    }
}
`;

const StyledEventTime = styled(StyledCard)`
.ant-card-body {
    padding: 0;
}
&&& {
    background-color: white;
    border-radius: 2px;
    margin-top: 1.5%;
    width: 35%;
    height: 100px;
    text-align:center;

    .time {
        border-bottom: 1px solid black;
    }

    .info {
        background-color: white;
    }
}
`;

const heading = {
  marginLeft: '15%',
};

EventCard.propTypes = {
  event: PropTypes.object,
};

export default EventCard;