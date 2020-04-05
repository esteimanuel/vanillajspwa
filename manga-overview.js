const mangaOverviewTemplate = `
    <nav>
        <ol>
            <li class="overview-prev"><a><span>prev</span></a></li>
            <li class="overview-next"><a><span>next</span></a></li>
        </ol>
    </nav>
    <ul class="overview-items"></ul>
`;

class MangaOverview extends HTMLElement {
    constructor() {
        super();
    }

    renderOverview(pageIndex, pageSize, data) {
        this.innerHTML = `
            <nav>
                <ol>
                    <li class="overview-prev"><a${ pageIndex > 0 && pageSize >= 25 ? ` href="/?index=${pageIndex - 1}&size=${pageSize}"`: ``}><span>prev</span></a></li>
                    <li class="overview-next"><a${ pageIndex >= 0 && pageSize >= 25  ? ` href="/?index=${pageIndex + 1}&size=${pageSize}"`: ``}><span>next</span></a></li>
                </ol>
            </nav>
            <ul class="overview-items">
            ${data.map(item => `
                <li>
                    <a href="/manga/${item.id}">
                    ${ item.image ? 
                        `<img src="${item.image}" alt="${item.title}" loading="lazy"  onerror="if (this.src != '/images/error.jpg') this.src = '/images/error.jpg';">` : 
                        `<h1>${item.title}</h1>`}
                    </a>
                </li>`).join('')}
            </ul>`;
    }

    getPage(search) {
        let params = new URLSearchParams(search);
        let pageIndex = params.has('index') && Number(params.get('index')) > 0 ? Number(params.get('index')) : 0;
        let pageSize = params.has('size') && Number(params.get('size')) > 25 ? Number(params.get('size')) : 25;
        return { 
            index: pageIndex,
            size: pageSize
        }
    }

    onAfterEnter(context) { 
        this.innerHTML = `
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>`;
            
        let page = this.getPage(window.location.search);
        context.route.action(page.index, page.size).then(data => this.renderOverview(page.index, page.size, data));
        window.addEventListener('popstate', (ev) => {
            let page = this.getPage(ev.target.location.search);
            context.route.action(page.index, page.size).then(data => this.renderOverview(page.index, page.size, data));
        });
    }
}
customElements.define('manga-overview', MangaOverview);