import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from "../views/Login";
import Firebase from "../views/Firebase";
import Profile from "../views/Profile";
import store from '../store';

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/firebase',
        name: 'Firebase',
        component: Firebase
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: "*",
        redirect: '/login'
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to,from,next)=>{
    if((to.name=='Home' || to.name=='Profile') && !store.getters.isLoggedIn){
        next({name:'Login'});
    }else{
        next();
    }
});

export default router
