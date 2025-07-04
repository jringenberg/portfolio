# Joe Ringenberg CV Site

This is a static HTML version of Joe Ringenberg's CV/portfolio site, converted from a Next.js export.

## Deployment Instructions

1. **Upload the entire `cv` folder** to your web server in the same directory as your `index.html` file
2. **The site will be accessible at** `jringenberg.com/cv/`
3. **All assets are included** - no external dependencies required

## File Structure

```
cv/
├── index.html              # Main CV page
├── cv.css                  # Shared CSS file for all pages
├── favicon.ico             # Site favicon
├── content/                # All media assets
│   ├── media/
│   │   └── profilePhoto.jpg
│   └── writing/            # Case study images and content
└── case-studies/           # Individual case study pages
    ├── ai-design.html      # DuneAI case study
    ├── backed-v1.html      # Backed V1 (NFT loans) case study
    ├── backed-v2.html      # Backed V2 (papr) case study
    ├── video-accessibility.html # Video accessibility at Wistia
    └── better-swag.html    # Corporate swag design
```

## Features

- **Responsive design** - works on mobile and desktop
- **Clean typography** using Inter font
- **Case study pages** with detailed project information
- **Static HTML** - no server-side processing required

## Adding More Case Studies

To add more case studies:

1. Create a new HTML file in the `case-studies/` folder
2. Link to the shared CSS file: `<link rel="stylesheet" href="../cv.css">`
3. Add a link to the case study from the main `index.html` page
4. Include any images in the `content/writing/` folder

## Browser Compatibility

This site works in all modern browsers and is designed to be lightweight and fast-loading. 