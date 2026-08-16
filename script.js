
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const cards = [...document.querySelectorAll('.product-card')];
const noResults = document.getElementById('noResults');

function runSearch(term) {
  const q = term.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const haystack = (card.dataset.keywords + ' ' + card.innerText).toLowerCase();
    const show = !q || haystack.includes(q) || q.split(/\s+/).some(word => haystack.includes(word));
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  noResults.hidden = visible !== 0;
  document.getElementById('deals').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  runSearch(searchInput.value);
});

document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    const term = button.dataset.search;
    searchInput.value = term;
    runSearch(term);
  });
});

document.querySelectorAll('.deal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('This is a demo deal button. Live retailer links will be connected in the next phase.');
  });
});
