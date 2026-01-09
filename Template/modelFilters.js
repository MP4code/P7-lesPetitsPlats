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
                ${[...this.values].map(value => `
                    <li class="filter-item" data-value="${value}">
                        ${value}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    return container;
}


}
