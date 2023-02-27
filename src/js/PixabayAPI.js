import axios from "axios";

export default getFoto

const API_KEY = '33961477-1e6f371f275d3640a6a90e8ae';

function getFoto(date, page) {
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${date}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=39`;


    return axios(URL).then(({ data }) => {
        if (data.hits.length > 0) {
            return data
        }
    }).catch(console.log)
}