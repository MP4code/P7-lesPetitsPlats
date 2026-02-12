//search.js gère la recherche globale des recettes, l'affichage des recettes filtrées et le compteur de recettes affichées.
// Il communique également avec les autres modules pour mettre à jour les filtres en fonction des résultats de la recherche.

import recipes from "../data/recipes.js";
import { RecipesModel } from "../Template/modelRecipes.js";

/* SÉLECTION DES ÉLÉMENTS */
const searchBar = document.getElementById("search-bar");
const recipesContainer = document.querySelector(".recipes-container");
const totalRecipesDiv = document.querySelector(".totalRecipes");
const noResultsMessage = document.querySelector(".no-results-message");
const clearBtn = document.querySelector(".clear-btn");

let searchText = "";

// AFFICHAGE RECETTES
export function displayRecipes(recipesToDisplay) {
  recipesContainer.innerHTML = "";

  recipesToDisplay.forEach((recipeData) => {
    const recipe = new RecipesModel(recipeData);
    recipesContainer.appendChild(recipe.createHtml());
  });
}

// TOTAL RECETTES
export function updateTotal(count) {
  totalRecipesDiv.textContent = `${count} recettes`;
}

// fonction qui affiche un état de la recherche(ex: "aucune recette ne correspond à "xxx" ou "x recettes correspondent à "xxx"")
// il faut l'appeler uniquement après la recherche principale pour éviter d'afficher un message d'aucun résultat alors que les filtres n'ont pas encore été appliqués
export function displaySearchState(count, searchText) {
  if (count === 0 && searchText.length >= 3) {
    noResultsMessage.textContent = `Aucune recette ne correspond à "${searchText}",  vous pouvez chercher «
    tarte aux pommes », « poisson », etc.`;
    console.log("Aucune recette ne correspond à", searchText);
    noResultsMessage.style.display = "block";
  } else {
    noResultsMessage.style.display = "none";
    noResultsMessage.innerHTML = `${count} recette(s) correspondent à "${searchText}"`;
  }
}

// RECHERCHE PRINCIPALE
// La recherche est déclenchée à chaque saisie dans la barre de recherche.
// Elle filtre les recettes en fonction du texte saisi, puis met à jour l'affichage des recettes et le compteur.
// ajout .split(w) pour éviter les problèmes de recherche sur les mots composés (ex: "tarte aux pommes" ne correspond pas à "pommes" sans split)

export function searchRecipes(valueInput) {
  searchText = valueInput.toLowerCase().trim();

  let filteredRecipes;

  if (searchText.length >= 3) {
    filteredRecipes = recipes.filter((recipe) => {
      const nameWords = recipe.name.toLowerCase();
      const descWords = recipe.description.toLowerCase();
      const ingredientWords = recipe.ingredients
        .map((i) => i.ingredient.toLowerCase())
        .flat();

      return (
        nameWords.includes(searchText) ||
        descWords.includes(searchText) ||
        ingredientWords.includes(searchText)
      );
    });
  } else {
    // Moins de 3 caractères = on renvoie toutes les recettes
    filteredRecipes = [...recipes];
  }

  displayRecipes(filteredRecipes);
  updateTotal(filteredRecipes.length);
  displaySearchState(filteredRecipes.length, searchText);

  // Envoie les recettes filtrées pour mettre à jour les filtres
  // vers index.js qui va appliquer les filtres actifs et n'afficher que les recettes qui correspondent à tous les critères
  document.dispatchEvent(
    new CustomEvent("recipes:filtered", { detail: filteredRecipes })
  );
}

// GESTION BOUTON CLEAR
export function clearSearch(valueInput) {
  if (valueInput && valueInput.length >= 3) {
    clearBtn.classList.add("clear-btnActive");
  } else {
    clearBtn.classList.remove("clear-btnActive");
  }

  clearBtn.addEventListener("click", () => {
    searchBar.value = "";
    clearBtn.classList.remove("clear-btnActive");
    searchRecipes("");
  });
}

// ÉCOUTEUR BARRE DE RECHERCHE
searchBar.addEventListener("input", (e) => {
  const valueInput = e.target.value.trim();
  searchRecipes(valueInput);
  clearSearch(valueInput);
});

// INITIALISATION
searchRecipes("");
