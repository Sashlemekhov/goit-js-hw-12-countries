import listCountryTpl from '../templates/list-of-countries.hbs';
import oneCountryTpl from '../templates/country-info.hbs';
import { notice, Stack } from '@pnotify/core';
import debounce from 'lodash.debounce';

const myStack = new Stack({
  dir1: "down", 
  firstpos1: 200, 
  push: "top",
  modal: true,
  overlayClose: true,
});


const inputRef = document.querySelector('.js-search');
const searchContentRef = document.querySelector('.js-search-content');

searchContentRef.innerHTML = localStorage.getItem('markup') || '';

const searchHandler = function () {
  searchContentRef.innerHTML = '';
  

  if (inputRef.value === '') {
    return;
  };

  let url = `https://restcountries.eu/rest/v2/name/${inputRef.value}`  

  fetch(url)
    .then(response => response.json())
    .then((data) => {

      if (data.length === 1) {
        const markupOneCountry = oneCountryTpl(data[0]);
        searchContentRef.insertAdjacentHTML('beforeend', markupOneCountry);
        localStorage.setItem('markup', searchContentRef.innerHTML);
      };
      
      if (data.length >= 2 & data.length <= 10) {
        const markup = listCountryTpl(data);
        searchContentRef.insertAdjacentHTML('beforeend', markup);
        localStorage.setItem('markup', searchContentRef.innerHTML);
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
    })
};

inputRef.addEventListener('input', debounce(searchHandler, 700));



