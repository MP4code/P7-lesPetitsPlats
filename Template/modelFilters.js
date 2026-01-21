export class FiltersModel {
    constructor(values, id, label) {
        this.values = values;   // Set
        this.id = id;
        this.label = label;
    }

  createHtml() {
    const container = document.createElement('div');
    container.classList.add('filter');

    container.innerHTML = `
        <button class="filter-button" aria-expanded="false">
            ${this.label}
        </button>

        <div class="filter-dropdown">
            <input
                type="text"
                class="filter-search"
                placeholder="Rechercher un ${this.label.toLowerCase()}..."
                aria-label="Recherche ${this.label}"
            >

            <ul class="filter-list">
                 ${[...this.values]
                 .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
                 .map(value => `
                    <li class="filter-item" data-value="${value}">
                     ${value}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

const input = container.querySelector('.filter-search');
const items = container.querySelectorAll('.filter-item');

input.addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();

  items.forEach(item => {
    const value = item.textContent.toLowerCase();
    item.style.display = value.includes(search) ? 'block' : 'none';
  });
});


items.forEach(item => {
  item.addEventListener('click', () => {
    const value = item.dataset.value.toLowerCase();

    container.dispatchEvent(
      new CustomEvent('filter:selected', {
        detail: {
          type: this.id,   // ingredients | appliances | ustensils
          value
        },
        bubbles: true
      })
    );
  });
});

    return container;
}


}

