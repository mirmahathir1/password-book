<template>
    <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-navbar-brand :to="'/home'">Password Book</b-navbar-brand>
        <b-button pill variant="outline-light" v-if="$route.name==='Home'" :disabled="$store.getters.getAllEntryLoadingFlag" @click="$store.dispatch('getEntries')">
            <b-icon icon="arrow-clockwise"></b-icon>
        </b-button>
<!--        <b-button @click="$store.dispatch('getEntries')">Demo Button</b-button>-->


        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item right :to="'/firebase'">Firebase</b-nav-item>
                <b-nav-item right :to="'/about'">About</b-nav-item>
                <template v-if="$store.getters.isLoggedIn">
                    <b-nav-item right :to="'/profile'">Profile</b-nav-item>
                    <b-nav-item right @click="signOutClicked">Sign Out</b-nav-item>
                </template>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        name: "NavigationBar",
        methods: {
            signOutClicked() {
                this.$store.dispatch('logout');

            }
        }
    }
</script>

<style scoped>

</style>