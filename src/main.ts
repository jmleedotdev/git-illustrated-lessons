import { createApp } from 'vue'
import App from './App.vue'
import { createCourseRouter } from '@/router'
import '@/assets/css/main.css'

const app = createApp(App)
app.use(createCourseRouter())

app.mount('#app')
