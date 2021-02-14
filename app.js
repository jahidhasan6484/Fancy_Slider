const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

// selected image 
let sliders = [];

// API key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.length == 0) {
    document.getElementById('warning').innerText = 'No image found with your query';
  } else if (images.length > 0) {
    document.getElementById('warning').innerText = '';
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
  showSpinner();
};

const getImages = (query) => {
  const url = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`;
  showSpinner();
  fetch(url)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  // extra work 2
  let imageCount = 0;
  const imageCountText = document.getElementById('image-count');

  if (element.classList.contains('added')) {
    sliders.push(img);
    imageCount = sliders.length;
    imageCountText.innerText = imageCount;
  } else {
    const index = sliders.indexOf(img);
    sliders.splice(index, 1);
    imageCount = sliders.length;
    imageCountText.innerText = imageCount;
  }
};

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.');
    return;
  }

  // crate slider previous-next
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';

  // hide image
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration || 1000);
};

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
};

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })
  items[index].style.display = "block"
};

searchBtn.addEventListener('click', function () {
  // extra work 1
  const searchInput = document.getElementById("search").value;
  if (searchInput == "") {
    alert("Please enter some valid keyword to search");
  } else {
    document.getElementById('image-count').innerText = 0;
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
    document.getElementById("search").value = "";
  }
});

// enter key to search image
const inputField = document.getElementById('search');
inputField.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});

//get duration and create slider
sliderBtn.addEventListener('click', function () {
  const duration = document.getElementById('duration').value;
  console.log(duration);
  // if (duration <= 0) {
  //   alert("Warning! \nPlease enter some positive value");
  // } 
  if (duration == -0){
  alert("Warning! \nPlease enter some positive value");
}
else if (duration < 0){
  alert("Warning! \nPlease enter some positive value");
}
  else {
  createSlider();
}
});

// display none and block
const showSpinner = () => {
  document.getElementById('spinner').classList.toggle('d-none');
  document.querySelector('.gallery').classList.toggle('d-none');
};