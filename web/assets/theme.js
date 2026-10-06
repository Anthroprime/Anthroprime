document.documentElement.classList.add('js');
try { const theme=localStorage.getItem('ap-theme'); document.documentElement.dataset.theme = ['dark','light'].includes(theme)?theme:'light'; } catch { /* Browser storage is optional. */ }
