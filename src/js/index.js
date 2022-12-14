// import axios from 'axios';
// const axios = require('axios').default;
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
// const btnRef = document.querySelector('.search-form__button');
const gallery = document.querySelector('.gallery');
const btnPlus = document.querySelector('.load-more');

const PER_PAGE = 40;

let inputValue = '';
let page = 1;
let limit = null;
// btnPlus.disabled = true;

formRef.addEventListener('submit', handleSearchImagesSubmit);

btnPlus.addEventListener('click', handleLoadMoreImagesClick);

console.log('Связь есть');

// =====================================
// FUNCTION

function handleLoadMoreImagesClick() {
  // if (inputValue !== )

  console.log(inputValue);

    if (limit < PER_PAGE * page) {
    btnPlus.classList.add('is-hidden');
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    return;
  }

  fetchPromise(inputValue)
    .then(object => {
      if (object.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      renderListGallery(object);
    })
    .catch(error => {
      console.log(error);
    });
}

function handleSearchImagesSubmit(event) {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.currentTarget;

  btnPlus.classList.toggle('is-hidden');
  page = 1;
  gallery.innerHTML = '';
  inputValue = searchQuery.value;

  fetchPromise(inputValue)
    .then(object => {
      if (object.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      renderListGallery(object);
      btnPlus.classList.remove('is-hidden');
      // btnRef.disabled = true;
    })
    .catch(error => {
      console.log(error);
    });
}

async function fetchPromise(search) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '29396697-739a936ff485fb734bceeac87';

  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${page}`
  );

  const imagesPromise = await response.json();
  page += 1;
  return imagesPromise;
}

function renderListGallery(objectList) {
  const { hits, totalHits } = objectList;
  console.log(objectList);
  // console.log(hits);
  limit = totalHits;

  const markup = hits
    .map(el => {
      const { webformatURL, tags, likes, views, comments, downloads } = el;
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
