class NotFoundView extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<h1>Page not found</h1>
			The pathname was: ${this.location.pathname}
		`;
	}
}
customElements.define('not-found-view', NotFoundView);