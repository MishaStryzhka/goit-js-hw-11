import getFoto from "./PixabayAPI";
import { Notify } from "notiflix";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more')
}
let page = 1;
let inputValue = "";
let valueScroll = 0;

refs.form.addEventListener('submit', (e) => {
    e.preventDefault()
    inputValue = e.currentTarget.searchQuery.value;

    refs.gallery.innerHTML = "";
    page = 1;
    valueScroll = 0;

    getFoto(inputValue, String(page))
        .then(data => {
            try {
                Notify.success(`Hooray! We found ${data.totalHits} images.`)
            } catch (error) {
                console.log(error);
            };
            refs.gallery.insertAdjacentHTML("beforeend", creatGalery(data.hits));

            refs.btnLoadMore.classList.remove("ishiden");

            isLastPage(data.totalHits);

            lightbox.refresh();

            const { height: cardHeight } = document
                .querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight / 3.5,
                behavior: "smooth",
            });

            nextPage()

            return data;
        })
        .catch(err => {
            console.log(err);
            Notify.warning("Sorry, there are no images matching your search query. Please try again.");
            refs.gallery.innerHTML = "";
        })
})

refs.btnLoadMore.addEventListener('click', () => {
    getFoto(inputValue, String(page))
        .then(data => {

            refs.gallery.insertAdjacentHTML("beforeend", creatGalery(data.hits));

            isLastPage(data.totalHits);

            const { height: cardHeight } = document
                .querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * 2.1,
                behavior: "smooth",
            });

            nextPage();

            valueScroll = 0;

            lightbox.refresh();
        })
})

function creatGalery(eve) {
    let markup = "";
    eve.forEach(data => {
        markup = creatEL(data) + markup;
    });

    return markup
}
function isLastPage(e) {
    if (e < 39 * page) {
        refs.btnLoadMore.classList.toggle("ishiden");
        Notify.warning("We're sorry, but you've reached the end of search results.");
    };
}

function nextPage() {
    page += 1;
}

function creatEL(data) {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = data

    return `<a class="gallery__link" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <b>${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <b>${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <b>${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <b>${downloads}</b>
                </p>
            </div></a>`
}

// ======== для скролу

// window.addEventListener('scroll', onscroll)


// function onscroll() {
//     window.addEventListener('scroll', function () {
//         const maxHeightToScroll = refs.gallery.scrollHeight - window.outerHeight * 2;
//         if (window.pageYOffset < refs.gallery.scrollHeight && window.pageYOffset > maxHeightToScroll && valueScroll === 0) {
//             console.log("tak");

//             getFoto(inputValue, String(page))
//                 .then(data => {

//                     refs.gallery.insertAdjacentHTML("beforeend", creatGalery(data.hits));

//                     isLastPage(data.totalHits);

//                     nextPage();

//                     valueScroll = 0;

//                     lightbox.refresh();
//                 })

//             valueScroll += 1;
//         };
//     });
// }