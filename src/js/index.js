// import axios from 'axios';
// const axios = require('axios').default;
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

formRef.addEventListener('submit', handleSearchImagesSubmit);

console.log('Связь есть');

// =====================================
// FUNCTION

function handleSearchImagesSubmit(event) {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.target;

  fetchPromise(searchQuery.value)
    .then(object => {
      if (object.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      gallery.innerHTML = '';
      renderListGallery(object);
    })
    .catch(error => {
      console.log(error);
    });
}

async function fetchPromise(search) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '29396697-739a936ff485fb734bceeac87';

  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  const imagesPromise = response.json();
  return imagesPromise;
}

function renderListGallery(objectList) {
  const { hits } = objectList;
  //   console.log(objectList);
  // console.log(hits);
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

  gallery.innerHTML = markup;
}
