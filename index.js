// index.js gère l'état des filtres actifs, affiche les filtres disponibles en fonction des recettes affichées,
// applique les filtres combinés à la recherche et gère les interactions avec les filtres et les tags actifs.

import { displayRecipes, updateTotal } from "./search.js";
import recipes from "../data/recipes.js";
import { FiltersModel } from "../Template/modelFilters.js";

/* ÉTAT DES FILTRES */
const activeFilters = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

const filterSelectedDiv = document.querySelector(".filterSelected");

// AFFICHAGE DES FILTRES DISPONIBLES
// Cette fonction est appelée à chaque fois que les recettes affichées changent (après une recherche ou une sélection de filtre).
function displayFilters(recipesToDisplay) {
  const ingredients = new Set();
  const appliances = new Set();
  const ustensils = new Set();

  recipesToDisplay.forEach((recipe) => {
    recipe.ingredients.forEach((ing) =>
      ingredients.add(ing.ingredient.toLowerCase())
    );
    appliances.add(recipe.appliance.toLowerCase());
    recipe.ustensils.forEach((ust) => ustensils.add(ust.toLowerCase()));
  });

  const container = document.querySelector(".filters");
  container.innerHTML = "";

  container.appendChild(
    new FiltersModel(ingredients, "ingredients", "Ingrédients").createHtml()
  );
  container.appendChild(
    new FiltersModel(appliances, "appliances", "Appareils").createHtml()
  );
  container.appendChild(
    new FiltersModel(ustensils, "ustensils", "Ustensiles").createHtml()
  );
}

// FILTRAGE COMBINÉ : recherche + filtres actifs
// Cette fonction prend les recettes filtrées par la recherche et applique les filtres actifs
// pour n'afficher que les recettes qui correspondent à tous les critères.
function applyFilters(filteredFromSearch) {
  const filteredRecipes = filteredFromSearch.filter((recipe) => {
    const ingredientsOk = activeFilters.ingredients.every((f) =>
      recipe.ingredients.map((i) => i.ingredient.toLowerCase()).includes(f)
    );

    const appliancesOk = activeFilters.appliances.every(
      (f) => recipe.appliance.toLowerCase() === f
    );

    const ustensilsOk = activeFilters.ustensils.every((f) =>
      recipe.ustensils.map((u) => u.toLowerCase()).includes(f)
    );

    return ingredientsOk && appliancesOk && ustensilsOk;
  });

  displayRecipes(filteredRecipes);
  updateTotal(filteredRecipes.length);
  displayFilters(filteredRecipes);
  displayActiveFilterButtons();
}

// GESTION DES TAGS ACTIFS
function displayActiveFilterButtons() {
  filterSelectedDiv.innerHTML = "";

  Object.entries(activeFilters).forEach(([type, values]) => {
    values.forEach((value) => {
      const button = document.createElement("button");
      button.classList.add("remove-filter");
      button.textContent = value;
      button.setAttribute("data-value", value);
      const closeBtn = document.createElement("div");
      closeBtn.classList.add("close-btn");
      closeBtn.textContent = "×";

      button.appendChild(closeBtn);

      button.addEventListener("click", () => {
        activeFilters[type] = activeFilters[type].filter((v) => v !== value);
        applyFilters(currentFilteredFromSearch);
      });

      filterSelectedDiv.appendChild(button);
    });
  });

  filterSelectedDiv.classList.toggle(
    "filterSelectedRemove",
    filterSelectedDiv.children.length > 0
  );
}

// ÉCOUTE DES FILTRES
document.addEventListener("filter:selected", (e) => {
  const { type, value } = e.detail;

  if (!activeFilters[type].includes(value)) {
    activeFilters[type].push(value);
  }

  applyFilters(currentFilteredFromSearch);
});

// ÉCOUTE RECETTES FILTRÉES PAR RECHERCHE
let currentFilteredFromSearch = recipes;
document.addEventListener("recipes:filtered", (e) => {
  currentFilteredFromSearch = e.detail;
  applyFilters(currentFilteredFromSearch);
});

// OUVERTURE / FERMETURE DES FILTRES
document.addEventListener("click", (e) => {
  const button = e.target.closest(".filter-button");
  if (!button) return;

  const currentFilter = button.closest(".filter");
  document.querySelectorAll(".filter.open").forEach((filter) => {
    if (filter !== currentFilter) {
      filter.classList.remove("open");
      filter
        .querySelector(".filter-button")
        .setAttribute("aria-expanded", "false");
    }
  });

  currentFilter.classList.toggle("open");
  button.setAttribute(
    "aria-expanded",
    currentFilter.classList.contains("open")
  );
});

// INITIALISATION
applyFilters(recipes);
