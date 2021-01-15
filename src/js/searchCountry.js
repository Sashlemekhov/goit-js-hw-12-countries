import listCountryTpl from '../templates/list-of-countries.hbs';
import oneCountryTpl from '../templates/country-info.hbs';
import { notice, Stack } from '@pnotify/core';
const _ = require('lodash');

const myStack = new Stack({
  dir1: "down", 
  firstpos1: 200, 
  push: "top",
  modal: true,
  overlayClose: true,
});


const inputRef = document.querySelector('.js-search');
const searchContentRef = document.querySelector('.js-search-content');

inputRef.value = '';

const searchHandler = function() {
  if (inputRef.value === '') {
    searchContentRef.innerHTML = '';
    return;
  };

  let url = `https://restcountries.eu/rest/v2/name/${inputRef.value}`  

  fetch(url)
    .then(response => response.json())
    .then((data) => {
      searchContentRef.innerHTML = '';

      if (data.length === 1) {
        const markupOneCountry = oneCountryTpl(data[0]);
        searchContentRef.insertAdjacentHTML('beforeend', markupOneCountry);
      };
      
      if (data.length >= 2 & data.length <= 10) {
        const markup = listCountryTpl(data);
        searchContentRef.insertAdjacentHTML('beforeend', markup);
      };

      if (data.length > 10) {
        notice({
          text: "To many matches found. Please enter a more specific query!",
          addClass: 'notify-custom',
          icon: false,
          delay: 1500,
          mouseReset: true,
          stack: myStack,
      });
        console.log('Более 10 стран');
      };

      if (data.status === 404) {
        notice({
          text: "Please enter correct data!",
          addClass: 'notify-custom',
          icon: false,
          delay: 1500,
          mouseReset: true,
          stack: myStack,
      });
      };
      
    })
    .catch(() => {
      notice({
          text: "Please enter correct data!",
          addClass: 'notify-custom',
          icon: false,
          delay: 1500,
          mouseReset: true,
          stack: myStack,
      });

      console.log('введите нормальные данные')
    })
};

inputRef.addEventListener('input', _.debounce(searchHandler, 500));


