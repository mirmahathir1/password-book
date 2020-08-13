<template>
    <b-jumbotron bg-variant="dark" text-variant="light" border-variant="secondary" data-aos="fade-down">
        <h4>Login</h4>
        <b-form v-if="email!=='NEW'">
            <!--            EMAIL INPUT-->
            <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="input-1"
                    v-if="email!=='NEW'"
            >

                <b-form-select v-model="email" :options="options" class="bg-dark text-white"
                               @blur="$v.email.$touch()"
                               :state="isEmailValid"
                               aria-describedby="email-feedback"
                >
                    <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Please select an option --
                        </b-form-select-option>
                    </template>
                    <b-form-select-option value="NEW">Enter new email</b-form-select-option>
                </b-form-select>

                <b-form-invalid-feedback id="email-feedback">
                    Enter valid email address
                </b-form-invalid-feedback>
            </b-form-group>
            <!--            PASSWORD INPUT-->
            <b-form-group
                    id="input-group-2"
                    label="Password"
                    label-for="input-2"
            >
                <b-form-input
                        id="input-2"
                        v-model="password"
                        type="password"
                        required
                        placeholder="Enter password"
                        class="bg-dark text-white"
                        @blur="$v.password.$touch()"
                        :state="isPasswordValid"
                        aria-describedby="password-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="password-feedback">
                    Enter a password
                </b-form-invalid-feedback>
            </b-form-group>

            <!--            LOGIN BUTTON-->
            <b-button variant="outline-primary" class="m-1" @click="enterClicked"
                      :disabled="$store.getters.getSignInFlag || $v.password.$error || $v.email.$error">
                <span v-if="!$store.getters.getSignInFlag">Log In</span>
                <template v-else>
                    <b-spinner small></b-spinner>
                    <span>Logging in...</span>
                </template>
            </b-button>

            <!--            REMOVE EMAIL BUTTON-->
            <b-button variant="outline-warning" class="m-1" v-if="email!==null" @click="removeEmail">Remove Email</b-button>

        </b-form>

        <b-form v-else>
            <b-form-group
                    v-if="email==='NEW'"
                    id="input-group-3"
                    label="Email address:"
                    label-for="input-3"

            >
                <b-form-input

                        id="input-3"
                        type="email"
                        required
                        placeholder="Enter new email"
                        class="bg-dark text-white"
                        v-model="newEmail"
                        @blur="$v.newEmail.$touch()"
                        :state="isNewEmailValid"
                        aria-describedby="newemail-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="newemail-feedback">
                    Enter a valid email
                </b-form-invalid-feedback>
            </b-form-group>

            <b-button type="reset" variant="outline-success" class="m-1" @click="saveNewEmail">Save Email</b-button>
            <b-button type="reset" variant="outline-danger" class="m-1" @click="cancelNewEmail">Cancel</b-button>
        </b-form>
    </b-jumbotron>
</template>

<script>
    import {required, email} from 'vuelidate/lib/validators'

    export default {
        name: "Login",
        data: function () {
            return {
                newEmail: null,
                email: null,
                password: null,
                selectedEmail: null,
                options: [

                ]
            }
        },
        mounted(){
            this.options = JSON.parse(localStorage.getItem('savedEmails'));
            // localStorage.setItem('savedEmails',JSON.stringify([]));

        },
        computed: {
            isNewEmailValid() {
                if (!this.$v.newEmail.$dirty) {
                    return null;
                }
                if (this.$v.newEmail.$error) {
                    return false;
                }
            },
            isEmailValid() {
                if (!this.$v.email.$dirty) {
                    return null;
                }
                if (this.$v.email.$error) {
                    return false;
                }
            },
            isPasswordValid() {
                if (!this.$v.password.$dirty) {
                    return null;
                }
                if (this.$v.password.$error) {
                    return false;
                }
            },
        },
        validations: {
            email: {
                required,
                email
            },
            newEmail: {
                required,
                email
            },
            password: {
                required,
            }
        },
        methods: {
            removeEmail(){
                this.options = this.options.filter((value)=>{ return value!==this.email;});
                localStorage.setItem('savedEmails',JSON.stringify(this.options));
                this.email=null;
            },
            saveNewEmail() {
                this.$v.newEmail.$touch();
                if (this.$v.newEmail.$error) {
                    return;
                }

                this.options.push(this.newEmail);

                localStorage.setItem('savedEmails',JSON.stringify(this.options));

                this.email = this.newEmail;
                this.newEmail = null;
            },
            cancelNewEmail() {
                this.newEmail = null;
                this.email = null;
            },
            enterClicked() {
                // this.email = 'mirmahathir1@gmail.com';
                // this.email = 'azadsumaiya00@gmail.com';
                // this.password = '123456';

                // CHECK WHETHER FORM INPUTS HAVE ANY ERRORS
                this.$v.email.$touch();
                this.$v.password.$touch();
                if (this.$v.email.$error || this.$v.password.$error) {
                    return;
                }

                //CHECK WHETHER THE USER HAS GIVEN A FIREBASE API KEY
                if (!this.$store.getters.isAPIAvailable) {
                    this.$store.dispatch("notify", "Please specify firebase API key before signing in");
                    this.$router.push({name: 'Firebase'});
                    return;
                }

                // CONTINUE LOGGING IN
                this.$store.dispatch('login', {email: this.email, password: this.password});
            }
        }
    }
</script>

<style scoped>

</style>