import axios from "axios";
import router from '../../router'
const state = {
    //STORAGE
    idToken: null,
    userId: null,
    password: null,

    //FLAGS
    signInFlag:false,
    passwordChangeFlag: false,
};
const mutations = {
    authUser(state,userData){
        state.idToken = userData.token;
        state.userId = userData.userId;
        state.password = userData.password;
    },
    resetAuth(state){
        state.idToken = null;
        state.userId = null;
        state.password= null;
    },
    changePassword(state,newPassword){
        state.password = newPassword;
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
                commit('authUser', {
                    token: response.data.idToken,
                    userId: response.data.localId,
                    password: authData.password,
                });
                router.push({name:'Home'});
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
        commit('resetAuth');
        commit('resetEntries');
        router.push({name: 'Login'});
        dispatch('notify',"You have been logged out");
    },
    resetPassword({commit,getters,dispatch},newPassword){
        commit('passwordChangeFlagOn');
        console.log("Newpassword:",newPassword);
        axios.post('/v1/accounts:update?key=' + getters.getAPIKey, {
            idToken: getters.getToken,
            password: newPassword,
            returnSecureToken: false,
        })
            .then((response) => {
                console.log(response);
                commit('changePassword',newPassword);
                router.push({name:'Home'});
                dispatch('notify',"Password changed succesfully");
                // commit('authUser', {
                //     token: response.data.idToken,
                //     userId: response.data.localId,
                //     password: authData.password,
                // });
                // router.push({name:'Home'});
            })
            .catch((error) => {
                dispatch('notify',"Password change unsuccessful");
                // console.log(error.response.statusText);
                // dispatch('notify',error.response.statusText);
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
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}