const debounce = require('lodash.debounce');
import fetchCountries from "./fetchCountries";
import countriesListTpl from "./templates/countries-list.hbs";
import countryCardTpl from "./templates/country-card.hbs";

// Для error
import { error } from "@pnotify/core";
import '@pnotify/core/dist/PNotify.css';
import "@pnotify/core/dist/BrightTheme.css";


const refs = {
    searchInput: document.querySelector('.js-search-input'),
    coutriesContainer: document.querySelector('.js-countries-container'),
    countriesNameList: document.querySelector('.countries__name')
};



refs.searchInput.addEventListener('input', debounce(onSearch, 500))

function onSearch(e) {
    clearCountryContainer();

    const searchQuery = e.target.value.trim();

    if (searchQuery !== '') {
        fetchCountries(searchQuery).then(arrayOfContries => {
            if (arrayOfContries.length > 10) {
                return onFetchError();
            }
            else if (arrayOfContries.length >= 2 && arrayOfContries.length <= 10) {
                return renderCountryList(arrayOfContries);
                addListenersCountriesList();
            }
            else if (arrayOfContries.length === 1) {
                return renderCountryCard(arrayOfContries);
            }
        })
            .catch(onFetchError);
    }
};

function renderCountryCard(country) {
    refs.coutriesContainer.insertAdjacentHTML('beforeend', countryCardTpl(country));
};

function renderCountryList(countries) {
    refs.coutriesContainer.innerHTML = countriesListTpl(countries);
}

function onCountriesListClick(e) {
    let countryName = e.target.dataset.name;
    fetchCountries(countryName).then(renderCountryCard);
}

function addListenersCountriesList() {
    countriesListTpl.forEach.call(element => {
        element.addEventListener('click', onCountriesListClick)
    })
}

function clearCountryContainer() {
    refs.coutriesContainer.innerHTML = '';
}

function onFetchError() {
    error({
        text: 'Too many matches found. Please enter a more specific query!',
        sticker: false,
        hide: true,
        delay: 1500,
    });
}


