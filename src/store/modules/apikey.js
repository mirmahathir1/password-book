const state = {
    apiKey:null,
};
const mutations = {
    saveAPIKey(state,apiKey){
        state.apiKey = apiKey;
    },
    resetAPIKey(state){
        state.apiKey=null;
    }
};
const actions = {
    resetAPI({commit,getters,dispatch}) {
        commit('resetAPIKey');
        dispatch('logout');
    }
};
const getters = {
    getAPIKey: state => {
        return state.apiKey;
    },
    isAPIAvailable: state =>{
        return state.apiKey!==null;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}