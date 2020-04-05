class MangaInfo extends HTMLElement {
    constructor() { super(); }

    renderInfo(mangaId, data) {
        this.innerHTML = `
            <h1>${data.title}</h1>
            <img src="${data.image}">
            <section>
                <h2>Description</h2>
                <p>${data.description}</p>
                <h2>Categories</h2>
                <ul>
                    ${data.categories.map(category => `
                    <li>${category}</li>`).join('')}
                </ul>
            </section>
            <section>
                <h2>Chapters</h2>
                <ol>
                    ${data.chapters.map(chapter => `
                    <li>
                        <a href=${`/manga/${mangaId}/chapter/${chapter.id}`}>
                        ${chapter.title ? chapter.title : `Chapter ${chapter.number}`}
                        </a>
                    </li>`).join('')}
                </ol>
            </section>
        `;
    }

    onAfterEnter(context) {
        let mangaId = context.params.manga;
        context.route.action(mangaId).then(data => this.renderInfo(mangaId, data));
    }
}
customElements.define('manga-info', MangaInfo);