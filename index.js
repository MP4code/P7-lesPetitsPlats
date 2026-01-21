import recipes from '../data/recipes.js';
import { FiltersModel } from '../Template/modelFilters.js';
import { RecipesModel } from '../Template/modelRecipes.js';

/* ÉTAT DES FILTRES ACTIFS */
const activeFilters = {
  ingredients: [],
  appliances: [],
  ustensils: []
};

/* AU CHARGEMENT DE LA PAGE */
window.addEventListener('DOMContentLoaded', () => {
  displayFilters(recipes);
  displayRecipes(recipes);
  updateTotal(recipes.length);
});

/* AFFICHAGE DU TOTAL*/
const totalRecipesDiv = document.querySelector('.totalRecipes');

function updateTotal(count) {
  totalRecipesDiv.textContent = `${count} recettes`;
}

/* AFFICHAGE DES FILTRES SÉLECTIONNÉS */
const filterSelectedDiv = document.querySelector('.filterSelected');
function selectedFilter(){
if (activeFilters.ingredients.length>0){
    filterSelectedDiv.classList.add("filterSelectedActive");
}
  filterSelectedDiv.innerHTML= `
  <div> ${activeFilters.ingredients.join(', ')}</div>`;
}
selectedFilter();


/* AFFICHAGE DES RECETTES */
function displayRecipes(recipesToDisplay) {
  const recipesContainer = document.querySelector('.recipes-container');
  recipesContainer.innerHTML = '';

  recipesToDisplay.forEach(recipeData => {
    const recipe = new RecipesModel(recipeData);
    recipesContainer.appendChild(recipe.createHtml());
  });
}

/* AFFICHAGE DES FILTRES */
function displayFilters(recipes) {
  const ingredients = new Set();
  const appliances = new Set();
  const ustensils = new Set();

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ing =>
      ingredients.add(ing.ingredient.toLowerCase())
    );

    appliances.add(recipe.appliance.toLowerCase());

    recipe.ustensils.forEach(ust =>
      ustensils.add(ust.toLowerCase())
    );
  });

  const container = document.querySelector('.filters');
  container.innerHTML = '';

  container.appendChild(
    new FiltersModel(ingredients, 'ingredients', 'Ingrédients').createHtml()
  );

  container.appendChild(
    new FiltersModel(appliances, 'appliances', 'Appareils').createHtml()
  );

  container.appendChild(
    new FiltersModel(ustensils, 'ustensils', 'Ustensiles').createHtml()
  );
}

/* ÉCOUTE DES FILTRES */
document.addEventListener('filter:selected', (e) => {
  const { type, value } = e.detail;

  if (!activeFilters[type].includes(value)) {
    activeFilters[type].push(value);
  }

  applyFilters();
});

/* FILTRAGE DES RECETTES */
function applyFilters() {
  const filteredRecipes = recipes.filter(recipe => {

    const ingredientNames = recipe.ingredients.map(i =>
      i.ingredient.toLowerCase()
    );

    const ingredientsOk = activeFilters.ingredients.every(filter =>
      ingredientNames.includes(filter)
    );

    const appliancesOk =
      activeFilters.appliances.length === 0 ||
      activeFilters.appliances.includes(recipe.appliance.toLowerCase());

    const ustensilsOk = activeFilters.ustensils.every(filter =>
      recipe.ustensils.map(u => u.toLowerCase()).includes(filter)
    );

    return ingredientsOk && appliancesOk && ustensilsOk;
  });

  displayRecipes(filteredRecipes);
  updateTotal(filteredRecipes.length);
}

/* OUVERTURE / FERMETURE FILTRES */
document.addEventListener('click', (e) => {
  const button = e.target.closest('.filter-button');
  if (!button) return;

  const currentFilter = button.closest('.filter');

  document.querySelectorAll('.filter.open').forEach(filter => {
    if (filter !== currentFilter) {
      filter.classList.remove('open');
      filter.querySelector('.filter-button')
        .setAttribute('aria-expanded', 'false');
    }
  });

  currentFilter.classList.toggle('open');
  button.setAttribute(
    'aria-expanded',
    currentFilter.classList.contains('open')
  );
});
