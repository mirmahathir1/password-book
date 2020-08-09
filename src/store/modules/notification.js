const state = {

};
const mutations = {

};
const actions = {
    notify({commit, getters}, message) {
        this.$vm.$bvModal.msgBoxOk(message, {
            title: "Message",
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'success',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
            bodyTextVariant:"light",
            bodyBgVariant:"dark",
            headerTextVariant:"light",
            headerBgVariant:"dark" ,
            headerBorderVariant:"secondary",
            footerBgVariant:"dark",

        })
            .then(value => {
                this.boxTwo = value
            })
            .catch(err => {
                // An error occurred
            })
    }
};
const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}