Some Sanchara trip site
=======================
index.html   Ready to host. Loads styles.css, script.js, and images from assets/.
assets/      Logo and Instagram QR images, plus the original logo artwork
             (emblem-source.png) and the emblem-only animation crop (emblem.png).
source/      template.html (editable source) and build.py.
             To rebuild index.html after editing: copy build.py and template.html
             next to an assets/ folder and run: python3 build.py

Edit trip details, prices and itineraries in the TRIPS / CITIES / PACK objects
near the top of the script in template.html.
Fonts load from Google Fonts, so the page needs an internet connection for the typefaces.


UPDATE: Kumaraparvatha and Netrani pages
----------------------------------------
This site is plain HTML/CSS/JS (no React). index.html is now edited directly, so do NOT run
source/build.py any more: it would overwrite index.html with the older template.

index.html                                  Homepage (4 package cards)
itineraries/kumaraparvatha-trek/index.html  Trek page   (theme: trek.css)
itineraries/netrani-scuba-diving/index.html Dive page   (theme: dive.css)
itinerary.css / itinerary.js                Shared styles + behaviour for both pages
scenes.css                                  Animated illustration styles (cards + pages)

Preview locally:  python3 -m http.server 8000   then open http://localhost:8000
Real photos: the illustrated scenes are placeholders. Put a photo in assets/ and set
data-photo="../../assets/yourphoto.jpg" on the .scene (hero) or any .tile (gallery) element.

UPDATE 2: six trip pages
------------------------
Pages (each has its own theme css next to it):
  itineraries/kumaraparvatha-trek   itineraries/netravati-peak-trek   itineraries/kudremukha-trek   (Trekking)
  itineraries/gokarna               itineraries/netrani-scuba-diving                                (Beaches & sea)
  itineraries/hampi                                                                                  (Historic places)
The homepage has three sections (Trekking, Beaches & sea, Historic places) and no longer has the
details/tabs block. The "Plan your seats" planner on the homepage still covers Hampi and Gokarna.
Netravati and Kudremukha show "Ask the team" because no price was provided: add one by editing the
card in index.html and passing a price to booking() when you regenerate, or edit the page directly.
