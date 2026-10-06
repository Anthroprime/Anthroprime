(() => {
 const clear = document.querySelector('[data-clear-preferences]');
 if (!clear) return;
 clear.addEventListener('click', () => {
  try {
   ['ap-theme', 'ap-effects-paused', 'ap-motion-paused', 'ap-checklists'].forEach(key => localStorage.removeItem(key));
   document.querySelector('[data-preferences-status]').textContent = 'Saved preferences cleared. Current display settings remain until you change them or reload.';
  } catch {
   document.querySelector('[data-preferences-status]').textContent = 'Browser storage is unavailable. Use your browser’s site-data settings to clear saved preferences.';
  }
 });
})();
