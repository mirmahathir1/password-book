import router from "../../router";
const state = {

};
const mutations = {

};
const actions = {
    goToRoute({commit,getters,dispatch}, routerName) {
        router.push({name:routerName});
    }
};
const getters = {

};

export default {
    state,
    mutations,
    actions,
    getters
}