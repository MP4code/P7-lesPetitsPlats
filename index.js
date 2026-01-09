import recipes from '../data/recipes.js';
import { FiltersModel } from '../Template/modelFilters.js';
import { RecipesModel } from '../Template/modelRecipes.js';

/* AU CHARGEMENT DE LA PAGE*/
window.addEventListener('DOMContentLoaded', () => {
    displayFilters(recipes);
    displayRecipes(recipes);
});

/* AFFICHAGE DU NOMBRE DE RECETTES*/
const totalRecipesDiv = document.querySelector('.totalRecipes');
totalRecipesDiv.textContent = `${recipes.length} recettes`;

/* AFFICHAGE DES RECETTES*/
function displayRecipes(recipesToDisplay) {
    const recipesContainer = document.querySelector('.recipes-container');
    recipesContainer.innerHTML = '';

    recipesToDisplay.forEach(recipeData => {
        const recipe = new RecipesModel(recipeData);
        const recipeCard = recipe.createHtml();
        recipesContainer.appendChild(recipeCard);
    });
}

/* AFFICHAGE DES FILTRES*/
function displayFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            ingredients.add(ing.ingredient.toLowerCase());
        });

        appliances.add(recipe.appliance.toLowerCase());

        recipe.ustensils.forEach(ust => {
            ustensils.add(ust.toLowerCase());
        });
    });

    const container = document.querySelector('.filters');
    container.innerHTML = '';

    container.appendChild(
        new FiltersModel(ingredients, 'ingredient-filter', 'Ingrédients').createHtml()
    );

    container.appendChild(
        new FiltersModel(appliances, 'appliance-filter', 'Appareils').createHtml()
    );

    container.appendChild(
        new FiltersModel(ustensils, 'ustensil-filter', 'Ustensiles').createHtml()
    );
}

/* OUVERTURE / FERMETURE DES FILTRES*/
document.addEventListener('click', (e) => {
    const button = e.target.closest('.filter-button');
    if (!button) return;

    const currentFilter = button.closest('.filter');

    // Ferme les autres filtres
    document.querySelectorAll('.filter.open').forEach(filter => {
        if (filter !== currentFilter) {
            filter.classList.remove('open');
            filter.querySelector('.filter-button')
                .setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle le filtre cliqué
    currentFilter.classList.toggle('open');
    button.setAttribute(
        'aria-expanded',
        currentFilter.classList.contains('open')
    );
});

/* RECHERCHE DANS UN FILTRE*/
document.addEventListener('input', (e) => {
    if (!e.target.classList.contains('filter-search')) return;

    const searchValue = e.target.value.toLowerCase();
    const items = e.target
        .closest('.filter')
        .querySelectorAll('.filter-item');

    items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(searchValue)
            ? 'block'
            : 'none';
    });
});
