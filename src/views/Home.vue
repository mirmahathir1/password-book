<template>
    <div role="tablist">
        <!--        NEW ENTRY-->
        <b-card no-body class="mb-1" bg-variant="dark" text-variant="light" border-variant="secondary" align="center">
            <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle="'accordion'" variant="info">NEW ENTRY</b-button>
            </b-card-header>
            <b-collapse :id="'accordion'" accordion="my-accordion" role="tabpanel">
                <b-card-footer>
                    <b-button variant="outline-primary" class="mr-3"
                              @click="editClicked(null,{title:null,password:null,username:null})">New Entry
                    </b-button>
                </b-card-footer>
            </b-collapse>
        </b-card>

        <!--        SPINNER FOR LOADING ALL ENTRIES-->
        <b-card no-body class="mb-1" bg-variant="dark"
                text-variant="light" border-variant="secondary" v-if="$store.getters.getAllEntryLoadingFlag">
            <b-card-body>
                <b-card-text>
                    <div class="d-flex justify-content-center mb-3">
                        <b-spinner label="Loading..."></b-spinner>
                    </div>
                </b-card-text>
            </b-card-body>
        </b-card>

        <!--        EXISTING ENTRY-->
        <template v-else>
            <b-card no-body class="mb-1" v-for="(key,index) in Object.keys($store.getters.getEntries)" :key="key"
                    bg-variant="dark"
                    text-variant="light" border-variant="secondary">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle="'accordion'+index" variant="dark">
                        {{$store.getters.getEntries[key].title}}
                    </b-button>
                </b-card-header>
                <b-collapse :id="'accordion'+index" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <b-card-text>{{$store.getters.getEntries[key].username}}</b-card-text>
                    </b-card-body>
                    <b-card-footer>
                        <b-button v-if="$store.getters.getEntries[key].username" variant="outline-primary" class="mr-3"
                                  v-clipboard="$store.getters.getEntries[key].username">
                            Username
                        </b-button>
                        <b-button variant="outline-primary" class="mr-3"
                                  v-clipboard="$store.getters.getEntries[key].password">Password
                        </b-button>
                        <b-button variant="outline-primary" class="mr-3"
                                  @click="editClicked(key,$store.getters.getEntries[key])">Edit
                        </b-button>
                    </b-card-footer>
                </b-collapse>
            </b-card>
        </template>

        <!--        FORM MODAL-->
        <b-modal body-bg-variant="dark" header-bg-variant="dark" header-border-variant="secondary"
                 header-text-variant="light" body-text-variant="light" :id="'modal'" ref="modal" title="Edit"
                 hide-footer>
            <b-form>
                <b-form-group
                        id="input-group-1"
                        label="Title:"
                        label-for="input-1"
                >
                    <b-form-input
                            id="input-1"
                            v-model="form.title"
                            type="text"
                            required
                            placeholder="Enter Title"
                            class="bg-dark text-white"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                        id="input-group-2"
                        label="Enter Username:"
                        label-for="input-2"
                >
                    <b-form-input
                            id="input-2"
                            v-model="form.username"
                            type="text"
                            required
                            placeholder="Username"
                            class="bg-dark text-white"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                        id="input-group-3"
                        label="New Password"
                        label-for="input-3"
                >
                    <b-form-input
                            id="input-3"
                            v-model="form.newPassword"
                            type="password"
                            placeholder="Enter New Password"
                            class="bg-dark text-white"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                        id="input-group-4"
                        label="Confirm New Password"
                        label-for="input-4"
                >
                    <b-form-input
                            id="input-4"
                            v-model="form.confirmPassword"
                            type="password"
                            placeholder="Confirm New Password"
                            class="bg-dark text-white"
                    ></b-form-input>
                </b-form-group>

                <b-button class="mr-3" @click="$bvModal.hide('modal')" variant="outline-warning">Close</b-button>

<!--                SAVE ENTRY-->
                <b-button class="mr-3" variant="outline-success" @click="saveEntry"
                          :disabled="$store.getters.getEntrySaveFlag">
                    <span v-if="!$store.getters.getEntrySaveFlag">Save</span>
                    <template v-else>
                        <b-spinner small></b-spinner>
                        <span>Saving...</span>
                    </template>
                </b-button>

<!--                DELETE ENTRY-->
                <b-button variant="outline-danger" v-b-modal.deletion-modal>Delete</b-button>
                <b-modal id="deletion-modal" title="Confirm Deletion" hide-footer body-bg-variant="dark"
                         header-bg-variant="dark" header-border-variant="secondary"
                         header-text-variant="light" body-text-variant="light">
                    <p class="my-4">Are you sure you want to delete?</p>
                    <b-button class="mr-3" variant="outline-warning">Cancel</b-button>

                    <b-button variant="outline-danger" @click="deleteEntry" :disabled="$store.getters.getEntryDeletionFlag">
                        <span v-if="!$store.getters.getEntryDeletionFlag">Delete</span>
                        <template v-else>
                            <b-spinner small></b-spinner>
                            <span>Deleting...</span>
                        </template>
                    </b-button>
                </b-modal>

            </b-form>
        </b-modal>
    </div>

</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Home',
        data: function () {
            return {
                form: {
                    title: null,
                    username: null,
                    password: null,
                    newPassword: null,
                    confirmPassword: null,
                },
                entryId: null,
            }
        },
        methods: {
            saveEntry() {
                // console.log(this.entryId);
                if (this.entryId === null) {
                    this.saveNewEntry();
                }else{
                    this.saveEditedEntry();
                }

            },
            saveEditedEntry(){
                let editedPassword = this.form.password;
                if(this.form.newPassword!==null){
                    editedPassword = this.form.newPassword
                }

                let editedEntry={
                    [this.entryId]:{
                        title:this.form.title,
                        username:this.form.username,
                        password:editedPassword,
                    }
                }
                this.$store.dispatch('editEntry',editedEntry)
            },
            deleteEntry() {
                this.$store.dispatch('deleteEntry',this.entryId);

            },
            editClicked(entryId,entry) {
                this.form.title = entry.title;
                this.form.username = entry.username;
                this.form.password = entry.password;
                this.entryId = entryId;
                this.form.newPassword = null;
                this.form.confirmPassword = null;
                this.$bvModal.show('modal')
            },
            saveNewEntry() {
                let data = {

                    title: this.form.title,
                    username: this.form.username,
                    password: this.form.newPassword,
                }
                this.$store.dispatch('saveNewEntry', data);
            }
        },
        mounted() {
            this.$store.dispatch('getEntries');
        }
    }
</script>
