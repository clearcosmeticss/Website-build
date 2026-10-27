# 🎬 DIRECTION B IMPLEMENTATION PLAN
## The Cinematic Experience - Mobile-First

**Priority:** 99% mobile traffic = mobile-first design  
**Approach:** Design for vertical mobile, enhance for desktop (not the other way around)

---

## PHASE 1: HOMEPAGE REDESIGN (Week 1-2)

### Mobile-First Sections (Vertical Scroll)

1. **Hero Section** (100vh)
   - Full-screen background image/video
   - Centered headline + subtitle
   - Single primary CTA
   - Gradient overlay for text readability

2. **Philosophy Section** (80vh)
   - Full-width image top
   - Text content below
   - Dark background option
   - Scroll fade-in

3. **Treatments Carousel** (100vh)
   - Horizontal swipe cards
   - Full-screen treatment previews
   - Native touch gestures
   - Snap scrolling

4. **Results Gallery** (Variable)
   - Vertical grid (2 columns on mobile)
   - Tap to expand lightbox
   - Before/after slider
   - Lazy loading

5. **Trust/Social Proof** (60vh)
   - Large testimonial quotes
   - Star ratings
   - Client count stats
   - Swipeable testimonials

6. **Locations** (100vh split)
   - Dublin section
   - Marbella section  
   - Tap to reveal details
   - Integrated maps

7. **Final CTA** (80vh)
   - Atmospheric image
   - Large headline
   - Book Now button
   - WhatsApp alternative

### Sticky Elements (Mobile)
- Fixed "Book Now" button (bottom-right circle)
- Hamburger menu (top-left)
- Hide-on-scroll header

---

## PHASE 2: TREATMENT PAGES (Week 3)

### Mobile Layout
```
Full-screen hero image
↓
Treatment title + price
↓
Description sections (cards)
↓
Before/after slider
↓
What to expect
↓
Book Now CTA (sticky)
```

All existing treatment content preserved, new presentation.

---

## PHASE 3: RESULTS PAGE (Week 4)

### Mobile Gallery
- Masonry grid (2 columns)
- Filter by treatment type
- Tap to expand full-screen
- Swipe between images
- Treatment info overlay

---

## PHASE 4: ABOUT PAGE (Week 4)

### Mobile Structure
- Practitioner photo (full-width)
- Bio content
- Credentials
- Clinic photos
- Contact info

---

## TECHNICAL IMPLEMENTATION

### Typography Stack
```css
/* Primary Headline */
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 600-700;
font-size: 40px (mobile), 64px (desktop);

/* Body Text */
font-family: 'Inter', sans-serif;
font-weight: 400;
font-size: 16px (mobile), 18px (desktop);
line-height: 1.6;
```

### Color System
```css
--cinema-deep: #0D0D0D;
--cinema-fog: #F5F3F0;
--cinema-amber: #D4A574;
--cinema-sky: #E8F1F5;
```

### Motion Performance
- Use `transform` and `opacity` only (GPU-accelerated)
- `will-change` for animations
- Intersection Observer for scroll triggers
- Request Animation Frame for smooth 60fps

### Image Optimization
- Convert JPGs to WebP (80% smaller)
- Responsive images with srcset
- Lazy loading below fold
- Blur placeholder technique

---

## BUILD ORDER

### Today (Session 1):
1. ✅ Audit complete
2. ✅ Directions created
3. ⏳ New homepage HTML (mobile-first)
4. ⏳ New cinematic CSS
5. ⏳ Deploy to preview

### Next Session:
4. Treatment pages redesign
5. Results gallery rebuild
6. About page polish
7. Final QA + production deploy

---

## FILE STRUCTURE

```
index-NEW.html          ← New cinematic homepage
styles-cinematic.css    ← New mobile-first styles
script-cinematic.js     ← New interaction layer

(Keep existing files as backup)
```

---

**Let's build this now.**
