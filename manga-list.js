class MangaList extends HTMLElement {
    constructor() {
        super();
        this._items = [];
        this._index = 0;
        this._size = 26;
    }

    onAfterEnter(context) {  
        let topnav = this.createNav();
        this.appendChild(topnav);
        
        let list = document.createElement('ul');
        this.appendChild(list);

        let bottomnav = this.createNav();
        this.appendChild(bottomnav);

        this.getMangaList = (pageIndex, pageSize) => context.route.action(pageIndex, pageSize).then(data => this.items = data);
        this.getMangaList(Number(this.index), Number(this.size));
    }
    
    createNavButton(text, action, disabled) {
        let navButton = document.createElement('button');
        navButton.setAttribute('class', text);
        navButton.onclick = () => action();
        navButton.disabled = disabled;
        navButton.innerText = text;
        return navButton;
    }

    createNav() {
        let nav = document.createElement('nav');
        let prev = this.createNavButton('prev', () => this.previous(), this.hasPrevious);
        nav.appendChild(prev);
        let next = this.createNavButton('next', () => this.next(), false)
        nav.appendChild(next);
        return nav;
    }

    next() { 
        this.index = this.index + 1;
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set('index', this.index);
        window.history.replaceState({}, '', `${location.pathname}?${searchParams.toString()}`);
    }

    get hasPrevious() { return this.index <= 0 }
    previous() { 
        this.index = this.index - 1;
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set('index', this.index);
        window.history.replaceState({}, '', `${location.pathname}?${searchParams.toString()}`);
    }

    getList = () => this.querySelector('ul');

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

        let placeholder = document.createElement('div');

        if (item.image) {
            let img = document.createElement('img');
            img.setAttribute('loading', 'lazy');
            img.setAttribute('src', item.image);
            img.setAttribute('alt', item.title);
    
            placeholder.appendChild(img);
        }

        let listItem = document.createElement('li');
        listItem.setAttribute('class', 'manga-list-item');
        listItem.appendChild(placeholder);
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
        
        document.getElementById('prev').disabled = this.index <= 0;
    }

    get size() { return this._size; }
    set size(value) { this._size = value; }
}
customElements.define('manga-list', MangaList);