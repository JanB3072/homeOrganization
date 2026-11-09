// Pillar copy for category and subcategory hub pages. Rendered via HubIntro.astro
// (set:html). Each entry is written in Clara's voice: real failures from a
// 580 sq ft pre-war Chicago rental, measured numbers, and the mechanism behind
// why storage fails where it does. No em dash, no AI connectives, no listicle
// templates. Each piece explains the "why", not just the "what".
//
// Keys:
//   categoryIntro        -> category label exactly as used on the index pages
//   subcategoryIntro     -> `${category}/${subcategory}` exactly as passed to
//                           SubcategoryLayout (e.g. "Kitchen/Cabinets")

export const categoryIntro: Record<string, string> = {
  Kitchen: `
<p>The first kitchen organizer I bought was a two-tier turntable for the corner cabinet. It arrived, I bolted it in, and discovered the corner is 24 inches deep but only 14 at the front opening, so the back half of every tier was dead space I could never reach. That corner taught me more about my kitchen than any "10 must-haves" list ever did: storage fails by location, not by category.</p>
<p>The pantry fails by hiding its own back row, so a box bought in March is still there in September. The fridge fails by temperature, not space: the door shelf swings through a zone roughly 10 degrees warmer than the crisper, and a leftover parked there spoils while the inside stays fine. The cabinets fail by opening, not volume: my 22-inch-deep cabinets only clear 20.5 at the door, and a rack that fits the box will not close if it sits proud of the frame.</p>
<p>I split the writing here the way the room actually behaves. Start with the zone that wastes the most food in your house, usually the <a href="/kitchen/pantry/">pantry</a>, then the <a href="/kitchen/fridge/">fridge</a>, then the <a href="/kitchen/cabinets/">cabinets and counters</a>. If you change only one thing, change the thing you open before coffee.</p>
`,

  Closet: `
<p>My closet is a 36-inch-wide alcove with a bowed rod and a floor that slopes toward the window. For two years I treated it as a single failure, "not enough space," and kept buying organizers to add space. What actually broke was simpler: hanging, folded, small, and seasonal stuff each fail a different way, and one kit cannot fix all four at once.</p>
<p>The hanging side is a math problem, rod height against the longest dress, and whether a second rod steals light from the first. The folded side lives or dies by whether a divider holds a stack at the fourth sweater or lets it slump. Accessories escape, not because they are messy but because they are small and the wrong container tangles them. Seasonal items fail at the handoff, when October needs the coat January forgot.</p>
<p>Pick your worst of the four and start there: <a href="/closet/clothing/">clothing</a>, <a href="/closet/accessories/">accessories</a>, <a href="/closet/shoes/">shoes</a>, or <a href="/closet/seasonal/">seasonal storage</a>. The posts are written from this 36-inch alcove, not a showroom.</p>
`,

  Bathroom: `
<p>A bathroom is the smallest room in the house and the only one with a plumbing code attached to its storage. I learned this under my 24-inch vanity, where I planned a neat row of bins and then measured the P-trap: the pipe and the trap ate a third of the cabinet floor, and the bins I picked sat on top of the pipe instead of beside it.</p>
<p>After that I stopped designing around the container and started designing around the pipe, the humidity, and the door swing. Humidity is the quiet killer. Unsealed wood and cardboard both stained within a year in my steamy bath, and I still have the marks. The writing splits into the <a href="/bathroom/vanity/">vanity</a> (counter, drawers, mirror) and everything else in the <a href="/bathroom/storage/">storage</a> zone, from over-the-toilet to the shower wall.</p>
`,

  'Small Space': `
<p>Small-space storage has one rule that took me three apartments to learn: the object has to earn its footprint twice. A bin that only stores is a liability the day it is empty. A bin that stores and also sits, or stores and divides a room, pays rent.</p>
<p>I rent a one-bedroom, so every square foot gets reviewed quarterly whether I like it or not. The pieces here are the double-duty furniture, the wall space nobody calls a shelf until they need it, and the collapse-and-forget bins that vanish when the season ends. Written for renters, not for staging.</p>
<p>Two angles help most: <a href="/small-space/apartment/">apartment-level furniture and layout</a>, or <a href="/small-space/storage/">storage that disappears when you do not need it</a>.</p>
`,

  Declutter: `
<p>Most decluttering advice is motivation wearing a method's clothes. I wanted the opposite: a method I could run at 9 p.m. on a Wednesday without a trash-bag epiphany, something that worked on the "just in case" drawer as cleanly as on the obvious junk.</p>
<p>What stuck were the rules with a number attached, a starting point for the days the whole house feels too big to begin, and a plan for the move that does not become a second move of things I should have left behind. None of it asks you to become a minimalist. It asks you to be honest about what you reached for last year.</p>
<p>Shortest version first: the <a href="/declutter/methods/">methods</a>. Packing boxes instead? Go to <a href="/declutter/moving/">decluttering for a move</a>.</p>
`,

  Guides: `
<p>These are the long ones, the system-level write-ups that tie a room to the next instead of fixing one drawer. They take more than ten minutes on purpose, because the payoff is a house that runs without you thinking about it, not a single photogenic shelf.</p>
<p>I write them the way I organize: measure first, buy last, and assume the system has to survive a normal messy week, not a cleaning binge. The cornerstone is the whole-home map that shows how rooms hand off, so solving the kitchen does not create a hallway problem. Start with <a href="/guides/systems/">the systems overview</a>.</p>
`,
};

