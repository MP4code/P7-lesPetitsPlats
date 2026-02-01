import recipes from "../data/recipes.js";
import { RecipesModel } from "../Template/modelRecipes.js";

/* Récuperer les éléments du DOM */
// Barre de recherche principale, les recettes et le total des recettes
// filtres sélectionnés(tag)

const searchBar = document.getElementById("search-bar");
const recipesContainer = document.querySelector(".recipes-container");
const totalRecipesDiv = document.querySelector(".totalRecipes");
const filterSelectedDiv = document.querySelector(".filterSelected");

/* AFFICHAGE RECETTES */

function displayRecipes(recipesToDisplay) {
  recipesContainer.innerHTML = "";

  recipesToDisplay.forEach((recipeData) => {
    const recipe = new RecipesModel(recipeData);
    recipesContainer.appendChild(recipe.createHtml());
  });
}

/* TOTAL RECETTES */

function updateTotal(count) {
  totalRecipesDiv.textContent = `${count} recettes`;
}

/*AFFICHAGE TAG : FILTRES SÉLECTIONNÉS */

/* RECHERCHE PRINCIPALE */
// ValueInupt : valeur entrée dans la barre de recherche
// NameMatch : correspondance dans le nom de la recette
// DescriptionMatch : correspondance dans la description de la recette
// IngredientsMatch : correspondance dans les ingrédients de la recette
// toLowerCase() pour normaliser les données (majuscules/minuscules)
function searchRecipes(valueInput) {
  const search = valueInput.toLowerCase();

  const filteredRecipes = recipes.filter((recipe) => {
    const nameMatch = recipe.name.toLowerCase().includes(search);

    const descriptionMatch = recipe.description.toLowerCase().includes(search);

    const ingredientsMatch = recipe.ingredients.some((ing) =>
      ing.ingredient.toLowerCase().includes(search)
    );

    return nameMatch || descriptionMatch || ingredientsMatch;
  });

  displayRecipes(filteredRecipes);
  updateTotal(filteredRecipes.length);
}

/* ÉCOUTEUR BARRE DE RECHERCHE */
// Déclenche la recherche lorsque l'utilisateur tape au moins 3 caractères

searchBar.addEventListener("input", (e) => {
  const valueInput = e.target.value.trim();

  if (valueInput.length >= 3) {
    searchRecipes(valueInput);
  } else {
    displayRecipes(recipes);
    updateTotal(recipes.length);
  }
});

/* INITIALISATION */

displayRecipes(recipes);
updateTotal(recipes.length);
