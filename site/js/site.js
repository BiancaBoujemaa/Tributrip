// Placeholder JS for future interactive bits (map, language switching improvements)
console.log('Tributrip site scaffold loaded');

// Set an initial offset as soon as the script loads (scripts are at end of body).
try{ updateScrollPadding(); }catch(e){}

function getHeaderOffset(){
	const header = document.getElementById('header') || document.querySelector('.header');
	// Safe minimums so headings never land under the fixed header (incl. hash-on-load).
	const minOffset = (window.innerWidth && window.innerWidth < 600) ? 124 : 132;
	if(!header) return minOffset;
	const rect = header.getBoundingClientRect();
	// Header is positioned with an inset from top; include that plus a small breathing room.
	const breathingRoom = 24;
	const measured = Math.ceil(rect.height + Math.max(0, rect.top) + breathingRoom);
	return Math.max(minOffset, measured);
}

function updateScrollPadding(){
	const offset = getHeaderOffset();
	if(offset){
		document.documentElement.style.setProperty('--scroll-offset', `${offset}px`);
		document.body.style.setProperty('--scroll-offset', `${offset}px`);
	}
}

function getScrollAnchorElement(target){
	if(!target) return null;
	if(target.id === 'hero' || target.classList.contains('hero')) return target;
	// Prefer the actual title inside a section/card so it's never hidden by the header.
	const heading = target.querySelector?.('h1, h2, h3, .section-title');
	return heading || target;
}

function scrollToTarget(target, behavior){
	if(!target) return;
	if(target.id === 'hero' || target.classList.contains('hero')){
		window.scrollTo({ top: 0, behavior: behavior || 'smooth' });
		return;
	}
	const anchor = getScrollAnchorElement(target) || target;
	// Use scrollIntoView + CSS scroll-margin-top (driven by --scroll-offset) for fixed headers.
	anchor.scrollIntoView({ behavior: behavior || 'smooth', block: 'start' });
}

function stabilizeScrollToTarget(target){
	if(!target) return;
	// When navigating downward, images/animations can shift layout during smooth scroll.
	// Re-align once the target's images are loaded/decoded (or after a short timeout).
	const maxWaitMs = 1200;
	let done = false;
	const finish = () => {
		if(done) return;
		done = true;
		scrollToTarget(target, 'auto');
	};

	const anchor = getScrollAnchorElement(target) || target;
	const imgs = Array.from(anchor.querySelectorAll?.('img') || []);
	const pending = imgs.filter(img => !img.complete);

	// Always apply a small delayed correction (covers font/layout shifts too)
	setTimeout(finish, 400);
	setTimeout(finish, maxWaitMs);

	if(pending.length === 0) return;
	let remaining = pending.length;
	const onDone = () => {
		remaining -= 1;
		if(remaining <= 0) finish();
	};

	pending.forEach(img => {
		img.addEventListener('load', onDone, { once: true });
		img.addEventListener('error', onDone, { once: true });
		// Best-effort decode for faster stabilization (supported in modern browsers)
		if(typeof img.decode === 'function'){
			img.decode().then(onDone).catch(onDone);
		}
	});
}

// Simple language toggle by showing/hiding DOM blocks (.lang-fr / .lang-en)
function setLanguage(lang){
	document.documentElement.lang = lang;
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
	const frBtn = document.getElementById('lang-fr');
	const enBtn = document.getElementById('lang-en');
	if(frBtn) frBtn.addEventListener('click', ()=>setLanguage('fr'));
	if(enBtn) enBtn.addEventListener('click', ()=>setLanguage('en'));
});

// Initialize AOS (Animate On Scroll) if present and add a small scroll class toggle
document.addEventListener('DOMContentLoaded', ()=>{
	updateScrollPadding();
	// Recompute after fonts/images/layout settle (prevents headings slipping under header)
	window.addEventListener('resize', updateScrollPadding);
	window.addEventListener('load', updateScrollPadding);
	setTimeout(updateScrollPadding, 400);
	setTimeout(updateScrollPadding, 1200);
	if(document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function'){
		document.fonts.ready.then(updateScrollPadding).catch(()=>{});
	}

	if(typeof AOS !== 'undefined' && AOS && typeof AOS.init === 'function'){
		AOS.init({ duration: 700, easing: 'ease-in-out', once: false, mirror: true });
	}

	// Consistent anchor scrolling with fixed-header offset
	document.querySelectorAll('a[href^="#"]').forEach(link => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href');
			if(!href || href === '#') return;
			const target = document.querySelector(href);
			if(!target) return;
			// Ensure offset is up-to-date right before native hash navigation.
			updateScrollPadding();

			// Close mobile nav after navigation
			if(document.body.classList.contains('mobile-nav-active')){
				document.body.classList.remove('mobile-nav-active');
				const mobileToggle = document.querySelector('.mobile-nav-toggle');
				if(mobileToggle){
					mobileToggle.classList.add('bi-list');
					mobileToggle.classList.remove('bi-x');
				}
			}
		});
	});

	// If the page loads with a hash, ensure offset is computed early.
	if(window.location.hash){
		setTimeout(updateScrollPadding, 0);
	}

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