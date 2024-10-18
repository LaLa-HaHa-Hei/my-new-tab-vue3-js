import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

if (typeof window !== 'undefined' && window.chrome && window.chrome.runtime) {
    console.log('扩展环境')
    window.environment = 'extension'
}
else {
    console.log('网页环境')
    window.environment = 'web'
}

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
