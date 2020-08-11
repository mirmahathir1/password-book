<template>
    <b-jumbotron bg-variant="dark" text-variant="light" border-variant="secondary" data-aos="fade-down">
        <h4>Login</h4>
        <b-form>

<!--            EMAIL INPUT-->
            <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="input-1"
            >
                <b-form-input
                        id="input-1"
                        v-model="email"
                        type="email"
                        required
                        placeholder="Enter email"
                        class="bg-dark text-white"
                        @blur="$v.email.$touch()"
                        :state="isEmailValid"
                        aria-describedby="email-feedback"
                ></b-form-input>
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
            <b-button variant="outline-primary" class="mr-3" @click="enterClicked" :disabled="$store.getters.getSignInFlag || $v.$anyError">
                <span v-if="!$store.getters.getSignInFlag">Log In</span>
                <template v-else>
                    <b-spinner small></b-spinner>
                    <span>Logging in...</span>
                </template>
            </b-button>

<!--            RESET BUTTON-->
            <b-button type="reset" variant="outline-danger" @click="$v.$reset()">Reset</b-button>

        </b-form>
    </b-jumbotron>
</template>

<script>
    import {required, email} from 'vuelidate/lib/validators'

    export default {
        name: "Login",
        data: function () {
            return {
                email: '',
                password: '',
            }
        },
        computed:{
            isEmailValid(){
                if(!this.$v.email.$dirty){
                    return null;
                }
                if(this.$v.email.$error){
                    return false;
                }
            },
            isPasswordValid(){
                if(!this.$v.password.$dirty){
                    return null;
                }
                if(this.$v.password.$error){
                    return false;
                }
            },
        },
        validations:{
            email: {
                required,
                email
            },
            password:{
                required,
            }
        },
        methods: {
            enterClicked() {
                // this.email = 'mirmahathir1@gmail.com';
                this.email = 'azadsumaiya00@gmail.com';
                this.password = '123456';

                // CHECK WHETHER FORM INPUTS HAVE ANY ERRORS
                this.$v.$touch();
                if (this.$v.$anyError) {
                    return;
                }

                //CHECK WHETHER THE USER HAS GIVEN A FIREBASE API KEY
                if(!this.$store.getters.isAPIAvailable){
                    this.$store.dispatch("notify","Please specify firebase API key before signing in");
                    this.$router.push({name:'Firebase'});
                    return;
                }

                // CONTINUE LOGGING IN
                this.$store.dispatch('login', {email:this.email,password:this.password});
            }
        }
    }
</script>

<style scoped>

</style>