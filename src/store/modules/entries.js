import axios from 'axios';
import {getUserSpecificEntries} from "../../mixins";

let baseURL = 'https://password-note.firebaseio.com';

const state = {
    //FLAGS
    entrySaveFlag: false,
    allEntryLoadingFlag: false,
    entryDeletionFlag: false,

    //STORAGE
    entries: {},
};
const mutations = {
    loadingOn(state){
        state.entrySaveFlag = true;
    },
    loadingOff(state){
        state.entrySaveFlag = false;
    },
    allEntryLoadingFlagOn(state){
        state.allEntryLoadingFlag = true;
    },
    allEntryLoadingFlagOff(state){
        state.allEntryLoadingFlag = false;
    },
    setEntries(state,entries){
        state.entries = entries;
    },
    entryDeletionFlagOn(state){
        state.entryDeletionFlag=true;
    },
    entryDeletionFlagOff(state){
        state.entryDeletionFlag=false;
    },
    resetEntries(state){
        state.entries = {};
    }
};
const actions = {
    saveNewEntryLocal({commit,getters,dispatch},payload){
        let entries = {...getters.getEntries};
        entries[payload.entryId]=payload.entry;
        commit('setEntries',entries);
    },
    saveNewEntry({commit,getters,dispatch}, entry) {
        commit('loadingOn');
        axios.post(baseURL+'/entries/'+getters.userId+'.json?auth='+getters.getToken,entry)
            .then((response)=>{
                dispatch('notify',"Successfully saved new entry");
                dispatch('saveNewEntryLocal',{entry:entry,entryId:response.data.name});
                console.log(response);
                this.$vm.$bvModal.hide('modal');
            })
            .catch((error)=>{
                dispatch('notify',"Couldn't save new entry");
                console.log(error);
            })
            .finally(()=>{
                commit('loadingOff');
            });
    },
    getEntries({commit,getters,dispatch}){
        commit('allEntryLoadingFlagOn');
        axios.get(baseURL+'/entries/'+getters.userId+'.json?auth='+getters.getToken)
            .then((response)=>{
                console.log(response);
                if(response.data!==null) {
                    commit('setEntries', response.data);
                }
                // commit('setEntries',getUserSpecificEntries(response.data,getters.userId));
            })
            .catch((error)=>{
                dispatch('notify',"Couldn't load existing entries");
                console.log(error);
            })
            .finally(()=>{
                commit('allEntryLoadingFlagOff');
            });
    },

    deleteEntryLocal({commit,getters,dispatch},entryId){
        let entries = {...getters.getEntries};
        delete entries[entryId];
        commit('setEntries',entries);
    },

    deleteEntry({commit,getters,dispatch},entryId){
        commit('entryDeletionFlagOn');
        axios.delete(baseURL+'/entries/'+getters.userId+"/"+entryId+'.json?auth='+getters.getToken)
            .then((response)=>{
                dispatch('notify',"Successfully deleted entry");
                dispatch('deleteEntryLocal',entryId);
                console.log(response);
                this.$vm.$bvModal.hide('modal');
            })
            .catch((error)=>{
                dispatch('notify',"Couldn't delete entry");
                console.log(error);
            })
            .finally(()=>{
                commit('entryDeletionFlagOff');
            });
    },
    editEntryLocal({commit,getters,dispatch},editedEntry){
        let entries = {...getters.getEntries};
        entries={...entries,...editedEntry};
        // entries[Object.keys(editedEntry)[0]]=editedEntry[Object.keys(editedEntry)[0]]
        commit('setEntries',entries);
    },

    editEntry({commit,getters,dispatch},editedEntry){
        commit('loadingOn');
        axios.patch(baseURL+'/entries/'+getters.userId+'.json?auth='+getters.getToken,editedEntry)
            .then((response)=>{
                dispatch('editEntryLocal',editedEntry);
                dispatch('notify',"Successfully edited entry");
                console.log(response);
                this.$vm.$bvModal.hide('modal');
            })
            .catch((error)=>{
                dispatch('notify',"Couldn't edit entry");
                console.log(error);
            })
            .finally(()=>{
                commit('loadingOff');
            })
    },
    resetEntries({commit,getters,dispatch}){
        commit('resetEntries');
    }
};
const getters = {
    getEntrySaveFlag: state => {
        return state.entrySaveFlag;
    },
    getAllEntryLoadingFlag:state =>{
        return state.allEntryLoadingFlag;
    },
    getEntries: state =>{
        return state.entries;
    },
    getEntryDeletionFlag: state =>{
        return state.entryDeletionFlag;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}