export const subcategoryIntro: Record<string, string> = {
  'Kitchen/Cabinets': `
<p>Cabinets lie about their size. The opening is narrower than the box, the door swing steals an inch and a half, and the "holds thirty pounds" rating is per rack, not per shelf. I learned this with a pan rack that fit the cabinet beautifully in the living room and then would not close once the door was back on.</p>
<p>The fixes that held were unglamorous: cookware standing on its edge instead of stacked and clanging, lids corralled so they stop being a second archaeology dig, drawers divided so a spoon and a spatula are not fighting for one lane. Every recommendation came out of my 22-inch-deep Chicago cabinets, measured twice. The two I would read first are the <a href="/blog/best-pan-organizer-rack-for-kitchen-cabinet/">pan rack comparison</a> and the <a href="/blog/kitchen-baking-sheet-organizer-rack-vertical-cabinet/">baking-sheet standoff</a>.</p>
`,

  'Kitchen/Fridge': `
<p>The fridge is the only appliance you reorganize while hungry, which is why it always goes wrong. The real fix is not more bins, it is zones keyed to temperature, because the door shelf and the crisper are not the same climate.</p>
<p>I cleaned my condenser coils on a whim and the compressor run time dropped enough that I noticed the electric bill. That told me the invisible maintenance matters as much as the visible layout. The posts here cover both: where cold food actually stays safe, and how to keep the thing from running hot while it looks tidy. See <a href="/blog/how-to-clean-refrigerator-coils-step-by-step/">coil cleaning</a> and <a href="/blog/aesthetic-fridge-organization-tips/">layout that survives a real week</a>.</p>
`,

  'Kitchen/Pantry': `
<p>A pantry's job is to make you use what you buy, and most pantries fail by hiding their own back row. The trick is not more containers, it is fewer and wider categories, and a system where the oldest box surfaces before the new one instead of behind it.</p>
<p>I keep dry goods in airtight containers sized to the shelf, not the product, and I label the things that look identical once they are frozen. This came from a bag of flour that lived next to a bag of cornstarch for a year before I grabbed the wrong one mid-recipe. The pieces here are written around a real shallow pantry, not a walk-in. Start with <a href="/blog/best-airtight-food-storage-containers-for-flour-and-sugar/">airtight containers for flour and sugar</a>.</p>
`,

  'Closet/Clothing': `
<p>Closet clothing storage lives or dies by two numbers: rod height and the longest thing you hang. I raised my rod and added a second one before buying a single organizer, and that alone killed half the floor pile, because the floor pile was really "things with no rod left."</p>
<p>The folded side is its own problem: a divider that holds a stack upright at the third sweater but lets it slump at the fourth is worse than no divider, because it hides the failure. The posts here are the hanging math and the folded reality, measured in that 36-inch alcove. See <a href="/blog/vertical-closet-system-maximize-small-wardrobe/">the vertical system</a> and <a href="/blog/closet-shelf-dividers-for-folded-sweaters/">shelf dividers that actually hold</a>.</p>
`,

  'Closet/Accessories': `
<p>Accessories are the escape artists of the closet: scarves tangle, jewelry knots, purses slump. The mistake is treating them as decoration to display instead of small inventory to contain, which is why a pretty tray becomes a junk drawer with better lighting.</p>
<p>I keep jewelry in a box with drawers sized to the chain, not the collection, and scarves on a hanger that shows all of them at once instead of just the three on top. The two posts here came from buying the wrong thing first, so you do not have to: <a href="/blog/closet-jewelry-organizer-box-with-drawers/">jewelry box with drawers</a> and <a href="/blog/best-scarf-organizer-hanger-for-closet/">scarf hanger</a>.</p>
`,

  'Closet/Shoes': `
<p>Shoes are the easiest thing to over-store. Clear boxes sound tidy until you own forty of them and cannot find the pair you want without opening ten, so the system that was supposed to save time now costs it.</p>
<p>The honest version is fewer boxes, visible fronts, and a rule about what earns a box at all: daily drivers stay out, seasonal pairs get contained, the rest do not get a cube. The comparison here is the one I wish I had before I bought a stack that did not fit the shelf it was meant for. See <a href="/blog/clear-plastic-shoe-boxes-stackable-design/">clear stackable shoe boxes</a>.</p>
`,

  'Closet/Seasonal': `
<p>Seasonal storage is really migration storage, and migrations go wrong at the handoff. The coat you pack in October is the coat you cannot find in a January thaw, usually because it went into a bin with no plan for October.</p>
<p>I keep off-season items in one reachable place, labeled by the month they return, not by what they are, so the bin I open in March is the bin I need in March. The posts here are about that handoff and about not turning seasonal storage into a second closet you forgot you owned.</p>
`,

  'Bathroom/Storage': `
<p>Bathroom storage that is not the vanity has one rule I learned from a stained wall: it must survive humidity. Cardboard, unsealed wood, and backless shelves all failed within a year in my steamy bath, and the marks are still there.</p>
<p>The posts here cover the over-the-toilet wall, the under-sink cabinet planned around the P-trap (not against it), the shower caddy that actually drains instead of growing a film, and the wire baskets that hold toiletries off the floor without trapping moisture. Measured against my own small bath. Start with <a href="/blog/over-the-toilet-storage-ideas/">over-the-toilet storage</a> or <a href="/blog/how-to-organize-under-bathroom-sink/">under-sink organization</a>.</p>
`,

  'Bathroom/Vanity': `
<p>The vanity is the most-touched surface in the bathroom and the easiest to lose to a single soap pump. The win is not a bigger counter, it is a counter that stays empty because the drawer beneath it actually works, which means dividing by the thing you reach for most, not the thing that photographs well.</p>
<p>I also learned the hard way that marble and an acidic cleaner do not mix: a citrus spray etched a ring into my rental's counter in one wipe, and the deposit did not cover it. The posts here run from drawer to mirror to the makeover that costs less than a dinner out. See <a href="/blog/bathroom-vanity-drawer-organization-tips/">drawer organization</a> and <a href="/blog/diy-bathroom-vanity-makeover-on-a-budget/">the budget makeover</a>.</p>
`,

  'Declutter/Methods': `
<p>Methods are the part of decluttering that scales to a normal life. A rule you can apply at 9 p.m. to one drawer beats a philosophy you need a free weekend to start, because the free weekend never comes.</p>
<p>The posts here are the ones I run on repeat: a rule with a real number behind it (the 20/20 one), a way to start when the whole house is too much, and a Swedish method that is less about death than about not leaving a mess for anyone. None require you to become a different person. Start with <a href="/blog/20-20-decluttering-rule-explained/">the 20/20 rule</a> or <a href="/blog/how-to-start-decluttering-when-overwhelmed/">starting when overwhelmed</a>.</p>
`,

  'Declutter/Moving': `
<p>Moving is the one time decluttering is forced, and most people spend the move hauling things they should have left. The trick is to decide at the box, not at the new closet, because a box you debate in the new place has already cost you the lift, the truck, and the stairwell.</p>
<p>The write-up here is the pre-move cut I wish I had tracked the first time, because the cost of moving an unused thing is always higher than the cost of replacing it later, and almost never do you replace it. See <a href="/blog/swedish-death-cleaning-method-checklist/">the Swedish method checklist</a> for the same logic applied to a whole life.</p>
`,

  'Guides/Systems': `
<p>Systems are the long view: how rooms hand off to each other so solving the kitchen does not create a hallway problem. This is the overview the single-room posts plug into, the map before the measuring tape.</p>
<p>I built it around a real one-bedroom, measuring first and buying last, assuming the system has to survive a normal messy week. The cornerstone is the <a href="/blog/whole-home-organization-system/">whole-home organization system</a>, and from there you pull in whichever room is fighting you this month.</p>
`,

  'Small Space/Apartment': `
<p>Apartment organizing has one constraint a house does not: you cannot renovate your way out of it. Every piece of furniture has to earn its footprint twice, and the layout matters more than any bin, because a wrong purchase in a one-bedroom shows up every single day.</p>
<p>The posts here are the double-duty furniture and the layout calls I made in my own place, where a too-wide nightstand blocked the closet door for a month before I admitted the mistake. Written for renters. Start with <a href="/blog/best-furniture-for-small-apartments-double-duty/">double-duty furniture</a>.</p>
`,

  'Small Space/Storage': `
<p>Storage in a small space has to disappear when you do not need it, or it becomes the clutter. Collapsible, wall-mounted, and gap-filling storage win; big rigid bins lose the moment they are empty and still in the room, taking up the floor they were meant to free.</p>
<p>The pieces here are the floating shelves that gave my kitchen a counter it did not have, the collapsible bins that flatten to nothing in the off-season, and the vertical tricks that use the air instead of the floor. Measured against a real small footprint. See <a href="/blog/floating-shelves-storage-ideas-for-tiny-studio-kitchen/">floating shelves for a tiny kitchen</a> and <a href="/blog/collapsible-storage-bins-with-lids-fabric-stackable/">collapsible bins</a>.</p>
`,
};
