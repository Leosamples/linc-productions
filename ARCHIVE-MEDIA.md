# Portfolio archive: media and content

The `/portfolio` page is a standalone 3D archive (`public/archive/index.html`),
served through a rewrite in `next.config.mjs`. Everything it shows (photos,
captions, copy, menu, intro film and avatar) comes from a manifest.

Where the page reads the manifest from, in order:

1. **The saved manifest in Vercel Blob** (`archive/manifest.json`), via
   `GET /api/archive/manifest`. This is what edit mode writes.
2. **`public/archive/manifest.json`**, the default shipped with the site. Used
   only when nothing has been saved to Blob yet, or the API is unreachable.

> Once anything has been saved from edit mode, the Blob copy takes priority.
> Editing `public/archive/manifest.json` will **no longer change the live site**
> until the Blob copy is removed (see "Reset to the default" below).

## Edit mode

### Opening it

1. Go to `/portfolio?edit=1`. Without `?edit=1`, no edit code is downloaded and
   no edit controls exist on the page.
2. Click **Edit** (bottom right) and enter the admin password (`ADMIN_PASSWORD`).
   It's kept in this browser tab only (sessionStorage) and cleared when you
   exit edit mode or close the tab.
3. While unlocked, the intro film is skipped so each save reloads straight to
   the archive. Visitors still see it.

### Controls

**Edit bar** (top): *Editing* · **Index** (opens the flat grid) ·
**Media settings** · **Exit edit mode** (forgets the password and returns to
the normal page).

**In the Index grid**, hover a photo (on touch screens the controls always show):

| Control | What it does |
|---|---|
| Replace photo | Uploads a new image in place, keeping the title, place and note. The old files are deleted from Blob. |
| Edit details | Title, place, note, and **Tall card**. Unchecked, a card is tall when the photo is portrait. |
| ← Earlier / Later → | Moves the photo one place in the order (sphere, grid and lightbox all follow it). |
| Delete | Click twice to confirm. Removes the photo and deletes its files from Blob. |
| **+ Add photos** (dashed tile at the end) | Choose or drop one or more images. The title defaults to the file name; place and note start empty. |

**Media settings** has two slots, each with a preview and **Replace** (or drop a
file onto the slot):

- **Intro film**: MP4 or WebM.
- **Avatar**: JPG, PNG or WebP (resized to 800px wide).

Every change saves the whole manifest to Blob, then reloads the page so it
rebuilds from the saved data. Upload progress and any errors show at the
bottom left.

### What happens to uploaded photos

Before uploading, the browser resizes each photo into two files:

- **src**: up to 2800px wide, WebP at quality 0.9 (used in the lightbox)
- **thumb**: up to 1600px wide, WebP at quality 0.82 (used on the sphere and grid)

Smaller photos are never enlarged. Browsers that can't encode WebP (older
Safari) upload JPEG instead. Files go to `archive/photos/…` in Blob with a
random suffix, so a replacement never overwrites another file.

### Size limits

| Kind | Allowed types | Max size |
|---|---|---|
| Photos and avatar | JPEG, PNG, WebP | 25 MB per file (checked by the server) |
| Intro film | MP4, WebM | 150 MB (checked by the server) |

Videos over 30 MB upload, but with a warning: visitors have to download the
intro before it plays, so compress it first, for example:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -an -movflags +faststart intro.mp4
```

### Deleting files

Only files in this project's Blob store (`*.public.blob.vercel-storage.com`)
are ever deleted, both in the browser and again on the server. Files in
`public/` (like the starting film stills) are never touched.

### Reset to the default

Delete the blob named **`archive/manifest.json`**: Vercel dashboard → Storage →
your Blob store → Browser → `archive/manifest.json` → Delete. The page then
falls back to `public/archive/manifest.json`. Uploaded photos and videos stay
in the store until you delete them there too.

## Rotating Earth video (space backdrop)

The archive floats in a deep-space backdrop: stars, a faint Milky Way band,
occasional shooting stars, and a small Earth with its Moon on the right. By
default the Earth and Moon are drawn by the page itself. You can replace them
with a rotating-Earth video.

**What the video should look like**

- 16:9, about 10 seconds
- Pure black background (no stars; the page draws its own)
- Earth and Moon small, on the right side of the frame
- Locked-off camera (no pans or zooms), so it loops cleanly

The page blends the video with `screen`, so the black disappears and only the
planets show over the page's own stars.

**Steps**

```bash
npm run space-video -- ~/Downloads/my-earth.mp4
```

This needs ffmpeg (`brew install ffmpeg`). It turns the clip into a seamless
loop (a 10-second clip becomes 8.5 seconds), strips audio, compresses it to
`public/archive/media/video/earth-space.mp4`, warns if it's over 6 MB, and
prints the line to paste. Clips shorter than 4 seconds are rejected.

Then set it in the manifest:

```json
"space": { "earthVideo": "/archive/media/video/earth-space.mp4" }
```

Leave `earthVideo` empty (`""`) to use the built-in Earth and Moon. If the
video fails to load, the page falls back to them automatically.

The video pauses while the index grid is open, dims with the rest of the
backdrop when a photo is open, and stays on its first frame for visitors who
have reduced motion turned on.

> If you've saved changes from edit mode, the live site reads the manifest
> from Blob, so set `space.earthVideo` there too (or reset to the default, see
> above).

## Setup

These environment variables must exist in Vercel (Project → Settings →
Environment Variables) and, for local development, in `.env.local`:

| Variable | Where it comes from |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Added automatically when a Blob store is connected to the project (Storage → Create → Blob → Connect). |
| `ADMIN_PASSWORD` | Choose a long, unique password and add it yourself. |

Pull them for local development with:

```bash
npx vercel env pull .env.local
```

`.env.local` is git-ignored. Never commit it.

## Editing offline (without edit mode)

You can still edit `public/archive/manifest.json` directly and commit it. That
file only drives the live site while no saved manifest exists in Blob (see
"Reset to the default").

Its shape:

```json
{
  "site": { "title": "…", "description": "…", "nameParts": ["Linc", "Productions"], "headline": "…",
            "splashTag": "…", "colophon": "…", "bio": "…", "address": ["…"],
            "menu": [{ "label": "The Archive", "action": "grid" }, { "label": "Studio", "action": "link", "href": "/studio" }] },
  "intro": { "video": "/archive/media/video/intro.mp4", "playbackRate": 1 },
  "avatar": "/images/logo-mark.png",
  "shots": [{ "src": "/archive/media/night-orbit.jpg", "thumb": "", "title": "…", "place": "…", "note": "…", "tall": false }]
}
```

- `src`, `thumb`, `video` and `avatar` can be a site path starting with `/` or
  a full `https://` URL. If `thumb` is empty, `src` is used.
- Leave `tall` out to decide from the photo's shape.
- Menu `action`: `"grid"` opens the index, `"link"` goes to `href`, `"close"`
  just closes the menu.

## Rebuilding the upload library

Edit mode loads a browser build of `@vercel/blob/client` from
`public/archive/vendor/blob-client.js`. After upgrading `@vercel/blob`, rebuild it:

```bash
npm run archive:vendor
```
