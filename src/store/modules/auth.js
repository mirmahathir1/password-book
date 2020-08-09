import axios from "axios";
import router from '../../router'
const state = {
    //STORAGE
    idToken: null,
    userId: null,
    password: null,
    email:null,

    //FLAGS
    signInFlag:false,
    passwordChangeFlag: false,
};
const mutations = {
    authUser(state,userData){
        state.idToken = userData.token;
        state.userId = userData.userId;
        state.password = userData.password;
        state.email = userData.email;
    },
    resetAuth(state){
        state.idToken = null;
        state.userId = null;
        state.password= null;
        state.email= null;
    },
    signInFlagOn(state){
        state.signInFlag=true;
    },
    signInFlagOff(state){
        state.signInFlag = false;
    },
    passwordChangeFlagOn(state){
        state.passwordChangeFlag=true;
    },
    passwordChangeFlagOff(state){
        state.passwordChangeFlag=false;
    }
};
const actions = {
    login({commit,getters,dispatch}, authData) {
        commit('signInFlagOn');
        axios.post('/v1/accounts:signInWithPassword?key=' + getters.getAPIKey, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
        })
            .then((response) => {
                console.log(response);

                //save the token to vuex
                commit('authUser', {
                    token: response.data.idToken,
                    userId: response.data.localId,
                    password: authData.password,
                    email: authData.email
                });

                // redirect user to home after successful login
                router.push({name:'Home'});
                dispatch('getEntries');
            })
            .catch((error) => {
                console.log(error.response);
                if(error.response && error.response.data && error.response.data.error && error.response.data.error.message ) {
                    dispatch('notify', error.response.data.error.message);
                }else{
                    dispatch('notify',error.response.statusText);
                }
            })
            .finally(()=>{
                commit('signInFlagOff');
            })
    },
    logout({commit,dispatch}){
        // reset token, email, password, userId and loaded entries
        commit('resetAuth');
        commit('resetEntries');

        //redirect user to login screen
        router.push({name: 'Login'});

        // notify user that he/she is logged out
        dispatch('notify',"You have been logged out");
    },
    resetPassword({commit,getters,dispatch},newPassword){
        //turn on spinner
        commit('passwordChangeFlagOn');

        axios.post('/v1/accounts:update?key=' + getters.getAPIKey, {
            idToken: getters.getToken,
            password: newPassword,
            returnSecureToken: true,
        })
            .then((response) => {
                console.log(response);

                // save the new created token
                commit('authUser', {
                    token: response.data.idToken,
                    userId: getters.userId,
                    password: newPassword,
                    email: getters.getEmail
                });

                // go back to home screen if password change is successful
                router.push({name:'Home'});

                // dispatch a notification for successful password change
                dispatch('notify',"Password changed succesfully");

            })
            .catch((error) => {
                console.log(error.response);
                if(error.response && error.response.data && error.response.data.error && error.response.data.error.message ) {
                    dispatch('notify', error.response.data.error.message);
                }else{
                    dispatch('notify',error.response.statusText);
                }
            })
            .finally(()=>{
                commit('passwordChangeFlagOff');
            })
    }
};
const getters = {
    getToken: state => {
        return state.idToken;
    },
    isLoggedIn: state =>{
        return state.idToken!==null;
    },
    getPassword: state =>{
        return state.password
    },
    userId: state =>{
        return state.userId;
    },
    getSignInFlag: state=>{
        return state.signInFlag;
    },
    getPasswordChangeFlag: state=>{
        return state.passwordChangeFlag;
    },
    getEmail: state =>{
        return state.email;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}