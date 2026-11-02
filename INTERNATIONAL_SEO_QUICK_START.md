# International SEO Quick Start (5 Minutes)

Get your blog indexed and visible to international audiences in minutes.

## 🚀 Do These 5 Things First

### 1. Fix Your Domain (1 minute)

**File:** `astro.config.mjs`

```javascript
site: 'https://yourblogdomain.com', // ← Change this to YOUR domain
```

Save and rebuild:
```bash
npm run build
```

**Why:** This fixes all canonical tags, sitemap, and social sharing.

---

### 2. Update Google Search Console (2 minutes)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Paste your domain: `https://yourblogdomain.com`
4. Verify ownership (copy HTML file from Netlify config)
5. Submit sitemap: `https://yourblogdomain.com/sitemap.xml`

**Why:** Google won't index your site without this. This is non-negotiable.

---

### 3. Add Google Analytics (1 minute)

1. Create account at [Google Analytics](https://analytics.google.com)
2. Get your ID (looks like `G-XXXXXXXXXX`)
3. Add to `src/layouts/BaseLayout.astro` in `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR_ID');
</script>
```

**Why:** Track where international visitors come from and what they read.

---

### 4. Set Up Netlify (1 minute)

1. Push code to GitHub: 
```bash
git add .
git commit -m "Initial English version"
git push -u origin main
```

2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select GitHub, choose repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy!

**Why:** Your site needs to be live for SEO to work.

---

### 5. Test Your Setup (Verification)

Verify these 3 things work:

**Test 1:** Visit your site
```
https://yourblogdomain.com
```
✅ Should load without errors

**Test 2:** Check sitemap exists
```
https://yourblogdomain.com/sitemap.xml
```
✅ Should show list of URLs

**Test 3:** Check robots.txt
```
https://yourblogdomain.com/robots.txt
```
✅ Should allow Google crawlers

---

## 📝 Start Writing SEO Content (30 Minutes)

### Article Template

**File Path:** `src/content/blog/how-to-organize-apartment-kitchen.md`

```markdown
---
title: "How to Organize a Small Apartment Kitchen – Pantry Storage Ideas"
description: "Real pantry organization for small apartments. See measurements, costs, and before-after photos from my 30cm deep kitchen setup."
pubDate: 2024-02-01
category: "Kitchen"
tags: ["pantry-storage", "small-kitchen", "apartment-living"]
image: "/assets/images/pantry-before-after.jpg"
---

## Why I Needed Better Pantry Organization

My kitchen is small. My pantry is even smaller. Every time I need something from the back shelf, I have to literally half-crawl into the cabinet...

## The Problem with My Original Setup

- Hard to access back items
- No visibility of what I had
- Things got lost and wasted
- Cost me about $150/year in forgotten food

## My Solution: Pull-Out Baskets

After trying 3 different systems, here's what actually worked...

[Include real photos here]

## Real Numbers

**What I spent:**
- 2 pull-out basket organizers: $89
- Installation labor (DIY): 2 hours
- **Total cost: $89**

**What I saved:**
- Less food waste: $80/year
- Better visibility: priceless

## Honest Evaluation

**Would I do it again?** Yes, 100%.

**What I'd do differently:** Buy sturdier baskets. These cheap ones wobble slightly.

## What This Taught Me

When you can see what you have, you use it. Organization isn't about pretty containers—it's about access.

---

*Updated: February 2024*
```

**Key SEO elements:**
- Title includes main keyword ("apartment kitchen") + benefit ("pantry storage")
- Description includes numbers and proof ("30cm", "real photos")
- Tags are searchable terms, not generic
- Real measurements and costs (E-E-A-T signals)

---

## 🎯 Article Ideas (Copy-Paste Ready)

Use these title templates to start brainstorming:

### Kitchen
- "How to Organize a [Size] Deep Pantry – [Your Location]"
- "[Product Type] vs [Product Type] – Pantry Organization Comparison"
- "Under-Bed Storage vs Wall Shelving – Small Bedroom Storage"

### Small Space
- "Small Apartment [Room] Organization – [Square Feet] Budget"
- "No-Drill Storage Solutions for Renters – Everything I Tested"
- "Rental-Friendly Organization – What Works After [Number] Moves"

### Bathroom
- "Small Bathroom Storage Ideas – [Size] Bathroom Solutions"
- "No-Cabinet Bathroom Organization – [Type] Solutions"
- "Under-Sink Storage – How to Organize Around Plumbing"

### Closet
- "Closet Organization on a Budget – [Amount] Spent"
- "How to Maximize a [Size] Closet – Depth & Width Guide"
- "Small Closet Double Hanging – Installation Guide"

### General
- "[Location] Apartment Organization – Room-by-Room"
- "Organization Routine That Actually Works – [Number] Months In"
- "[Organization Method] – Real Experience Using It"

---

## 🌍 International SEO in 30 Seconds

**DO:**
- Use US measurements (6 inches, not 15cm)... but add metric in parentheses
- Write for global audience (avoid regional idioms)
- Focus on universal problems (small space, storage, rentals)
- Use clear, simple English

**DON'T:**
- Mix languages in same article
- Use time references that become outdated ("Last year")
- Assume readers know US geography
- Overuse local currency

---

## 📱 Pinterest Strategy (Extra Traffic)

Pinterest = 40% of blog traffic for home organization.

**Create 1 pin per article:**

Image size: **1000 x 1500 pixels** (vertical)

Pin description:
```
How to Organize a Small Apartment Kitchen [2024] | Pantry Storage Ideas

My complete kitchen organization system with actual measurements and costs.

Full guide: https://yourblogdomain.com/kitchen/apartment-kitchen/
```

**Best boards to join:**
- Kitchen Organization
- Small Space Living
- Home Organization
- Apartment Hacks
- Storage Solutions

---

## 📊 Monitoring Progress

### Weekly (1 minute)
- Open [Google Search Console](https://search.google.com/search-console)
- Check if any errors appeared

### Monthly (5 minutes)
- Open [Google Analytics](https://analytics.google.com)
- How many visitors this month vs last month?
- Where are they from? (Countries → continents)
- Which articles got the most traffic?

### Quarterly (15 minutes)
- List top 10 keywords you're targeting
- Check if you rank for them (search: `site:yourblogdomain.com keyword`)
- Update 1-2 old articles with new info

---

## 🚀 Month 1 Content Plan

This is a realistic month 1 plan:

**Week 1:** Build foundation
- [ ] Deploy website (this checklist)
- [ ] Write "About" page
- [ ] Set up analytics

**Week 2:** First articles
- [ ] Write 2 pillar articles (1200+ words each)
- [ ] Create dimension guide (500 words, high Pinterest value)
- [ ] Create checklist (400 words)

**Week 3:** Support content
- [ ] Write 2 more articles
- [ ] Create Pinterest pins for all 5 articles
- [ ] Get first backlinks by mentioning in relevant forums

**Week 4:** Optimization
- [ ] Submit to Google Search Console
- [ ] Review analytics
- [ ] Update 1 article based on early feedback

**Month 1 goal:** 5-7 published articles, 100+ organic visitors

---

## 🔗 Top 3 International SEO Resources

1. **Google's Official Guide**
   https://developers.google.com/search/docs/beginner/seo-starter-guide

2. **Moz's Beginner's Guide**
   https://moz.com/beginners-guide-to-seo

3. **Neil Patel's Blog Setup Guide**
   https://neilpatel.com/blog/seo-blog/

---

## ✅ Pre-Launch Checklist

Before you publish your first article:

- [ ] Domain configured in `astro.config.mjs`
- [ ] Site deployed to Netlify
- [ ] Google Search Console configured
- [ ] Google Analytics added
- [ ] About page filled with your real info
- [ ] Contact email in footer
- [ ] Affiliate disclosure page (if using affiliate links)
- [ ] Privacy policy page (required for analytics)
- [ ] First 3 articles ready to publish

---

## 🆘 If Something Breaks

**"I changed my domain but site still says old one"**
```bash
npm run build
# Deploy again
```

**"Google says 'no content' even though I published"**
- Wait 1-2 weeks (first index takes time)
- Submit sitemap manually: Google Search Console → Sitemaps → Add `sitemap.xml`

**"Site loads but pages are blank"**
- Clear `.astro/` cache:
```bash
rm -r .astro dist
npm run build
```

**"Images not showing"**
- Verify images are in `public/assets/images/`
- Use correct path: `/assets/images/filename.jpg` not `assets/images/filename.jpg`

---

## 🎯 Your Mission This Week

1. ✅ Update domain in config
2. ✅ Deploy to Netlify  
3. ✅ Set up Google Search Console
4. ✅ Add Analytics
5. ✅ Write first article
6. ✅ Submit sitemap
7. ✅ Publish!

**Start here:**
```bash
npm run dev
# Then write your first article while local dev runs
```

---

**You've got this!** Questions? Check `SEO_STRATEGY.md` for deeper info.

Good luck with international SEO! 🚀🌍

