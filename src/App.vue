<template>
    <div id="app" align="center" class="bg-dark" style="min-height:100vh;">
        <NavigationBar></NavigationBar>
        <b-col lg="4" align="left" class="mt-3"><router-view/></b-col>
    </div>
</template>
<script>
    import NavigationBar from "./components/NavigationBar";
    import {Plugins} from '@capacitor/core';
    import {decryptWithAES, encryptWithAES} from "./crypto";
    export default {
        components: {
            NavigationBar,
        },
        data: function () {
            return {}
        },
        mounted() {
            let encrypted = encryptWithAES("mahathir","123");

            console.log(decryptWithAES(encrypted,"123"));

            encrypted = encryptWithAES("mahathir","123");

            console.log(decryptWithAES(null,"123"));

            console.log(decryptWithAES(null,"123"));



            this.fetchAPIKey();
            document.addEventListener("backbutton", this.yourCallBackFunction, false);
        },
        beforeDestroy () {
            document.removeEventListener("backbutton", this.yourCallBackFunction);
        },
        methods: {
            fetchAPIKey() {
                this.$store.commit('saveAPIKey', localStorage.getItem("apiKey"));
            },
            yourCallBackFunction () {
                if(this.$route.path==="/login"){
                    Plugins.App.exitApp();
                }else{
                    this.$router.go(-1);
                }
            }
        }
    }
    // NOTES TO REMEMBER,
    // MAKE SURE TO FETCH ALL DATA THOUGH VUEX
    //
</script>
<style>

</style>
