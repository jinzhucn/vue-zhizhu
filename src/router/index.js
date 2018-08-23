import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login';
import Home from '../components/Home';
import Student from '../components/Student';
import Repair from '../components/Repair';
import Dormitory from '../components/Dormitory';
import Problem from '../components/Problem';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/index',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/index/student',
          name: 'Student',
          component: Student,
        },
        {
          path: '/index/repair',
          name: 'Repair',
          component: Repair,
        },
        {
          path: '/index/dormitory',
          name: 'Dormitory',
          component: Dormitory,
        },
        {
          path: '/index/problem',
          name: 'Problem',
          component: Problem,
        },
      ],
    },
  ],
});

