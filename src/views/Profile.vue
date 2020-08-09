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
                        v-model="form.newPassword"
                        type="password"
                        required
                        placeholder="Enter new password"
                        class="bg-dark text-white"
                ></b-form-input>
            </b-form-group>

            <b-form-group
                    id="input-group-2"
                    label="Confirm Password"
                    label-for="input-2"
            >
                <b-form-input
                        id="input-2"
                        v-model="form.confirmPassword"
                        type="password"
                        required
                        placeholder="Confirm new password"
                        class="bg-dark text-white"
                ></b-form-input>
            </b-form-group>


            <b-button variant="outline-primary" class="mr-3" @click="saveClicked" :disabled="$store.getters.getPasswordChangeFlag">
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

    export default {
        name: "Profile",
        data: () => {
            return {
                form: {
                    newPassword: null,
                    confirmPassword: null,
                }
            }
        },
        methods: {
            saveClicked() {
                // REPLACE THESE WITH VUELIDITY
                if(this.form.newPassword!=this.form.confirmPassword){
                    this.$store.dispatch('notify',"Passwords didn't match");
                    return;
                }
                if(this.form.newPassword.length<6){
                    this.$store.dispatch('notify',"Passwords must have minimum 6 characteres");
                    return;
                }

                this.$store.dispatch('resetPassword',this.form.newPassword);
            }
        }
    }
</script>

<style scoped>

</style>