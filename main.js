const toggleThemeBtn = document.getElementById("toggle-theme");

toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
  toggleThemeBtn.textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
});

// Set default theme
document.body.setAttribute("data-theme", "light");



const recipeList = document.getElementById("recipe-list");
const searchInput = document.getElementById("search");
const categoryButtons = document.querySelectorAll(".categorie");

let recipes = [];

let apy = "504479f5700f4b41b7a104d3614158c4";

async function fetchRecipes() {
  const response = await fetch(`https://api.spoonacular.com/recipes/random?number=12&apiKey=${apy}`);
  const data = await response.json();
  recipes = data.recipes;
  displayRecipes(recipes);
}


function displayRecipes(recipesToDisplay) {
    recipeList.innerHTML = "";
  
    recipesToDisplay.forEach(recipe => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
  
      const ingredientsList = recipe.extendedIngredients
        ? recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")
        : "<li>No ingredients listed.</li>";
  
      const recipeSteps = recipe.instructions || "No instructions provided.";
  
      recipeCard.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>${recipe.summary ? recipe.summary.replace(/<[^>]+>/g, '') : 'No summary available.'}</p>
        <button class="view-btn">View Recipe</button>
        <div class="recipe-details hidden">
          <h3>Ingredients</h3>
          <ul>${ingredientsList}</ul>
          <h3>Instructions</h3>
          <p>${recipeSteps}</p>
          <button class="copy-btn" style="margin-top: 1rem;">📋 Copy</button>
        </div>
      `;
  
      recipeList.appendChild(recipeCard);
  
      const viewBtn = recipeCard.querySelector(".view-btn");
      const details = recipeCard.querySelector(".recipe-details");
      const copyBtn = recipeCard.querySelector(".copy-btn");
  
      // Toggle details
      viewBtn.addEventListener("click", () => {
        const isVisible = details.classList.contains("visible");
        details.classList.toggle("visible");
        details.classList.toggle("hidden");
        viewBtn.textContent = isVisible ? "View Recipe" : "Hide Recipe";
      });
  
      // Copy functionality
      copyBtn.addEventListener("click", () => {
        const plainIngredients = recipe.extendedIngredients
          ? recipe.extendedIngredients.map(ing => `• ${ing.original}`).join("\n")
          : "No ingredients listed.";
  
        const plainText = `📌 ${recipe.title}\n\nIngredients:\n${plainIngredients}\n\nInstructions:\n${recipeSteps}`;
  
        navigator.clipboard.writeText(plainText).then(() => {
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => (copyBtn.textContent = "📋 Copy"), 1500);
        });
      });
    });
  }
  


searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm)
  );
  displayRecipes(filteredRecipes);
});

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    const filteredRecipes = category === "all"
      ? recipes
      : recipes.filter(recipe => recipe.dishTypes.includes(category));
    displayRecipes(filteredRecipes);
  });
});

// Initial fetch
fetchRecipes();
