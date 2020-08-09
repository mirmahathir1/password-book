<template>
    <b-jumbotron bg-variant="dark" text-variant="light" border-variant="secondary">
        <h4>Profile</h4>
        <b-form>
            <b-form-group
                    id="input-group-1"
                    label="New Password"
                    label-for="input-1"
            >
                <b-form-input
                        id="input-1"
                        v-model="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        class="bg-dark text-white"
                        @blur="$v.newPassword.$touch()"
                        :state="isPasswordValid"
                        aria-describedby="password-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="password-feedback">
                    Password must have minimum 6 characters
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
                    id="input-group-2"
                    label="Confirm Password"
                    label-for="input-2"
            >
                <b-form-input
                        id="input-2"
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        class="bg-dark text-white"
                        @blur="$v.confirmPassword.$touch()"
                        :state="isConfirmPasswordValid"
                        aria-describedby="password-feedback2"
                ></b-form-input>
                <b-form-invalid-feedback id="password-feedback2">
                    Passwords must match
                </b-form-invalid-feedback>
            </b-form-group>


            <b-button variant="outline-primary" class="mr-3" @click="saveClicked" :disabled="$store.getters.getPasswordChangeFlag || $v.$anyError">
                <span v-if="!$store.getters.getPasswordChangeFlag">Change Password</span>
                <template v-else>
                    <b-spinner small></b-spinner>
                    <span>Changing...</span>
                </template>
            </b-button>
            <b-button type="reset" variant="outline-danger" to="/home">Discard Changes</b-button>
        </b-form>
    </b-jumbotron>
</template>

<script>
    import {minLength,required,sameAs} from 'vuelidate/lib/validators'

    export default {
        name: "Profile",
        data: () => {
            return {
                newPassword: null,
                confirmPassword: null,
            }
        },
        computed:{
            isPasswordValid(){
                if(!this.$v.newPassword.$dirty){
                    return null;
                }
                if(this.$v.newPassword.$error){
                    return false;
                }
            },
            isConfirmPasswordValid(){
                if(!this.$v.confirmPassword.$dirty){
                    return null;
                }
                if(this.$v.confirmPassword.$error){
                    return false;
                }
            },
        },
        validations:{
            newPassword:{
                required,
                minLen: minLength(6)
            },
            confirmPassword:{
                sameAs: sameAs('newPassword')
            }
        },
        methods: {
            saveClicked() {
                // CHECK WHETHER FORM INPUTS HAVE ANY ERRORS
                this.$v.$touch();
                if (this.$v.$anyError) {
                    return;
                }


                this.$store.dispatch('resetPassword',this.newPassword);
            }
        }
    }
</script>

<style scoped>

</style>