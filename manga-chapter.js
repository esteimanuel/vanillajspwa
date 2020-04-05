const template = `
    <nav>
        <ol>
            <li class="chapter-prev"><a><span>prev</span></a></li>
            <li class="chapter-next"><a><span>next</span></a></li>
        </ol>
    </nav>
    <div class="chapter-images"></div>
`;

class MangaChapter extends HTMLElement {
    constructor() { 
        super(); 
    }

    renderNav(mangaId, chapterId, data) {
        if (!data) return;
        let current = data.chapters.find(chapter => chapter.id === chapterId); 
        
        let prev = document.querySelector('.chapter-prev a');
        if (current.prev) prev.setAttribute('href', `/manga/${mangaId}/chapter/${current.prev}`);

        let next = document.querySelector('.chapter-next a');
        if (current.next) next.setAttribute('href', `/manga/${mangaId}/chapter/${current.next}`);
    }

    renderChapters(data) {
        if (!data) return;
        document.querySelector('.chapter-images').innerHTML = 
            data.images
            .map(image => `<img src="${image.url}" loading="lazy">`)
            .join('');
    }

    onAfterEnter(context) {
        this.innerHTML = template;
        let mangaId = context.params.manga;
        let chapterId = context.params.chapter;

        context.route.action
            .getMangaChapter(chapterId)
            .then(data => this.renderChapters(data));
        
        context.route.action
            .getMangaInfo(mangaId)
            .then(data => this.renderNav(mangaId, chapterId, data));
    }
}
customElements.define('manga-chapter', MangaChapter);