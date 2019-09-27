import {action} from './action';
import firebase, {store} from '../firebase/FirebaseConfig';

/**
 * Auth Actions
 * @module actions/auth
 *
 */

export const SIGNED_IN = 'SIGNED_IN';

/**
 * Marks a user signed in in state.
 *
 * @function
 * @param {Object} user - google auth user object.
 * @param {Dispatch} dispatch - useReducer dispatch function
 */
export const signedIn = (user, dispatch) => {
  localStorage.setItem('loggedIn', 'true');
  dispatch(action(SIGNED_IN, user));
  checkUserRegistered(user.uid, dispatch);
};

export const SIGNED_OUT = 'SIGNED_OUT';

/**
 * Sign a googleAuthUser out.
 *
 * @function
 * @param {Dispatch} dispatch
 */
export const signedOut = dispatch => {
  localStorage.setItem('loggedIn', 'false');
  dispatch(action(SIGNED_OUT));
};

export const GOOGLE_PROVIDER = 'GOOGLE_PROVIDER';
export const FACEBOOK_PROVIDER = 'FACEBOOK_PROVIDER';
export const TWITTER_PROVIDER = 'TWITTER_PROVIDER';
export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';
const providers = {
  GOOGLE_PROVIDER: new firebase.auth.GoogleAuthProvider(),
  FACEBOOK_PROVIDER: new firebase.auth.FacebookAuthProvider(),
  TWITTER_PROVIDER: new firebase.auth.TwitterAuthProvider(),
  EMAIL_PROVIDER: new firebase.auth.EmailAuthProvider(),
};

export const SIGNIN_INIT = 'SIGNIN_INIT';
export const SIGNIN_NEW_USER = 'SIGNIN_NEW_USER';
export const SIGNIN_FAILED = 'SIGNIN_FAILED';
export const GET_USER_ACCOUNT_SUCCESSFUL = 'GET_USER_ACCOUNT_SUCCESSFUL';
export const SIGNUP_FAILED = 'SIGNUP_FAILED';

/**
 * Log a googleAuthUser in.
 *
 * @function
 * @param {string} authType
 * @param {Dispatch} dispatch
 * @param {string} [email]
 * @param {string} [password]
 */
export const signIn = (authType, dispatch, email, password) => {
  dispatch({type: SIGNIN_INIT});
  if (authType === EMAIL_PROVIDER){
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(res => {
            signedIn(res.user, dispatch);
          });
      })
      .catch(error => {
        if (error.code.includes('email-already-in-use')){
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
              signedIn(res.user, dispatch);
            })
            .catch(err => {
              dispatch(action(SIGNIN_FAILED, err.message));
            });
        }else{
          dispatch(action(SIGNUP_FAILED, error.message));
        }
      });
    return;
  }
  
  const provider = providers[ authType ];
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result){
      if (result.user){
        signedIn(result.user, dispatch);
      }else{
        dispatch(action(SIGNIN_FAILED, 'Unable to find user'));
      }
    })
    .catch(function(error){
      dispatch(action(SIGNIN_FAILED, error.message));
    });
};

export const signOut = dispatch => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      signedOut(dispatch);
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Checks a user is registered.
 *
 * @function
 * @param {string} uid - unique user id from google auth
 * @param {Dispatch} dispatch - function from useStateValue() hook.
 */
export const checkUserRegistered = (uid, dispatch) => {
  store
    .collection('users')
    .doc(uid)
    .get()
    .then(res => {
      if (res.exists){
        const data = res.data();
        data.uid = res.id;
        localStorage.setItem('userRegistered', 'true');
        dispatch(action(GET_USER_ACCOUNT_SUCCESSFUL, data));
      }else{
        localStorage.setItem('userRegistered', 'false');
        dispatch(action(SIGNIN_NEW_USER));
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const REGISTER_INIT = 'REGISTER_INIT';
export const REGISTER_SUECESSFUL = 'REGISTER_SUECESSFUL';
export const REGISTER_FAILED = 'REGISTER_FAILED';

/**
 * Register a new User
 *
 * @function
 * @param {User} user
 * @param {function} dispatch
 */
export const register = (user, dispatch) => {
  dispatch(action(REGISTER_INIT));
  store
    .collection('users')
    .doc(user.uid)
    .set(user)
    .then(res => {
      localStorage.setItem('signedUp', 'true');
      //any difference between signedUp vs userRegistered? I could not get the form to re-rout so I had to add line 172
      localStorage.setItem('userRegistered', 'true');
      dispatch(action(REGISTER_SUECESSFUL, user));
    })
    .catch(err => {
      console.log(err);
      dispatch(action(REGISTER_FAILED));
    });
};

export const UPDATE_REGISTERED_USER = 'UPDATE_REGISTERED_USER';

/**
 * Update registered user in the db.
 *
 * @function
 * @param {User} user
 * @param {Dispatch} dispatch
 */
export const updateRegisteredUser = (user, dispatch) => {
  store.collection('users').doc(user.uid).set(user).then(res => {
    dispatch(action(UPDATE_REGISTERED_USER, user));
  }).catch(err => console.log(err));
};

export const GET_TOP_VOLUNTEERS = 'GET_TOP_VOLUNTEERS';
export const GET_TOP_VOLUNTEERS_FAILED = 'GET_TOP_VOLUNTEERS_FAILED';
export const NO_VOLUNTEERS_REGISTERED = 'NO_VOLUNTEERS_REGISTERED';

/**
 * Gets the top volunteers fromt he db.
 * @function
 * @param {Dispatch} dispatch
 */
export const getTopVolunteers = (dispatch) => {
  store.collection('users').limit(20).get().then(res => {
    if (!res.empty){
      const volunteers = [];
      res.forEach(data => {
        const volunteer = data.data();
        volunteer.uid = data.id;
        volunteers.push(volunteer);
      });
      
      dispatch(action(GET_TOP_VOLUNTEERS, volunteers));
    }else{
      dispatch(action(NO_VOLUNTEERS_REGISTERED));
    }
  }).catch(err => {
    console.log(err);
    dispatch(action(GET_TOP_VOLUNTEERS_FAILED, err.message));
  });
};