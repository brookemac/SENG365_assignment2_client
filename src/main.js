import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus';
import axios from 'axios';
import App from './App.vue'
import Home from './Home.vue';
import Events from './Events.vue';
import Event from './Event.vue';
import Users from './Users.vue';
import UserEvents from './UserEvents.vue';

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
        redirect: "/events"
    },
    {
        path: "/events/:eventId",
        name: "event",
        component: Event
    },
    {
        path: "/users/:userId",
        name: "user",
        component: Users
    },
    {
        path: "/events",
        name: "events",
        component: Events
    },
    {
        path: "/myevents/:userId",
        name: "UserEvents",
        component: UserEvents
    }
];

const router = createRouter ({
    routes,
    history: createWebHistory()
});

const app = createApp(App);

app.use(ElementPlus)
app.use(router);
app.config.globalProperties.axios = axios;
app.mount('#app');
