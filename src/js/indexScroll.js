import getFoto from "./PixabayAPI";
import { Notify } from "notiflix";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

const refs = {
    form: document.querySelector('.input-holder'),
    gallery: document.querySelector('.gallery'),
    // btnLoadMore: document.querySelector('.load-more')
    searchForm: document.querySelector('.search-wrapper'),
    closeBtn: document.querySelector('.close'),
}


let page = 1;
let inputValue = "";
let valueScroll = 0;
refs.searchForm.addEventListener('click', (e) => {
    searchToggle(e.currentTarget, e)
})

function submit() {
    refs.form.addEventListener('submit', (e) => {
        e.preventDefault()
        inputValue = e.currentTarget.searchQuery.value;

        refs.gallery.innerHTML = "";
        page = 1;
        valueScroll = 0;

        closeForm(refs.searchForm)

        setTimeout(() => {
            getFoto(inputValue, String(page))
                .then(data => {
                    try {
                        Notify.success(`Hooray! We found ${data.totalHits} images.`)
                    } catch (error) {
                        console.log(error);
                    };
                    refs.gallery.insertAdjacentHTML("beforeend", creatGalery(data.hits));

                    // refs.btnLoadMore.classList.remove("ishiden");

                    isLastPage(data.totalHits);

                    lightbox.refresh();

                    // const { height: cardHeight } = document
                    //     .querySelector(".gallery")
                    //     .firstElementChild.getBoundingClientRect();

                    // window.scrollBy({
                    //     top: cardHeight / 3.5,
                    //     behavior: "smooth",
                    // });

                    nextPage()

                    return data;
                })
                .catch(err => {
                    console.log(err);
                    Notify.warning("Sorry, there are no images matching your search query. Please try again.");
                    refs.gallery.innerHTML = "";
                })
        }, 200)
    }, { once: true })
}

// refs.btnLoadMore.addEventListener('click', () => {
//     getFoto(inputValue, String(page))
//         .then(data => {

//             refs.gallery.insertAdjacentHTML("beforeend", creatGalery(data.hits));

//             isLastPage(data.totalHits);

//             const { height: cardHeight } = document
//                 .querySelector(".gallery")
//                 .firstElementChild.getBoundingClientRect();

//             window.scrollBy({
//                 top: cardHeight * 2.1,
//                 behavior: "smooth",
//             });

//             nextPage();

//             valueScroll = 0;

//             lightbox.refresh();
//         })
// })

// ======== для form


function searchToggle(obj, evt) {
    if (!obj.classList.contains('active')) {
        obj.classList.add('active');
        obj.classList.remove('close')
        setTimeout(() => { submit() }, 1000)
        evt.preventDefault();

    }
    else if (obj.classList.contains('active') && evt.target.classList.contains('close')) {
        closeForm(obj)
    }
}

function closeForm(obj) {
    obj.classList.remove('active');
    obj.classList.add('close')
    // clear input
    obj.firstElementChild.firstElementChild.value = "";
}

function creatGalery(eve) {
    let markup = "";
    eve.forEach(data => {
        markup = creatEL(data) + markup;
    });

    return markup
}
function isLastPage(e) {
    if (e < 39 * page) {
        // refs.btnLoadMore.classList.toggle("ishiden");
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

window.addEventListener('scroll', onscroll)


function onscroll() {
    const maxHeightToScroll = refs.gallery.scrollHeight - window.outerHeight * 2;



    if (window.pageYOffset < refs.gallery.scrollHeight && window.pageYOffset > maxHeightToScroll && valueScroll === 0) {
        console.log("tak");

        getFoto(inputValue, String(page))
            .then(data => {

                refs.gallery.insertAdjacentHTML("beforeend", creatGalery(data.hits));

                lightbox.refresh();

                nextPage();

                valueScroll = 0;

                isLastPage(data.totalHits);
            })

        valueScroll += 1;
    }

}