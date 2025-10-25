// Minimal FilterMenu for gallery filtering
// Usage: new FilterMenu('#filterMenu', categories, onChange)

export class FilterMenu {
	constructor(selector, categories, onChange, counts = {}) {
		this.container = document.querySelector(selector);
		this.categories = categories;
		this.onChange = onChange;
		this.active = categories[0];
		this.counts = counts;
		this.render();
	}

	setCounts(counts) {
		this.counts = counts;
		this.render();
	}

	setActive(category) {
		this.active = category;
		this.render();
		if (typeof this.onChange === 'function') {
			this.onChange(category);
		}
	}

	render() {
		if (!this.container) return;
		this.container.innerHTML = '';
		const menu = document.createElement('nav');
		menu.className = 'filter-menu';
		this.categories.forEach(cat => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'filter-btn' + (cat === this.active ? ' active' : '');
			btn.textContent = cat;
			// Counter logic
			let count = this.counts[cat] || 0;
			if (cat === 'All' && this.counts['All'] !== undefined) count = this.counts['All'];
			if (count > 0 || cat === 'All') {
				const sup = document.createElement('sup');
				sup.className = 'filter-count';
				sup.textContent = count;
				btn.appendChild(sup);
			}
			btn.onclick = () => this.setActive(cat);
			menu.appendChild(btn);
		});
		this.container.appendChild(menu);
	}
}
