class MangaChapter extends HTMLElement {
    constructor() {
        super();
        this._mangaId = "";
        this._id = "";
        this._images = [];
    }

    onAfterEnter(context) {
        this.mangaId = context.params.manga;
        let chapterId = context.params.chapter;
        
        let container = document.createElement('div');
        container.setAttribute('class', 'images-container');
        this.appendChild(container);

        let nav = document.createElement('nav');
        this.appendChild(nav);

        this.getMangaChapter = (chapterId) => context.route.action.getMangaChapter(chapterId);
        this.getMangaChapter(chapterId).then(data => { 
            this.images = data.images;
        });
        
        this.getMangaInfo = (mangaId) => context.route.action.getMangaInfo(mangaId);
        this.getMangaInfo(this.mangaId).then(data => {
            let current = data.chapters.find(chapter => chapter.id === chapterId);
            if (current.prev) this.prev = current.prev;
            if (current.next) this.next = current.next;
        });
    }

    get images() { return this._images; }
    set images(value) { 
        this._images = value; 
        let container = document.querySelector('.images-container');
        container.innerText = '';
        this._images.forEach(image => {
            var img = document.createElement('img');
            img.setAttribute('src', image.url);
            img.setAttribute('width', '100%');
            img.setAttribute('min-height', '100px');
            img.setAttribute('loading', 'lazy');
            container.appendChild(img);
        });
    }

    get prev() { return this._prev; }
    set prev(value) {
        this._prev = value;

        let link = document.createElement('a');
        link.setAttribute('href', `/manga/${this.mangaId}/chapter/${value}`)
        link.innerText = 'prev';
        let nav = document.querySelector('nav');
        nav.appendChild(link);
    }

    get next() { return this._next; }
    set next(value) {
        this._next = value;

        let link = document.createElement('a');
        link.setAttribute('href', `/manga/${this.mangaId}/chapter/${value}`)
        link.innerText = 'next';
        let nav = document.querySelector('nav');
        nav.appendChild(link);
    }
}
customElements.define('manga-chapter', MangaChapter);