# VOOM Assets Directory

This directory contains all game assets for the VOOM project.

## Asset Organization

```
assets/
├── weapons/          # Weapon sprites and animations
├── muzzle_flash/     # Muzzle flash effects
├── projectiles/      # Projectile sprites (fireballs, etc.)
├── explosions/       # Explosion animations
├── enemies/          # Enemy character sprites
├── items/            # Pickup items (health, ammo, armor)
├── keycards/         # Key card sprites
├── textures/         # Wall and floor textures
├── doors/            # Door sprites and animations
├── ui/               # HUD and UI elements
├── fonts/            # Pixel fonts for UI
└── decorations/      # Environmental decorations

```

## License

All assets are CC0 (Creative Commons Zero) licensed - free to use without attribution for any purpose.

See `CREDITS.md` for full attribution and source information.

## Adding New Assets

When adding new assets:
1. Verify the asset is CC0 licensed
2. Place it in the appropriate subdirectory
3. Update `CREDITS.md` with source and creator information
4. Update this README if adding a new category

## Usage in Game

Assets are organized for easy loading:
- Spritesheets should be loaded and split into frames
- Textures are typically 64x64 for wall/floor tiles
- UI elements can be scaled as needed
- All assets support transparency (PNG format)
