import { Router } from '/vaadin-router.js';//'https://unpkg.com/@vaadin/router';
const handleJsonResponse = response => response.ok ? response.json() : this.Promise.reject(response);
const logData = data => { console.log('log data', data); return data; };
const handleError = err => console.warn('Something went wrong.', err);
const mangaEdenApi = 'https://www.mangaeden.com/api';
const mangaEdenCdn = 'https://cdn.mangaeden.com/mangasimg';
const reducer = (acc, cur, idx, src) => {
    if (src.length == 0) return acc;
    let item = src[idx];
    if (idx == 0) {
        item.next = src[idx + 1].id;
        acc.push(item);
        return acc;
    } else if (idx == src.length - 1) {
        item.prev = src[idx - 1].id;
        acc.push(item);
        return acc;
    } else {
        item.prev = src[idx - 1].id;
        item.next = src[idx + 1].id;
        acc.push(item);
        return acc;
    }
};

const mapResponseToMangaList = res => res.manga.map(item => { return { id: item.i, title: item.t, url: `${mangaEdenApi}/manga/${item.i}/`, image: item.im ? `${mangaEdenCdn}/${item.im}` : item.im } });

const getMangaList = (pageIndex, pageSize) => {
    let index = Number(pageIndex) ? Number(pageIndex) : 0;
    let size = Number(pageSize) ? Number(pageSize) : 25;
    console.log(`get manga list page index ${index} size ${size}`);
    const url = `${mangaEdenApi}/list/0/?p=${index}&l=${size}`;
    return fetch(url)
        .then(handleJsonResponse)
        .then(mapResponseToMangaList)
        .then(logData)
        .catch(handleError);
};

const mapResponseToMangaInfo = res => {
    return {
        title: res.title,
        description: res.description,
        chapters: res.chapters
            .map(chapter => { return { id: chapter[3], number: chapter[0], title: chapter[2] } })
            .sort((a, b) => a.number - b.number)
            .reduce(reducer, [])
    }
};
const getMangaInfo = (mangaId) => {
    console.log(`get manga info for manga ${mangaId}`);
    const url = `${mangaEdenApi}/manga/${mangaId}/`;
    return fetch(url)
        .then(handleJsonResponse)
        .then(mapResponseToMangaInfo)
        .then(logData)
        .catch(handleError);
}

const mapResponseToMangaChapter = res => {
    return {
        images: res.images
            .map(image => { return { number: image[0], url: `${mangaEdenCdn}/${image[1]}` }; })
            .sort((a, b) => a.number - b.number)
    }
};
const getMangaChapter = (chapterId) => {
    console.log(`get manga info for manga chapter ${chapterId}`);
    const url = `${mangaEdenApi}/chapter/${chapterId}`;
    return fetch(url)
        .then(handleJsonResponse)
        .then(mapResponseToMangaChapter)
        .then(logData)
        .catch(handleError);
}

const outlet = document.getElementById('outlet');
const router = new Router(outlet);
router.setRoutes([
    { path: '/', action: getMangaList, component: 'manga-list' },
    { path: '/manga', action: getMangaList, component: 'manga-list' },
    { path: '/manga/:manga', action: getMangaInfo, component: 'manga-info' },
    { path: '/manga/:manga/chapter/:chapter', action: { getMangaInfo: getMangaInfo, getMangaChapter: getMangaChapter }, component: 'manga-chapter' },
    { path: '(.*)', component: 'not-found-view' },
]);

if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register('serviceWorker.js');
        console.log("Service Worker Registered");
    } catch (error) {
        console.log("Service Worker Registration Failed");
    }
}