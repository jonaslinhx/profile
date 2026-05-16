(function () {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');

  function activateTab(tabName) {
    tabButtons.forEach((btn) => {
      const active = btn.dataset.tab === tabName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      const active = panel.id === tabName;
      panel.classList.toggle('active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });

  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      activateTab(btn.dataset.tab);
    });
  });

  window.SiteTabs = { activateTab };
})();

(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  if (localStorage.getItem('theme') === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  if (btn) {
    btn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
})();
