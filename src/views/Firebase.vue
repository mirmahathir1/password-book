<template>
    <b-jumbotron border-variant="secondary" bg-variant="dark" text-variant="light" data-aos="fade-down">

            <h4>Firebase Settings</h4>

<!--            FORM FIELD IF NO API KEY IS FOUND-->
            <b-form v-if="!$store.getters.isAPIAvailable">
                <b-form-group
                        id="input-group-2"
                        label="Firebase API Key"
                        label-for="input-2"
                >
                    <b-form-input
                            id="input-2"
                            v-model="apiKey"
                            type="password"
                            required
                            placeholder="Enter api key"
                            class="bg-dark text-white"
                            @blur="$v.apiKey.$touch()"
                            :state="isAPIKeyValid"
                            aria-describedby="key-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="key-feedback">
                        Enter an API key
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-button variant="outline-primary" class="mr-3" @click="enterClicked" :disabled="$v.$anyError">Save New Key</b-button>
            </b-form>

<!--            FORM IS AN API IS BEING USED-->
            <b-form v-else>
                <b-form-group
                        label="An API key is being used"
                ></b-form-group>
                <b-button variant="outline-danger" @click="resetClicked">Reset API Key</b-button>
            </b-form>


    </b-jumbotron>
</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    export default {
        name: "Firebase",
        data: () => {
            return {
                apiKey: null,
            }
        },
        validations:{
            apiKey: {
                required
            },
        },
        computed:{
            isAPIKeyValid(){
                if(!this.$v.apiKey.$dirty){
                    return null;
                }
                if(this.$v.apiKey.$error){
                    return false;
                }
            },
        },
        methods: {
            enterClicked() {
                // CHECK WHETHER THE API KEY IS GIVEN
                this.$v.$touch();
                if (this.$v.$anyError) {
                    return;
                }

                // SAVE NEW API KEY TO LOCAL STORAGE AND VUEX
                localStorage.setItem("apiKey", this.apiKey);
                this.$store.commit('saveAPIKey', this.apiKey);
                this.$router.push({name:'Login'});
                this.$store.dispatch('notify',"New API Key is being used");
            },
            resetClicked(){
                this.$store.dispatch('resetAPI');
            }
        }
    }
</script>

<style scoped>

</style>