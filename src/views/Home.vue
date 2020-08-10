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
                                  @click="copyUsername(key)">
                            Username
                        </b-button>
                        <b-button variant="outline-primary" class="mr-3"
                                  @click="copyPassword(key)">
                            Password
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
                            v-model="title"
                            type="text"
                            required
                            placeholder="Enter Title"
                            class="bg-dark text-white"
                            @blur="$v.title.$touch()"
                            :state="isTitleValid"
                            aria-describedby="title-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="title-feedback">
                        Title must have more than 3 characters
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        id="input-group-2"
                        label="Enter Username:"
                        label-for="input-2"
                >
                    <b-form-input
                            id="input-2"
                            v-model="username"
                            type="text"
                            required
                            placeholder="Username"
                            class="bg-dark text-white"
                            @blur="$v.username.$touch()"
                            :state="isUsernameValid"
                            aria-describedby="username-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="username-feedback">
                        Username must have more than 3 characters
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        id="input-group-5"
                >
                    <b-form-checkbox id="input-5" v-model="changePasswordFlag" name="check-button" switch>
                        Change password
                    </b-form-checkbox>
                </b-form-group>
                <b-form-group
                        id="input-group-3"
                        label="New Password"
                        label-for="input-3"
                        v-if="changePasswordFlag"
                >
                    <b-form-input
                            id="input-3"
                            v-model="newPassword"
                            type="password"
                            placeholder="Enter New Password"
                            class="bg-dark text-white"
                            @blur="$v.newPassword.$touch()"
                            :state="isNewPasswordValid"
                            aria-describedby="newpassword-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="newpassword-feedback">
                        New password must have more than 3 characters
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        id="input-group-4"
                        label="Confirm New Password"
                        label-for="input-4"
                        v-if="changePasswordFlag"
                >
                    <b-form-input
                            id="input-4"
                            v-model="confirmPassword"
                            type="password"
                            placeholder="Confirm New Password"
                            class="bg-dark text-white"
                            @blur="$v.confirmPassword.$touch()"
                            :state="isConfirmPasswordValid"
                            aria-describedby="confirm-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="confirm-feedback">
                        Confirmation password must match
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-button class="mr-3" @click="$bvModal.hide('modal')" variant="outline-warning">Close</b-button>

                <!--                SAVE ENTRY-->
                <b-button class="mr-3" variant="outline-success" @click="saveEntry"
                          :disabled="$store.getters.getEntrySaveFlag || $v.$anyError">
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

                    <b-button variant="outline-danger" @click="deleteEntry"
                              :disabled="$store.getters.getEntryDeletionFlag">
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
    import {minLength, required, sameAs} from 'vuelidate/lib/validators'

    export default {
        name: 'Home',
        data: function () {
            return {

                title: null,
                username: null,
                password: null,
                newPassword: null,
                confirmPassword: null,
                entryId: null,

                changePasswordFlag: false,
            }
        },

        validations: {
            title: {
                required,
                minLen: minLength(4)
            },
            username: {
                required,
                minLen: minLength(4)
            },
            newPassword: {
                // required,
                minLen: minLength(4)
            },
            confirmPassword: {
                sameAs: sameAs('newPassword')
            }
        },

        computed: {
            isUsernameValid() {
                if (!this.$v.username.$dirty) {
                    return null;
                }
                if (this.$v.username.$error) {
                    return false;
                }
            },
            isTitleValid() {
                if (!this.$v.title.$dirty) {
                    return null;
                }
                if (this.$v.title.$error) {
                    return false;
                }
            },
            isNewPasswordValid() {
                if (!this.$v.newPassword.$dirty) {
                    return null;
                }
                if (this.$v.newPassword.$error) {
                    return false;
                }
            },
            isConfirmPasswordValid() {
                if (!this.$v.confirmPassword.$dirty) {
                    return null;
                }
                if (this.$v.confirmPassword.$error) {
                    return false;
                }
            }

        },

        methods: {
            copyUsername(key) {
                let self = this;
                this.$copyText(this.$store.getters.getEntries[key].username).then(function (e) {
                    self.$store.dispatch('notify',"Copied username");
                }, function (e) {
                    self.$store.dispatch('notify',"Can not copy username");
                })

            },
            copyPassword(key){
                let self = this;
                this.$copyText(this.$store.getters.getEntries[key].password).then(function (e) {
                    self.$store.dispatch('notify',"Copied password");
                }, function (e) {
                    self.$store.dispatch('notify',"Can not copy password");
                })
            },
            saveEntry() {
                // CHECK WHETHER FORM INPUTS HAVE ANY ERRORS
                this.$v.$touch();
                if (this.$v.$anyError) {
                    return;
                }

                if (this.entryId === null) {
                    this.saveNewEntry();
                } else {
                    this.saveEditedEntry();
                }

            },
            saveEditedEntry() {
                let editedPassword = this.password;
                if (this.newPassword !== null) {
                    editedPassword = this.newPassword
                }

                let editedEntry = {
                    [this.entryId]: {
                        title: this.title,
                        username: this.username,
                        password: editedPassword,
                    }
                }
                this.$store.dispatch('editEntry', editedEntry)
            },
            deleteEntry() {
                this.$store.dispatch('deleteEntry', this.entryId);
            },
            editClicked(entryId, entry) {
                this.title = entry.title;
                this.username = entry.username;
                this.password = entry.password;
                this.entryId = entryId;
                this.newPassword = null;
                this.confirmPassword = null;
                this.$bvModal.show('modal')
            },
            saveNewEntry() {
                let data = {

                    title: this.title,
                    username: this.username,
                    password: this.newPassword,
                }
                this.$store.dispatch('saveNewEntry', data);
            }
        },
        mounted() {

        }
    }
</script>
