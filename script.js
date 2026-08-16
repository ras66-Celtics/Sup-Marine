const SUPABASE_URL = 'https://psnowpjxhlghkclbimpy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wWNQq2WHj1wILFXjFlXozQ_61uJyep7';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const productGrid = document.getElementById('productGrid');
const noResults = document.getElementById('noResults');

let products = [];

async function loadProducts() {
  productGrid.innerHTML = '<p>Scanning for prices...</p>';

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/listing_price_summary?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Database error: ${response.status}`);
    }

    products = await response.json();

    renderProducts(products);

  } catch (error) {
    console.error(error);

    productGrid.innerHTML = `
      <p class="no-results">
        Sup-Marine couldn't retrieve pricing right now.
      </p>
    `;
  }
}

function renderProducts(items) {
  productGrid.innerHTML = '';

  const validProducts = items.filter(item => item.current_price !== null);

  if (!validProducts.length) {
    noResults.hidden = false;
    noResults.textContent = 'No live prices found yet.';
    return;
  }

  noResults.hidden = true;

  validProducts
    .sort((a, b) => Number(a.current_price) - Number(b.current_price))
    .forEach(item => {

      const badge = item.price_badge || 'Price recorded';

      const card = document.createElement('article');
      card.className = 'product-card';

      card.innerHTML = `
        <div class="badge">${badge}</div>

        <div class="product-art">
  ${
    item.product_image_url
      ? `<img
           src="${item.product_image_url}"
           alt="${item.brand} ${item.name}"
           class="product-image"
         >`
      : `${item.category ? item.category.substring(0, 4).toUpperCase() : 'SUP'}`
  }
</div>

   <p class="product-type">
  ${item.category || ''}
</p>

<div class="brand-row">
  <span>${item.brand}</span>
</div>

<h3>
  ${item.name}
</h3>

          <p class="retailer">
            ${item.retailer}
            ${item.flavour ? ` · ${item.flavour}` : ''}
            ${item.pack_size ? ` · ${item.pack_size}` : ''}
          </p>

          <div class="price-row">
            <strong>£${Number(item.current_price).toFixed(2)}</strong>
            <span>Current price</span>
          </div>

        <div class="price-history">
  ${
    item.price_per_100g !== null
      ? `<p>
           Price per 100g:
           <strong>£${Number(item.price_per_100g).toFixed(2)}</strong>
         </p>`
      : ''
  }

  ${
    item.price_per_serving !== null
      ? `<p>
           Price per serving:
           <strong>£${Number(item.price_per_serving).toFixed(2)}</strong>
         </p>`
      : ''
  }

  <p>
    Lowest recorded:
    <strong>£${Number(item.lowest_recorded_price).toFixed(2)}</strong>
  </p>

  <p>
    Highest recorded:
    <strong>£${Number(item.highest_recorded_price).toFixed(2)}</strong>
  </p>

  <p>
    Average:
    <strong>£${Number(item.average_recorded_price).toFixed(2)}</strong>
  </p>
</div>

          ${
            item.product_url
              ? `<a class="deal-btn" href="${item.product_url}" target="_blank" rel="noopener">
                   View deal
                 </a>`
              : ''
          }

        </div>
      `;

      productGrid.appendChild(card);
    });
}

function searchProducts(term) {
  const q = term.trim().toLowerCase();

  if (!q) {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(item => {
    const text = `
      ${item.brand || ''}
      ${item.name || ''}
      ${item.category || ''}
      ${item.retailer || ''}
      ${item.flavour || ''}
    `.toLowerCase();

    return text.includes(q);
  });

  renderProducts(filtered);

  document
    .getElementById('deals')
    .scrollIntoView({ behavior: 'smooth' });
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchProducts(searchInput.value);
});

document.querySelectorAll('[data-search]').forEach(button => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.search;
    searchProducts(button.dataset.search);
  });
});

loadProducts();
