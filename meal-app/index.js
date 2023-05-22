// app.js

const searchInput = document.getElementById('searchInput');
const mealList = document.getElementById('mealList');
let favoriteMeals = [];

// Fetch meals from the API based on user input
async function searchMeals() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    mealList.innerHTML = '';
    return;
  }

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  const data = await response.json();

  if (data.meals === null) {
    mealList.innerHTML = '<p>No meals found.</p>';
    return;
  }

  mealList.innerHTML = '';

  data.meals.forEach(meal => {
    const mealItem = document.createElement('div');
    mealItem.classList.add('meal');
    mealItem.innerHTML = `
      <div class="meal-info" data-mealid="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
      </div>
      <button class="fav-btn">Add to Favorites</button>
    `;
    
    const favBtn = mealItem.querySelector('.fav-btn');
    favBtn.addEventListener('click', () => addToFavorites(meal));

    mealList.appendChild(mealItem);
  });
}

// Add a meal to the favorites list
function addToFavorites(meal) {
  if (!isMealInFavorites(meal.idMeal)) {
    favoriteMeals.push(meal);
    updateFavorites();
  }
}

// Remove a meal from the favorites list
function removeFromFavorites(mealId) {
  favoriteMeals = favoriteMeals.filter(meal => meal.idMeal !== mealId);
  updateFavorites();
}

// Update the favorites list on the page
function updateFavorites() {
  // Store favorite meals in localStorage for persistence
  localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));

  // Render favorite meals
  const favoritesList = document.createElement('div');
  favoritesList.classList.add('favorites');
  favoritesList.innerHTML = '<h2>My Favorite Meals</h2>';

  if (favoriteMeals.length === 0) {
    favoritesList.innerHTML += '<p>You have no favorite meals yet.</p>';
  } else {
    favoriteMeals.forEach(meal => {
      const favoriteItem = document.createElement('div');
      favoriteItem.classList.add('favorite');
      favoriteItem.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <button class="remove-btn">Remove from Favorites</button>
      `;

      const removeBtn = favoriteItem.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => removeFromFavorites(meal.idMeal));

      favoritesList.appendChild(favoriteItem);
    });
  }

  mealList.innerHTML = '';
  mealList.appendChild(favoritesList);
}

// Check if a meal is already in the favorites list
function isMealInFavorites(mealId) {
  return favoriteMeals.some(meal => meal.idMeal === mealId);
}

// Load favorite meals from localStorage on page load
function loadFavorites() {
  const storedFavorites = localStorage.getItem('favoriteMeals');
  if (storedFavorites !== null) {
    favoriteMeals = JSON.parse(storedFavorites);
    updateFavorites();
  }
}

// Event listener for search input
searchInput.addEventListener('input', searchMeals);

// Load favorite meals on page load
loadFavorites();
