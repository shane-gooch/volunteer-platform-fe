import {action} from './action';
import {deleteFile} from './files';
import firebase, {store} from '../firebase/FirebaseConfig';

/**
 * Auth Actions
 * @module actions/organizations
 *
 */

export const CREATED_ORGANIZATION = 'CREATED_ORGANIZATION';
export const CREATE_ORGANIZATION_INIT = 'CREATE_ORGANIZATION_INIT';
export const CREATE_ORGANIZATION_FAIL = 'CREATE_ORGANIZATION_FAIL';

/**
 * Register a new non profit organization.
 * @function
 * @param {Organization} org - non profit to be registered
 * @param {Dispatch} dispatch
 */
export const registerOrganization = (org, dispatch) => {
  dispatch( { type: CREATE_ORGANIZATION_INIT } );
  store
    .collection('organizations')
    .add(org)
    .then(res => {
      console.log(res);
      dispatch( action( CREATED_ORGANIZATION ) );
    })
    .catch(err => {
      console.log(err);
      dispatch( { type: CREATE_ORGANIZATION_FAIL } );
    });
};

export const GET_USER_ORGANIZATIONS = 'GET_USER_ORGANIZATIONS';
export const GET_USER_ORGANIZATIONS_FAILED = 'GET_USER_ORGANIZATIONS_FAILED';
export const USER_HAS_NO_ORGANIZATIONS = 'USER_HAS_NO_ORGANIZATIONS';

/**
 * Gets all the users organizations
 * @function
 * @param {string} uid User unique id from google auth.
 * @param {Dispatch} dispatch From useStateValue hook
 */
export const subscribeToUserOrganizations = (uid, dispatch) => {
  store
    .collection('organizations')
    .where('organizationOwnerUID', '==', uid)
    .onSnapshot(snapShot => {
      const orgs = [];
      if (!snapShot.empty){
        localStorage.setItem('createdOrg', 'true');
      }else{
        localStorage.setItem('createdOrg', 'false');
      }
      snapShot.forEach(doc => {
        const org = doc.data();
        org.orgId = doc.id;
        orgs.push(org);
      });
      dispatch(action(GET_USER_ORGANIZATIONS, orgs));
    });
  
};

export const GET_ORG_BY_ID = 'GET_ORG_BY_ID';
export const GET_ORG_BY_ID_FAILED = 'GET_ORG_BY_ID_FAILED';

/**
 * Get Organization by org_id
 * @param {String} orgId
 * @param {Dispatch} dispatch
 */
export const getOrganizationByOrgId = (orgId, dispatch) => {
  store
    .collection('organizations')
    .doc(orgId)
    .get()
    .then(res => {
      if (res.exists){
        const org = res.data();
        org.id = res.id;
        dispatch(action(GET_ORG_BY_ID, org));
      }
    });
};

export const UPDATE_ORGANIZATION_INIT = 'UPDATE_ORGANIZATION_INIT';
export const UPDATE_ORGANIZATION_SUCCESS = 'UPDATE_ORGANIZATION_SUCCESS';
export const UPDATE_ORGANIZATION_FAIL = 'UPDATE_ORGANIZATION_FAIL';

/**
 * Update an organization in the db
 * @function
 * @param {String} orgId
 * @param {Organization} updates
 * @param {Dispatch} dispatch
 */

 export const updateOrganization = (orgId, updates, dispatch) => {
  dispatch( { type: UPDATE_ORGANIZATION_INIT } );
  store.collection('organizations')
    .doc(orgId)
    .set(updates)
    .then(res => {
      console.log('success updating organization');
      dispatch( { type:  UPDATE_ORGANIZATION_SUCCESS } );
    })
    .catch(err => {
      console.log('error updating organization');
      dispatch( { type:  UPDATE_ORGANIZATION_FAIL } );
    });
};

export const DELETE_ORG = 'DELETE_ORG';
export const DELETE_ORG_FAILED = 'DELETE_ORG_FAILED';

/**
 * Delete an organization in the db
 * @function
 * @param {String} orgId
 * @param {Dispatch} dispatch
 */
export const deleteOrganization = (orgId, dispatch) => {
  store.collection('organizations')
    .doc(orgId)
    .delete()
    .then(res => {
      dispatch(action(DELETE_ORG, orgId));
    })
    .catch(err => {
      console.log(err);
      dispatch(action(DELETE_ORG_FAILED));
    });
};

/**
 * Delete an organization from the db.
 * @param {Organization} organization Organization to delete.
 */
export const deleteOrganizationImage = (organization) => {
  
  deleteFile(organization.imagePath);
  delete organization.imagePath;
  
  store.collection('organizations')
    .doc(organization.orgId)
    .set(organization).then(res => {
    
  }).catch(err => {
    console.log(err);
  });
};

export const GET_TOP_ORGANIZATIONS = 'GET_TOP_ORGANIZATIONS';
export const THERE_ARE_NO_ORGANIZATIONS = 'THERE_ARE_NO_ORGANIZATIONS';
export const GET_TOP_ORGANIZATIONS_FAILED = 'GET_TOP_ORGANIZATIONS_FAILED';

/**
 * Gets the top organizations to display on the front page.
 * @param {Dispatch} dispatch
 */
export const getTopOrganizations = (dispatch) => {
  store.collection('organizations').limit(20).get().then(res => {
    if (!res.empty){
      const topOrgs = [];
      res.forEach(org => {
        const data = org.data();
        data.orgId = org.id;
        
        topOrgs.push(data);
      });
      return dispatch(action(GET_TOP_ORGANIZATIONS, topOrgs));
    }
    return dispatch(action(THERE_ARE_NO_ORGANIZATIONS));
  }).catch(err => {
    console.log(err);
    dispatch(action(GET_TOP_ORGANIZATIONS_FAILED, err.message));
  });
};