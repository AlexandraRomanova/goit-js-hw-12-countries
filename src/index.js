const debounce = require('lodash.debounce');
import fetchCountries from "./js/fetchCountries";
import {refs} from './js/refs';
import countriesListTpl from "./templates/countries-list.hbs";
import countryCardTpl from "./templates/country-card.hbs";

// Для error
import { error } from "@pnotify/core";
import '@pnotify/core/dist/PNotify.css';
import "@pnotify/core/dist/BrightTheme.css";

refs.searchInput.addEventListener('input', debounce(onSearch, 500))

function onSearch(e) {
    clearCountryContainer();

    const searchQuery = e.target.value.trim();

    if (searchQuery !== '') {
        fetchCountries(searchQuery).then(arrayOfContries => {
            if (arrayOfContries.length > 10) {
                return onFetchError();
            }
            if (arrayOfContries.length >= 2 && arrayOfContries.length <= 10) {
                refs.countriesContainer.addEventListener('click', onCountriesListClick)
                return renderCountryList(arrayOfContries);
            }
            if (arrayOfContries.length === 1) {
                return renderCountryCard(arrayOfContries);
            }
        })
            .catch(onFetchError);
    }
};

function renderCountryCard(country) {
    refs.countriesContainer.insertAdjacentHTML('beforeend', countryCardTpl(country));
};

function renderCountryList(countries) {
    refs.countriesContainer.innerHTML = countriesListTpl(countries);
};

function onCountriesListClick(e) {
         if (e.target.nodeName !== 'LI') {
         return;
     }
    
    let countryName = e.target.dataset.name;
    clearCountryContainer();
    fetchCountries(countryName).then(renderCountryCard);
}

function clearCountryContainer() {
    refs.countriesContainer.innerHTML = '';
}

function onFetchError() {
    error({
        text: 'Too many matches found. Please enter a more specific query!',
        sticker: false,
        hide: true,
        delay: 1500,
    });
}