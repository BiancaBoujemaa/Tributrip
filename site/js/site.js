// Placeholder JS for future interactive bits (map, language switching improvements)
console.log('Tributrip site scaffold loaded');

// Simple language toggle by showing/hiding DOM blocks (.lang-fr / .lang-en)
function setLanguage(lang){
	document.querySelectorAll('.lang-fr').forEach(el=>el.style.display = (lang === 'fr') ? '' : 'none');
	document.querySelectorAll('.lang-en').forEach(el=>el.style.display = (lang === 'en') ? '' : 'none');
	// Update lang buttons
	const frBtn = document.getElementById('lang-fr');
	const enBtn = document.getElementById('lang-en');
	if(frBtn && enBtn){
		frBtn.classList.toggle('active', lang === 'fr');
		enBtn.classList.toggle('active', lang === 'en');
	}

	// If AOS is present, refresh to re-run animations after DOM visibility changes
	if(typeof AOS !== 'undefined' && AOS && typeof AOS.refresh === 'function'){
		AOS.refresh();
	}
}

// Initialize default language from document or default to FR
document.addEventListener('DOMContentLoaded', ()=>{
	const defaultLang = document.documentElement.lang || 'fr';
	setLanguage(defaultLang);
	document.getElementById('lang-fr').addEventListener('click', ()=>setLanguage('fr'));
	document.getElementById('lang-en').addEventListener('click', ()=>setLanguage('en'));
});

// Initialize AOS (Animate On Scroll) if present and add a small scroll class toggle
document.addEventListener('DOMContentLoaded', ()=>{
	if(typeof AOS !== 'undefined' && AOS && typeof AOS.init === 'function'){
		AOS.init({ duration: 700, easing: 'ease-in-out', once: false, mirror: false });
	}

	// Refresh AOS when clicking anchor links to trigger animations on navigation
	document.querySelectorAll('a[href^="#"]').forEach(link => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if(href && href !== '#'){
				const target = document.querySelector(href);
				if(target){
					// Use setTimeout to ensure scroll happens after navigation
					setTimeout(() => {
						// Calculate scroll position with offset for fixed header
						const headerHeight = 100; // approximate fixed header height
						const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
						window.scrollTo({
							top: targetTop,
							behavior: 'auto' // use auto instead of smooth to avoid scroll-margin-top conflicts
						});
						
						// Refresh AOS after scroll
						if(typeof AOS !== 'undefined' && AOS && typeof AOS.refresh === 'function'){
							AOS.refresh();
						}
					}, 50);
				}
			}
		});
	});

	// Add a small body.scrolled class for header effects (mimic Strategy toggleScrolled)
	function toggleScrolled(){
		if(window.scrollY > 100) document.body.classList.add('scrolled'); else document.body.classList.remove('scrolled');
	}
	window.addEventListener('load', toggleScrolled);
	document.addEventListener('scroll', toggleScrolled);

	// Mobile nav toggle (simple)
	const mobileToggle = document.querySelector('.mobile-nav-toggle');
	if(mobileToggle){
		mobileToggle.addEventListener('click', ()=>{
			document.body.classList.toggle('mobile-nav-active');
			mobileToggle.classList.toggle('bi-list');
			mobileToggle.classList.toggle('bi-x');
		});
	}
});

// Experiences / Destinations filtering (Traveltime-Blue behavior: Isotope + imagesLoaded)
(function(){
	function fallbackFilter(container, filterValue){
		const items = Array.from(container.querySelectorAll('.destination-item'));
		items.forEach(item => {
			if(filterValue === '*' || !filterValue){
				item.style.display = '';
				return;
			}
			const className = filterValue.startsWith('.') ? filterValue.slice(1) : filterValue;
			item.style.display = item.classList.contains(className) ? '' : 'none';
		});
	}

	document.addEventListener('DOMContentLoaded', ()=>{
		// Scope to Experiences section only
		const experiences = document.querySelector('#experiences');
		if(!experiences) return;

		experiences.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
			const layout = isotopeItem.getAttribute('data-layout') || 'masonry';
			const filter = isotopeItem.getAttribute('data-default-filter') || '*';
			const sort = isotopeItem.getAttribute('data-sort') || 'original-order';
			const container = isotopeItem.querySelector('.isotope-container');
			if(!container) return;

			let iso = null;
			const hasVendors = (typeof Isotope === 'function') && (typeof imagesLoaded === 'function');

			if(hasVendors){
				imagesLoaded(container, () => {
					iso = new Isotope(container, {
						itemSelector: '.isotope-item',
						layoutMode: layout,
						filter: filter,
						sortBy: sort
					});
				});
			} else {
				// Ensure correct default without vendors
				fallbackFilter(container, filter);
			}

			isotopeItem.querySelectorAll('.isotope-filters li').forEach(li => {
				li.addEventListener('click', () => {
					const active = isotopeItem.querySelector('.isotope-filters .filter-active');
					if(active) active.classList.remove('filter-active');
					li.classList.add('filter-active');

					const filterValue = li.getAttribute('data-filter') || '*';
					if(iso){
						iso.arrange({ filter: filterValue });
					} else {
						fallbackFilter(container, filterValue);
					}

					if(typeof AOS !== 'undefined' && AOS && typeof AOS.refresh === 'function'){
						AOS.refresh();
					}
				});
			});
		});
	});
})();

// Simple lightbox for gallery items
(function(){
	function createOverlay(){
		const o = document.createElement('div'); o.className='ltb-overlay';
		const img = document.createElement('img'); img.alt=''; o.appendChild(img);
		const close = document.createElement('div'); close.className='ltb-close'; close.innerHTML='✕'; o.appendChild(close);
		document.body.appendChild(o);
		close.addEventListener('click', ()=>o.classList.remove('show'));
		o.addEventListener('click', (e)=>{ if(e.target===o) o.classList.remove('show'); });
		return o;
	}
	let overlay = null;
	document.querySelectorAll('.gallery-item').forEach(a=>{
		a.addEventListener('click', e=>{
			e.preventDefault();
			const src = a.getAttribute('data-full') || a.querySelector('img').src;
			if(!overlay) overlay = createOverlay();
			overlay.querySelector('img').src = src;
			setTimeout(()=>overlay.classList.add('show'),10);
		});
	});
})();