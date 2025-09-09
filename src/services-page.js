// Progressive enhancement: add glass skin to service cards after DOM ready
(function(){
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply); } else { apply(); }
  function apply(){
    document.querySelectorAll('.services .card, .services .service-card, .services .section-card, .services .panel, .services .block, .services .box')
      .forEach(el => el.classList.add('card--glass'));
  }
})();
