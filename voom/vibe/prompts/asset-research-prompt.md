# VOOM Asset Research Prompt - Deep Search for Public Domain Game Assets

## Research Objective

Locate and catalog high-quality, public domain (CC0) or freely licensed sprite assets suitable for creating a faithful DOOM E1M1 recreation. All assets must be legally usable in an MIT-licensed open-source project without attribution requirements (though attribution will be provided as courtesy).

## Critical Constraints

1. **License Requirements:**
   - CC0 (Public Domain) strongly preferred
   - CC-BY acceptable if attribution is simple
   - NO CC-BY-SA, CC-BY-NC, or GPL-licensed assets
   - NO assets that "look similar to DOOM" but might be derivative works
   - Must be explicitly marked with license information

2. **Aesthetic Requirements:**
   - Pixel art style compatible with 1993-era graphics
   - Color palette emphasizing browns, grays, reds, and metallic tones
   - Resolution suitable for scaling (typically 32x32 to 128x128 for sprites)
   - Clean, readable silhouettes against varied backgrounds

## Asset Categories to Research

### Priority 1 - Core Gameplay Assets (MUST HAVE)

#### 1. Player Weapon Sprites
**Need:** First-person weapon sprites shown from player's view
- **Pistol:** Idle, firing, and reload animations (minimum 3 frames)
- **Fist/Melee:** Basic punch animation (backup if no pistol found)

**Search Terms:**
- "CC0 pixel art fps weapons"
- "public domain gun sprites first person"
- "retro shooter weapon sprites free"
- "doom-like weapons creative commons"
- "pixel art pistol sprite sheet"

**Quality Criteria:**
- Centered perspective (held weapon view)
- Muzzle flash frames included or separate
- 64x64 minimum resolution
- Consistent art style across frames

#### 2. Enemy Character Sprites
**Need:** Humanoid enemies viewable from 8 directions with walk/attack/death animations

**Basic Soldier/Zombie Type:**
- Walk cycle (4+ frames per direction)
- Attack pose
- Pain/hit reaction frame
- Death animation (3+ frames)
- Corpse sprite

**Search Terms:**
- "CC0 top-down zombie sprites"
- "public domain soldier sprite sheet"
- "pixel art enemy sprites 8 direction"
- "retro game monster sprites free"
- "isometric character sprites CC0"

**Quality Criteria:**
- Consistent sizing across all enemies
- Clear distinction between enemy types
- Readable at small sizes
- Includes directional variants or rotatable

#### 3. Projectile Sprites
**Need:** Fireball or plasma projectile for ranged attacks
- Flight animation (2-3 frames)
- Impact explosion (3-4 frames)

**Search Terms:**
- "CC0 fireball sprite animation"
- "public domain projectile sprites"
- "pixel art bullet sprites"
- "energy ball sprite sheet free"

#### 4. Item Pickup Sprites
**Need:** Collectible items clearly distinguishable from background

**Health Items:**
- Small health pack (stimpack equivalent)
- Large health kit (medkit equivalent)

**Ammo Items:**
- Bullet clip
- Bullet box

**Key Items:**
- Red keycard/key
- Blue keycard/key  
- Yellow keycard/key

**Search Terms:**
- "CC0 pixel art items"
- "public domain pickup sprites"
- "retro game powerups free"
- "pixel art health pack sprite"
- "keycard sprites creative commons"

**Quality Criteria:**
- Bright, contrasting colors
- Simple, iconic shapes
- Consistent visual language
- Optional shine/glow effect

### Priority 2 - Environmental Assets

#### 5. Wall Textures
**Need:** Tileable textures for level geometry (64x64 or 128x128)

**Types Required:**
- Metal/tech panels (gray/silver)
- Stone/concrete (gray/brown)
- Computer/tech walls with lights
- Door textures (including locked door variants)

**Search Terms:**
- "CC0 seamless metal texture pixel art"
- "public domain wall textures doom style"
- "tileable sci-fi textures free"
- "pixel art industrial textures"
- "retro game wall tiles CC0"

**Quality Criteria:**
- Seamlessly tileable
- Consistent pixel density
- Appropriate color palette
- Variations for visual interest

#### 6. Floor/Ceiling Textures
**Need:** Tileable horizontal surface textures

**Types Required:**
- Metal grating
- Concrete/stone
- Tech floor panels
- Hazard/warning strips

**Search Terms:**
- "CC0 floor textures pixel art"
- "public domain ceiling tiles game"
- "seamless ground textures free"
- "industrial floor patterns pixel art"

### Priority 3 - Polish Assets

#### 7. UI Elements
**Need:** HUD components and menu elements

- Health/Armor indicators
- Ammo counter display
- Font for numbers/text (pixel font)
- Simple menu borders/buttons

