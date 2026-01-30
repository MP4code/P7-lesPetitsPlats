const searchBar = document.getElementById("search-bar");

/* Recherche principale */
searchBar.addEventListener("input", (e) => {
  const valueInput = e.target.value.trim();
  console.log("Input value:", valueInput);

  function SearchRecipe(valueInput) {
    // recherche principale ici
    console.log("Recherche pour:", valueInput);

    applyFilters();
    displayRecipes();
    updateTotal();
    displayActiveFilterButtons();
  }

  function clearResults() {
    // réinitialiser l'affichage
    console.log("Réinitialisation des résultats");
  }

  if (valueInput.length >= 3) {
    // L'utilisateur a tapé au moins 3 caractères
    SearchRecipe(valueInput);
  } else {
    // moins de 3 caractères → réinitialiser
    clearResults();
  }
});
