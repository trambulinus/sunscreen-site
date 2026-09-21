# Sunscreen — website

The website for **Sunscreen**, a reapplication timer for Apple Watch. It estimates how
much aging UV has reached your face since you last put sunscreen on — from the UV
forecast, cloud cover, the sun's angle and your watch's Time in Daylight — and tells you
when to reapply.

Live at [sunscreen.watch](https://sunscreen.watch).

## Pages

| | |
|---|---|
| `index.html` | overview — what the app does and why |
| `the-math.html` | the model, function by function, with sources |
| `privacy.html` | privacy policy — the full version of the one shown in the app |
| `support.html` | help and contact |

## Running it

Plain HTML, CSS and a little JavaScript. No build step and no dependencies — open
`index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Every page works without JavaScript; it only adds the hero carousel and a fade-in on scroll.

## About the model page

The numbers on `the-math.html` — the film-persistence studies, the facial dosimetry, the
UVA/UVB ratio — are cited inline and linked to the original papers at the bottom of the
page. The two diagrams are hand-written SVG, plotted from those numbers.

Sunscreen is a general wellbeing tool, not a medical device. The timer is an estimate.
