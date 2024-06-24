import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash.debounce';
import { Notify} from 'notiflix/build/notiflix-notify-aio';

fetchCountries('pol')

const inputCountry = document.querySelector('input#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300

//search countries database
function inputHandler(event) {
    const searchInput = event.target.value.trim();

    cleanCountry()
    cleanListCountry()

    fetchCountries(searchInput)
        .then(data => {
            if (data.lenght > 10) {
                Notify.info('Too many matches found. Please enter a more specific name');
                return;
            }
            countryDataMarkup(data);
        })
        .catch(err => {
            Notify.failure('Oops, there is no country with that name');
        });
};

//creating countries list markup
function createListMarkup(data) {

    return data
        .map(({ name, flags }) =>
            `<li class="country-list_item" data-country='${name.common}'><img class=country-list_image" src="${flags.svg}" alt="${name.common}" height="40px" "/><p class="country-list_post">${name.common}</p></li>
        )
        .join('');

};

//creating country info markup
function crateDataMarkup(data) {
    const countryE1 = data[0]};
    const {name, capital, population, flags, languages } = countryE1;
        return `
                <li class="country_item">
                    <><div class="country_flag-name-container">
                ing src="${flags.svg}" alt="${country.common}" height="30px"/></p><h2 class="country_title">${country.official}</h2></>
                    </div>
                    <p><b>Capital:<b> ${capital}
                    <p><b>Population:</b> ${population}</p>
                    <p><b>Lanbuages:</b> ${Object.values(data[0].languages)}</p>
                </li>
                `;
};

//rendering
function countryDataMarkup(data) {
    if (data.lenght === 1) {
        const DataMarkup = createDataMarkup(data);
        infoCountry.innerHTML = dataMarkup;
    } else {
        const listMarkup = createListMarkup(data);
        listCountry.innerHTML = listMarkup;

        //add click to a country on list
        const listCountryItem = document.querySelectorAll('li');

        listCountryItem.forEach(item => {
            item.addEventListener('click', event => {
                const clickedCountry = event.currentTarget.dataset.country;
                //searches the database by clicked country
                const wantedCountry = data.filter(
                    country => country.name.common === clickedCountry
                );

                infoCountry.innerHTML = createDataMarkup(wantedCountry);
                console.log('item clicked', clickedCountry);
                cleanListCountry();
            });
        });
    };
};
            
//input event addEventListener
inputCountry.addEventListener('input',debounce(inputHandler, DEBOUNCE_DELAY));

//clear markup
function cleanCountry() {
    infoCountry.innerHTML = '';
};

function cleanListCountry() {
    listCountry.innerHTML = '';
}