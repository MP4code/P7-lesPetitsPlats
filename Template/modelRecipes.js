export class RecipesModel {
  constructor(data) {
    this.id = data.id;
    this.image = `JSON_recipes/${data.image}`;
    this.name = data.name;
    this.servings = data.servings;
    this.ingredients = data.ingredients;
    this.ingredientNames = data.ingredients.map((ing) =>
      ing.ingredient.toLowerCase()
    );
    this.time = data.time;
    this.description = data.description;
    this.appliance = data.appliance;
    this.ustensils = data.ustensils;
  }

  createHtml() {
    const recipeCard = document.createElement("article");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
                <img src="${this.image}" alt="Image de la recette ${
      this.name
    }" class="recipe-image">
                <div class="temp">${this.time} min</div>
           
            <div class="recipe-content"> 
                <h2 class="recipe-title">${this.name}</h2>

                <div class="recipe-recette">
                    <p>RECETTE:</p>
                    <p class="recipe-description">${this.description}</p>
                </div>

               <div class="ingredients-list">
                    <p>INGRÉDIENTS:</p>
                <ul>
        ${this.ingredients
          .map(
            (ing) => `
            <li>
                <span class="ingredient-name">${ing.ingredient}</span>
                <span class="ingredient-quantity">
                    ${ing.quantity ? ing.quantity : ""}
                    ${ing.unit ? ing.unit : ""}
                </span>
            </li>
        `
          )
          .join("")}
    </ul>
</div>

            </div>
        `;

    return recipeCard;
  }
}
