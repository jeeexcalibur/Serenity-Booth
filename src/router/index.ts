import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: () => import('../views/PrivacyView.vue'),
        },
        {
            path: '/layout',
            name: 'layout',
            component: () => import('../views/LayoutView.vue'),
        },
        {
            path: '/session/:layout',
            name: 'session',
            component: () => import('../views/SessionView.vue'),
        },
    ],
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router
