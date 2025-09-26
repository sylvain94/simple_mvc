import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Initialize theme before anything else to prevent FOUC (Flash of Unstyled Content)
function initThemeEarly() {
  const savedTheme = localStorage.getItem('theme');
  let theme = 'light'; // default
  
  if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
    theme = savedTheme;
  } else {
    // Use system preference if no saved theme
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme immediately
  const effectiveTheme = theme === 'auto' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
    
  document.documentElement.setAttribute('data-theme', effectiveTheme);
  
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}

// Initialize theme early
initThemeEarly();

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
