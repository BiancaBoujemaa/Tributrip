Tributrip — initial scaffold

Files created:
- index.html — one-page scaffold using the Strategy/Traveltime layout ideas
- css/style.css — brand color variables and basic styles
- js/site.js — placeholder JS
- img/ — placeholder for images (add hero.jpg etc.)

How to preview:
Open `d:\Work\MasterDPM\Tributrip\site\index.html` in your browser (double-click or use a local static server).

Next recommended steps:
- Add brand fonts (Outfit, Playpen Sans) and logo to `img/` and update `index.html` head
- Replace placeholder hero image with a high-quality photo or video (for video, update HTML/CSS to use <video>)
	- The scaffold now references the Traveltime video at `selected-templates/traveltime-blue/assets/img/travel/video-2.mp4` as the hero background (uses a poster fallback image). If you prefer the video copied into `site/`, I can move it into `site/video/` (note: it may be large).
	- A lightweight SVG logo was added at `site/img/logo.svg` (replace with your official logo file if you have one).
	 - Fonts and theme: I installed `Outfit` (headings) and `Quicksand` (body) from Google Fonts to match the Tributrip moodboard. Quicksand is used here as a soft substitute for `Playpen Sans` until you provide the official Playpen Sans files (WOFF/WOFF2). To use Playpen Sans locally, drop the font files into `site/fonts/` and I will add @font-face rules and update `css/style.css`.
	 - Visual updates: primary colors (Safety Orange, Prussian Blue, Bisque, Deep Saffron, Gingerbread) have been wired into `css/style.css`. Navigation, hero, buttons and cards were styled to reflect the moodboard.
	 - Logo: I wired the existing logo from `old-site/logo.png` into the header (used via relative path `../old-site/logo.png`). If you prefer the site to be self-contained, I can copy `old-site/logo.png` into `site/img/logo.png` and update the path.
	 - Gallery: I added a gallery section using images from the Montana template (`selected-templates/montana/img/instragram/*.png`). Clicking a thumbnail opens a simple lightbox. If you'd like the images copied into `site/img/gallery/` to make the site self-contained, tell me and I will copy them.
	 - Featured Rooms: I replaced the gallery with a "Featured Rooms" section adapted from the Montana template (uses images at `selected-templates/montana/img/rooms/*.png`). The section is bilingual (FR/EN) and links the CTA to the contact section.
- Wire the interactive map (Leaflet) and add a hosts JSON
- Implement bilingual content (FR/EN) using a small JSON with translations or duplicate sections
- Replace contact form action with working backend or use a service (Formspree) or the `contact_process.php` script from `montana` if you want PHP handling

Formspree setup (no PHP/server required):
- Create a free form on Formspree and copy your endpoint URL (looks like `https://formspree.io/f/xxxxxxx`).
- Current endpoint configured in this repo: `https://formspree.io/f/xovpqaln`

If you want, I can now:
- Populate the site with your real copy (you can paste text here)
- Install the chosen fonts and update the header
- Swap the hero image for a video from `traveltime-blue`
