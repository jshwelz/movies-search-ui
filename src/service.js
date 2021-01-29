import axios from 'axios';

export const newsService = {
    getTestData,
};

function getTestData(page, pageSize, sorted, filtered, handleRetrievedData) {
    let url = "https://reactnative.dev/movies.json";
    let postObject = {
        page: page,
        pageSize: pageSize,
        sorted: sorted,
        filtered: filtered,
    }; 

    return post(url, postObject).then(response => handleRetrievedData(response)).catch(response => console.log(response));
}

function post(url, params = {}) {
    return axios.get(url)
}