**Search Terms:**
- "CC0 pixel art GUI elements"
- "public domain game HUD assets"
- "retro game UI kit free"
- "pixel font creative commons"

#### 8. Decoration Sprites
**Need:** Non-interactive environmental objects

- Barrels (explosive and non-explosive)
- Pillars/columns
- Computer terminals
- Warning signs
- Light sources/lamps

**Search Terms:**
- "CC0 game props sprites"
- "public domain barrel sprite"
- "pixel art decorations free"
- "sci-fi props sprite sheet"

## Recommended Asset Sources to Search

### Primary Sources (Highest Quality, Best Licenses)
1. **OpenGameArt.org** - Filter by CC0 license, search "fps", "doom", "shooter", "pixel"
2. **itch.io** - Asset packs tagged "cc0" or "public-domain"
3. **Kenney.nl** - High quality CC0 game assets
4. **CraftPix.net** - Free section with clear licenses
5. **GitHub** - Search "CC0 game assets", "public domain sprites"

### Secondary Sources
6. **Pixabay** - Game assets section (verify licenses)
7. **FreePik** - Free game assets (check license per item)
8. **GameDev Market** - Free assets section
9. **Unity Asset Store** - Free assets (verify license compatibility)
10. **Quaternius.com** - CC0 3D models (can be pre-rendered to sprites)

### Community Sources
11. **r/gameassets** - Reddit community, filter by "free"
12. **TIGSource Forums** - Resources section
13. **GameDev.net** - Asset sharing forum
14. **Discord servers** - GameDev communities often share CC0 assets

## Asset Evaluation Checklist

For each potential asset source, document:

1. **Source Information**
   - URL to asset
   - Creator name
   - License type (exact license name)
   - License URL/proof
   - Download link

2. **Asset Quality Assessment**
   - Resolution/dimensions
   - Animation frame count
   - Color palette compatibility
   - Style consistency with other assets
   - Technical quality (clean pixels, no artifacts)

3. **Completeness Check**
   - Does it include all necessary animations/directions?
   - Are there enough variations?
   - Will it need modification to work?

4. **Legal Verification**
   - Is the license clearly stated?
   - Is commercial use allowed?
   - Is modification allowed?
   - Are there attribution requirements?
   - Is there any chance it's derivative of copyrighted work?

## Fallback Strategies

If suitable assets cannot be found:

### Option 1: Asset Modification
- Find CC0 base assets and modify significantly
- Use AI tools to generate variations (ensure output is licensable)
- Combine multiple CC0 sources into new sprites

### Option 2: Asset Generation
- Use procedural generation for textures
- Create simple geometric placeholders
- Commission CC0 assets from artists
- Use asset creation tools like Aseprite or GraphicsGale

### Option 3: Asset Simplification
- Reduce to simple colored rectangles for prototype
- Use text labels instead of sprites initially
- Focus on core mechanics over visual fidelity

## Research Output Format

Create a spreadsheet/document with:

| Asset Type | Source URL | License | Creator | Resolution | Frames | Quality (1-5) | Notes | Status |
|------------|------------|---------|---------|------------|--------|---------------|-------|--------|
| Pistol Sprite | example.com/pistol | CC0 | John Doe | 64x64 | 5 | 4 | Good muzzle flash | Downloaded |
| Zombie Sprite | ... | ... | ... | ... | ... | ... | ... | ... |

## Special Considerations

### Asset Mixing
- Ensure all assets work together visually
- Maintain consistent pixel density (no mixing 16x16 with 64x64 unless scaled properly)
- Keep color palettes compatible
- Verify perspective consistency

### Performance
- Keep total asset size under 3MB for all sprites
- Use sprite sheets where possible
- Consider load time impact
- Plan for texture atlasing

### Legal Safety
- Document everything meticulously
- Save copies of license files
- Screenshot license pages with dates
- Keep creator contact info when available
- Prepare attribution file even for CC0

## Priority Research Order

1. **First:** Find a complete FPS weapon pack (solves multiple needs)
2. **Second:** Find a character/enemy sprite pack with multiple creatures
3. **Third:** Find an item/pickup icon pack
4. **Fourth:** Find sci-fi/industrial texture packs
5. **Fifth:** Fill gaps with individual assets

## Success Criteria

Minimum viable asset set found when:
- [ ] At least one working weapon sprite located
- [ ] At least one enemy sprite with basic animations found
- [ ] Basic health/ammo pickup sprites identified  
- [ ] Minimum 5 wall textures suitable for tech-base theme found
- [ ] All assets have verified CC0 or CC-BY licenses
- [ ] Total asset size under 5MB
- [ ] Visual consistency acceptable for prototype

---

**Note:** This research should be conducted systematically, with each source thoroughly documented. The goal is not perfect DOOM accuracy but rather finding legally safe, visually cohesive assets that capture the spirit of a 1990s FPS while being completely free of copyright concerns.