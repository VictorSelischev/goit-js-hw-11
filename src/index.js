import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
countryList.style.padding = 0;

inputRef.addEventListener('input', debounce(handleFindCountryInput, DEBOUNCE_DELAY));



// ================================
// FUNCTION

function handleFindCountryInput(event) {
  console.log(event);
  console.log(event.target.value);

  const nameCountry = event.target.value.trim();
  
    if (nameCountry === '') {
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(nameCountry)
    .then(countries => {
      console.log(countries);

        countryList.innerHTML = '';
        countryInfo.innerHTML = '';

      if (countries.length > 10) {
        // console.log(countries.length);
        Notiflix.Notify.success('Too many matches found. Please enter a more specific name.');
      }
      else if (countries.length > 1 && countries.length < 10) {
        renderCountriesList(countries);
      }
      else {
        renderCountryInfo(countries);
        console.log(countries);
      }
      
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      console.log(error)
    });
  
}


function renderCountriesList(users) {
  const markup = users
    .map(user => {
      return `<li style="list-style: none; margin-bottom: 10px; margin-left: 10px">
      <img src="${user.flags.svg}" alt="Флаг ${user.name.official}" width=25>
      <span>${user.name.official}</span>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(users) {
  const markup = users
    .map(user => {
      const valuesLanguages = Object.values(user.languages).join(', ');
      // console.log(valuesLanguages);

      return `<li style="list-style: none; margin-bottom: 10px; margin-left: 10px">
      <img src="${user.flags.svg}" alt="Флаг ${user.name.official}" width=25>
      <span style="font-size: 28px; margin-bottom: 10px"><b>${user.name.official}</b></span>
      <p style="margin-bottom: 10px"><b>Capital</b>: ${user.capital}</p>
      <p style="margin-bottom: 10px"><b>Population</b>: ${user.population}</p>
      <p style="margin-bottom: 10px"><b>Languages</b>: ${valuesLanguages}</p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}


