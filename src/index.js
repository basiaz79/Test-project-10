import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

fetchCountries('pol');

const inputCountry = document.querySelector('input#search-box');
const listCountry = document.querySelector('#country-list');
const infoCountry = document.querySelector('#country-info');

const DEBOUNCE_DELAY = 300;

// Search countries database
function inputHandler(event) {
  const searchInput = event.target.value.trim();

  cleanCountry();
  cleanListCountry();

  fetchCountries(searchInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      countryDataMarkup(data);
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}

// Creating countries list markup
function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-list_item" data-country='${name.common}'><img class="country-list_image" src="${flags.svg}" alt="${name.common}" height="40px"/><p class="country-list_post">${name.common}</p></li>`
    )
    .join('');
}

// Creating country info markup
function createDataMarkup(data) {
  const countryEl = data[0];
  const { name, capital, population, flags, languages } = countryEl;
  return `
        <li class="country_item">
            <div class="country_flag-name-container">
                <img src="${flags.svg}" alt="${name.common}" height="30px"/>
                <h2 class="country_title">${name.official}</h2>
            </div>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
        </li>
    `;
}

// Rendering
function countryDataMarkup(data) {
  if (data.length === 1) {
    const dataMarkup = createDataMarkup(data);
    infoCountry.innerHTML = dataMarkup;
  } else {
    const listMarkup = createListMarkup(data);
    listCountry.innerHTML = listMarkup;

    // Add click event to a country on list
    const listCountryItems = document.querySelectorAll('li');

    listCountryItems.forEach(item => {
      item.addEventListener('click', event => {
        const clickedCountry = event.currentTarget.dataset.country;
        // Searches the database by clicked country
        const wantedCountry = data.filter(
          country => country.name.common === clickedCountry
        );

        infoCountry.innerHTML = createDataMarkup(wantedCountry);
        cleanListCountry();
      });
    });
  }
}

// Input event addEventListener
inputCountry.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

// Clear markup
function cleanCountry() {
  infoCountry.innerHTML = '';
}

function cleanListCountry() {
  listCountry.innerHTML = '';
}