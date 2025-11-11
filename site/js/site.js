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
}

// Initialize default language from document or default to FR
document.addEventListener('DOMContentLoaded', ()=>{
	const defaultLang = document.documentElement.lang || 'fr';
	setLanguage(defaultLang);
	document.getElementById('lang-fr').addEventListener('click', ()=>setLanguage('fr'));
	document.getElementById('lang-en').addEventListener('click', ()=>setLanguage('en'));
});

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
