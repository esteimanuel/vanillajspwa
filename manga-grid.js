class MangaGrid extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        this._items = [];
        this._index = 0;
        this._size = 25;
    }

    onAfterEnter(context) {
        // if (this.index > 0) {
            let prev = document.createElement('button');
            prev.setAttribute('id', `prev`);
            prev.onclick = () => { this.index = this.index - 1; };
            // prev.setAttribute('href', `/manga?index=${Number(this.index) - 1}&size=${this.size}`);
            prev.innerText = 'prev';
            if (this.index <= 0) { prev.disabled = true; }
            this.appendChild(prev);
        // }

        let next = document.createElement('button');
        next.setAttribute('id', `next`);
        next.onclick = () => this.index = this.index + 1;
        // next.setAttribute('href', `/manga?index=${Number(this.index) + 1}&size=${this.size}`);
        next.innerText = 'next';
        this.appendChild(next);

        this.getMangaList = (pageIndex, pageSize) => context.route.action(pageIndex, pageSize).then(data => this.items = data);
        this.getMangaList(Number(this.index), Number(this.size));
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

    clearItems() {
        let list = this.getList();
        list.textContent = '';
        this._items = [];
    }

    addItem(item) {
        let link = document.createElement('a');
        link.setAttribute('href', `/manga/${item.id}`);
        link.setAttribute('id', item.id);
        link.innerText = item.title;

        let listItem = document.createElement('li');
        listItem.setAttribute('class', 'manga-list-item');
        listItem.appendChild(link);

        let list = this.getList();
        list.appendChild(listItem);
    }

    get items() { return this._items; }
    set items(value) {
        this.clearItems();
        console.log(value);
        this._items = value;
        this._items.forEach(item => this.addItem(item));
    }

    get index() { return this._index; }
    set index(value) { 
        console.log('index updated ', value)
        this._index = value >= 0 ? value : 0;
        this.getMangaList(Number(this.index), Number(this.size));
    }

    get size() { return this._size; }
    set size(value) { this._size = value; }
}
customElements.define('manga-grid', MangaGrid);