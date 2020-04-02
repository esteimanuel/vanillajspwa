class MangaInfo extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        this._id = "";
        this._title = "";
        this._description = "";
        this._chapters = [];
    }

    onAfterEnter(context) {
        this.id = context.params.manga;
        this.getMangaInfo = (mangaId) => context.route.action(mangaId);
        this.getMangaInfo(this.id).then(data => { 
            this.title = data.title;
            this.description = data.description;
            this.chapters = data.chapters;
        });
    }

    getTitle() {
        let title = this.querySelector('h1');
        if (title) { 
            return title;
        }
        else {
            title = document.createElement('h1');
            this.appendChild(title);
            return title;
        }
    }

    getDescription() {
        let description = this.querySelector('p');
        if (description) { 
            return description;
        }
        else {
            description = document.createElement('p');
            this.appendChild(description);
            return description;
        }
    }

    getList() {
        let list = this.querySelector('ul');
        if (list) { 
            return list;
        }
        else {
            list = document.createElement('ul');
            this.appendChild(list);
            return list;
        }
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get title() { return this._title; }
    set title(value) {
        this._title = value;
        let title = this.getTitle();
        title.innerText = this._title;
    }

    get description() { return this._description; }
    set description(value) { 
        this._description = value; 
        let description = this.getDescription();
        description.innerText = this._description;
    }

    get chapters() { return this._chapters; }
    set chapters(value) { 
        let list = this.getList();
        list.textContent = '';
        this._chapters = value; 
        this._chapters.forEach(chapter => {            
            let link = document.createElement('a');
            let url = `/manga/${this.id}/chapter/${chapter.id}`;
            if (chapter.prev && chapter.next) { 
                url = `${url}?prev=${chapter.prev}&next=${chapter.next}`; 
            } else if (chapter.prev) {
                url = `${url}?prev=${chapter.prev}`;
            } else if (chapter.next) {
                url = `${url}?next=${chapter.next}`;
            }
            link.setAttribute('href', url)
            link.innerText = chapter.title ? chapter.title : `Chapter ${chapter.number}`;
            
            let listItem = document.createElement('li');
            listItem.appendChild(link);

            let list = this.getList();
            list.appendChild(listItem);
        });
    }
}
customElements.define('manga-info', MangaInfo);