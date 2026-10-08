// Archive edit mode. Loaded by index.html only when the URL has ?edit=1,
// so visitors never download or run any of this.
//
// Every change: upload files to Vercel Blob (via /api/archive/upload),
// POST the full manifest to /api/archive/manifest, delete replaced Blob
// files via /api/archive/delete, then reload so the page rebuilds from
// the saved data.

import { upload } from "/archive/vendor/blob-client.js";

const archive = window.__archive;
const PASSWORD_KEY = "archive-admin";
const REOPEN_KEY = "archive-edit-reopen";
const PHOTO_SRC = { maxWidth: 2800, quality: 0.9 };
const PHOTO_THUMB = { maxWidth: 1600, quality: 0.82 };
const AVATAR = { maxWidth: 800, quality: 0.9 };
const VIDEO_WARN_BYTES = 30 * 1024 * 1024;
const MULTIPART_FROM_BYTES = 20 * 1024 * 1024;
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

let password = readPassword();

// ── Styles (injected only in edit mode) ─────────────────────────────
const style = document.createElement("style");
style.textContent = `
  .ed-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    font: 500 .75rem/1 var(--sans); color: var(--paper);
    padding: .5rem .85rem; border-radius: 999px;
    border: 1px solid var(--line-strong); background: rgba(5,5,5,.8);
    cursor: pointer; transition: border-color .25s, color .25s, background .25s;
  }
  .ed-btn:hover { border-color: var(--signal); color: var(--signal); }
  .ed-btn.primary { background: var(--paper); color: var(--ink); border-color: var(--paper); }
  .ed-btn.primary:hover { background: var(--signal); border-color: var(--signal); color: var(--ink); }
  .ed-btn.danger:hover { border-color: #ff6b5e; color: #ff6b5e; }
  .ed-btn.armed { border-color: #ff6b5e; color: #ff6b5e; }
  .ed-btn[disabled] { opacity: .45; pointer-events: none; }

  #ed-launch { position: fixed; right: clamp(1rem,4vw,3rem); bottom: calc(clamp(1.25rem,4vw,3rem) + 64px); z-index: 90; }

  #ed-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 70; height: 44px;
    display: flex; align-items: center; gap: .5rem; padding: 0 clamp(1rem,4vw,3rem);
    padding-top: env(safe-area-inset-top, 0px);
    background: #000; border-bottom: 1px solid var(--line-strong);
    font: 500 .75rem/1 var(--sans);
  }
  #ed-bar .ed-label { display: inline-flex; align-items: center; gap: .5rem; margin-right: auto; color: var(--paper); letter-spacing: .04em; }
  #ed-bar .ed-label::before { content: ""; width: 7px; height: 7px; border-radius: 99px; background: var(--signal); box-shadow: 0 0 10px var(--signal); }
  #ed-bar .ed-btn { padding: .4rem .75rem; }
  body.editing #top { top: 44px; }
  body.editing .panel-bar { padding-top: calc(1.25rem + 44px + env(safe-area-inset-top, 0px)); }

  .ed-wrap { position: relative; break-inside: avoid; margin-bottom: 1.5rem; }
  .ed-wrap > .tile { margin-bottom: 0; }
  .ed-controls {
    position: absolute; left: .5rem; right: .5rem; top: .5rem; z-index: 2;
    display: flex; flex-wrap: wrap; gap: .35rem;
    opacity: 0; transition: opacity .2s;
  }
  .ed-wrap:hover .ed-controls, .ed-wrap:focus-within .ed-controls { opacity: 1; }
  @media (hover: none) { .ed-controls { opacity: 1; } }
  .ed-controls .ed-btn { padding: .38rem .6rem; font-size: .7rem; }

  .ed-drop {
    display: grid; place-items: center; text-align: center; gap: .4rem;
    min-height: 180px; padding: 1.5rem; margin-bottom: 1.5rem; break-inside: avoid;
    border: 1px dashed var(--line-strong); border-radius: 3px; color: var(--muted);
    font: 400 .85rem/1.5 var(--sans); cursor: pointer; transition: border-color .25s, color .25s, background .25s;
  }
  .ed-drop strong { font: 400 1.4rem/1.1 var(--serif); color: var(--paper); }
  .ed-drop:hover, .ed-drop.over { border-color: var(--signal); color: var(--paper); background: rgba(53,183,255,.05); }

  .ed-dialog {
    position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; padding: 1rem;
    background: rgba(0,0,0,.72); backdrop-filter: blur(6px);
  }
  .ed-card {
    width: min(100%, 30rem); max-height: calc(100vh - 2rem); overflow-y: auto;
    background: #000; border: 1px solid var(--line-strong); border-radius: 4px; padding: 1.5rem;
    font: 400 .875rem/1.5 var(--sans);
  }
  .ed-card.wide { width: min(100%, 46rem); }
  .ed-card h2 { font: 400 1.6rem/1.1 var(--serif); margin-bottom: .35rem; }
  .ed-card .ed-sub { color: var(--muted); font-size: .8rem; margin-bottom: 1.25rem; }
  .ed-field { display: grid; gap: .35rem; margin-bottom: 1rem; }
  .ed-field span { font-size: .75rem; color: var(--muted); }
  .ed-field input[type=text], .ed-field input[type=password], .ed-field textarea {
    width: 100%; font: 400 .9rem/1.4 var(--sans); color: var(--paper);
    background: var(--panel); border: 1px solid var(--line-strong); border-radius: 3px; padding: .65rem .75rem;
  }
  .ed-field textarea { min-height: 6rem; resize: vertical; }
  .ed-field input:focus, .ed-field textarea:focus { outline: none; border-color: var(--signal); }
  .ed-check { display: flex; gap: .6rem; align-items: flex-start; margin-bottom: 1.25rem; color: var(--paper); }
  .ed-check small { display: block; color: var(--muted); font-size: .75rem; }
  .ed-actions { display: flex; justify-content: flex-end; gap: .5rem; margin-top: .5rem; }
  .ed-error { color: #ff8a80; font-size: .8rem; min-height: 1.2em; margin-bottom: .5rem; }

  .ed-slots { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 640px) { .ed-slots { grid-template-columns: 1fr; } }
  .ed-slot { border: 1px solid var(--line); border-radius: 3px; padding: 1rem; display: grid; gap: .75rem; align-content: start; }
  .ed-slot.over { border-color: var(--signal); background: rgba(53,183,255,.05); }
  .ed-slot h3 { font: 500 .8rem/1 var(--sans); letter-spacing: .04em; }
  .ed-preview { aspect-ratio: 16/10; background: var(--panel); border: 1px solid var(--line); border-radius: 3px; overflow: hidden; display: grid; place-items: center; color: var(--muted); font-size: .75rem; }
  .ed-preview video, .ed-preview img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .ed-slot p { color: var(--muted); font-size: .75rem; }

  #ed-toasts {
    position: fixed; left: clamp(1rem,4vw,3rem); bottom: clamp(1rem,3vw,2rem); z-index: 95;
    display: grid; gap: .5rem; width: min(22rem, calc(100vw - 2rem)); pointer-events: none;
  }
  .ed-toast {
    pointer-events: auto; background: #000; border: 1px solid var(--line-strong); border-radius: 3px;
    padding: .7rem .85rem; font: 400 .78rem/1.4 var(--sans);
  }
  .ed-toast .name { display: flex; justify-content: space-between; gap: .75rem; color: var(--paper); }
  .ed-toast .name span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ed-toast .name span:last-child { color: var(--muted); font-variant-numeric: tabular-nums; flex: none; }
  .ed-toast .bar { margin-top: .5rem; height: 2px; background: var(--line); overflow: hidden; }
  .ed-toast .bar i { display: block; height: 100%; width: 0; background: var(--signal); transition: width .2s; }
  .ed-toast .msg { margin-top: .4rem; color: var(--muted); }
  .ed-toast.error { border-color: #ff6b5e; }
  .ed-toast.error .msg { color: #ff8a80; }
  .ed-toast.warn .msg { color: #ffd28a; }
  .ed-toast.ok .bar i { background: #6fdc9b; }
`;
document.head.appendChild(style);

const toasts = el("div", { id: "ed-toasts", "aria-live": "polite" });
document.body.appendChild(toasts);

if (password) enableEditing();
else showLaunchButton();

// ── Unlock ───────────────────────────────────────────────────────────
function showLaunchButton() {
  const btn = el("button", { id: "ed-launch", class: "ed-btn primary", type: "button" }, "Edit");
  btn.addEventListener("click", openUnlock);
  document.body.appendChild(btn);
}

function openUnlock() {
  const input = el("input", { type: "password", autocomplete: "current-password", id: "ed-password", required: "" });
  const error = el("p", { class: "ed-error", role: "alert" });
  const submit = el("button", { class: "ed-btn primary", type: "submit" }, "Unlock");
  const form = el("form", { class: "ed-card" },
    el("h2", {}, "Edit the archive"),
    el("p", { class: "ed-sub" }, "Enter the admin password. It stays in this browser tab only."),
    el("label", { class: "ed-field" }, el("span", {}, "Password"), input),
    error,
    el("div", { class: "ed-actions" }, closeButton("Cancel"), submit)
  );
  const dialog = openDialog(form);
  input.focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submit.disabled = true;
    error.textContent = "";
    try {
      const ok = await checkPassword(input.value);
      if (!ok) { error.textContent = "That password is wrong. Try again."; input.select(); return; }
      password = input.value;
      try { sessionStorage.setItem(PASSWORD_KEY, password); } catch {}
      dialog.close();
      document.getElementById("ed-launch")?.remove();
      enableEditing();
    } catch {
      error.textContent = "Couldn't reach the server. Check your connection and try again.";
    } finally {
      submit.disabled = false;
    }
  });
}

async function checkPassword(candidate) {
  const r = await fetch("/api/archive/auth", { method: "POST", headers: { "x-admin-password": candidate }, cache: "no-store" });
  return r.ok;
}

function lockOut(message) {
  try { sessionStorage.removeItem(PASSWORD_KEY); } catch {}
  password = null;
  toast("Edit mode", { error: message || "The password was rejected. Unlock again to keep editing." });
}

// ── Editing UI ───────────────────────────────────────────────────────
function enableEditing() {
  document.body.classList.add("editing");

  const indexBtn = el("button", { class: "ed-btn", type: "button" }, "Index");
  const mediaBtn = el("button", { class: "ed-btn", type: "button" }, "Media settings");
  const exitBtn = el("button", { class: "ed-btn", type: "button" }, "Exit edit mode");
  indexBtn.addEventListener("click", () => archive.openGrid());
  mediaBtn.addEventListener("click", openMediaSettings);
  exitBtn.addEventListener("click", () => {
    try { sessionStorage.removeItem(PASSWORD_KEY); sessionStorage.removeItem(REOPEN_KEY); } catch {}
    location.href = "/portfolio";
  });
  document.body.appendChild(el("div", { id: "ed-bar", role: "toolbar", "aria-label": "Edit mode" },
    el("span", { class: "ed-label" }, "Editing"), indexBtn, mediaBtn, exitBtn));

  decorateGrid();

  let reopen = null;
  try { reopen = sessionStorage.getItem(REOPEN_KEY); sessionStorage.removeItem(REOPEN_KEY); } catch {}
  if (reopen === "grid") archive.openGrid();
  if (reopen === "media") openMediaSettings();
}

// Shots as the page shows them (index.html skips any without a src).
function visibleShotIndexes(manifest) {
  const out = [];
  (manifest.shots || []).forEach((s, i) => { if (s && s.src) out.push(i); });
  return out;
}

function decorateGrid() {
  const list = document.getElementById("grid-list");
  const tiles = Array.from(list.querySelectorAll(".tile"));
  const indexes = visibleShotIndexes(archive.manifest);

  tiles.forEach((tile, pos) => {
    const shotIndex = indexes[pos];
    if (shotIndex === undefined) return;
    const wrap = el("div", { class: "ed-wrap" });
    tile.parentNode.insertBefore(wrap, tile);
    wrap.appendChild(tile);

    const controls = el("div", { class: "ed-controls" });
    const replace = el("button", { class: "ed-btn", type: "button" }, "Replace photo");
    const details = el("button", { class: "ed-btn", type: "button" }, "Edit details");
    const earlier = el("button", { class: "ed-btn", type: "button", "aria-label": "Move earlier" }, "← Earlier");
    const later = el("button", { class: "ed-btn", type: "button", "aria-label": "Move later" }, "Later →");
    const remove = el("button", { class: "ed-btn danger", type: "button" }, "Delete");
    if (pos === 0) earlier.disabled = true;
    if (pos === tiles.length - 1) later.disabled = true;
    controls.append(replace, details, earlier, later, remove);
    wrap.appendChild(controls);

    replace.addEventListener("click", () => pickFiles("image/jpeg,image/png,image/webp", false, (files) => replacePhoto(shotIndex, files[0])));
    details.addEventListener("click", () => openDetails(shotIndex));
    earlier.addEventListener("click", () => moveShot(pos, -1));
    later.addEventListener("click", () => moveShot(pos, 1));
    armDelete(remove, () => deleteShot(shotIndex));
  });

  const add = el("div", { class: "ed-drop", role: "button", tabindex: "0" },
    el("strong", {}, "+ Add photos"),
    el("span", {}, "Click to choose, or drop images here. JPG, PNG or WebP, up to 25 MB each."));
  const choose = () => pickFiles("image/jpeg,image/png,image/webp", true, addPhotos);
  add.addEventListener("click", choose);
  add.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } });
  dropZone(add, (files) => addPhotos(files.filter(isImage)));
  list.appendChild(add);
}

// Two-step delete: first click arms the button, second click deletes.
function armDelete(button, action) {
  let timer = null;
  button.addEventListener("click", () => {
    if (button.classList.contains("armed")) { clearTimeout(timer); action(); return; }
    button.classList.add("armed");
    button.textContent = "Confirm delete";
    timer = setTimeout(() => { button.classList.remove("armed"); button.textContent = "Delete"; }, 3500);
  });
}

// ── Actions ──────────────────────────────────────────────────────────
function cloneManifest() { return JSON.parse(JSON.stringify(archive.manifest)); }

async function addPhotos(files) {
  if (!files.length) return;
  if (!(await ensureAuthorized())) return;
  const next = cloneManifest();
  next.shots = next.shots || [];
  let added = 0;
  for (const file of files) {
    const t = toast(file.name);
    try {
      const { src, thumb } = await uploadPhoto(file, t);
      next.shots.push({ src, thumb, title: humanize(file.name), place: "", note: "" });
      added++;
      t.done("Uploaded");
    } catch (err) {
      t.fail(friendlyError(err));
    }
  }
  if (added) await saveAndReload(next, [], "grid");
}

async function replacePhoto(index, file) {
  if (!file || !(await ensureAuthorized())) return;
  const next = cloneManifest();
  const shot = next.shots[index];
  const old = [shot.src, shot.thumb];
  const t = toast(file.name);
  try {
    const { src, thumb } = await uploadPhoto(file, t);
    shot.src = src;
    shot.thumb = thumb;
    t.done("Uploaded");
    await saveAndReload(next, old, "grid");
  } catch (err) {
    t.fail(friendlyError(err));
  }
}

function openDetails(index) {
  const shot = archive.manifest.shots[index];
  const title = el("input", { type: "text", id: "ed-title", value: shot.title || "" });
  const place = el("input", { type: "text", id: "ed-place", value: shot.place || "" });
  const note = el("textarea", { id: "ed-note" });
  note.value = shot.note || "";
  const tall = el("input", { type: "checkbox", id: "ed-tall" });
  tall.checked = shot.tall === true;
  const error = el("p", { class: "ed-error", role: "alert" });
  const save = el("button", { class: "ed-btn primary", type: "submit" }, "Save details");

  const form = el("form", { class: "ed-card" },
    el("h2", {}, "Edit details"),
    el("p", { class: "ed-sub" }, "Shown in the lightbox and the index."),
    el("label", { class: "ed-field" }, el("span", {}, "Title"), title),
    el("label", { class: "ed-field" }, el("span", {}, "Place or category"), place),
    el("label", { class: "ed-field" }, el("span", {}, "Note"), note),
    el("label", { class: "ed-check" }, tall,
      el("span", {}, "Tall card", el("small", {}, "Unchecked: decided by the photo's shape (portrait photos are tall)."))),
    error,
    el("div", { class: "ed-actions" }, closeButton("Cancel"), save)
  );
  const dialog = openDialog(form);
  title.focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    save.disabled = true;
    const next = cloneManifest();
    const s = next.shots[index];
    s.title = title.value.trim();
    s.place = place.value.trim();
    s.note = note.value.trim();
    if (tall.checked) s.tall = true; else delete s.tall;
    const ok = await saveAndReload(next, [], "grid");
    if (!ok) { save.disabled = false; error.textContent = "Couldn't save. See the message at the bottom left."; }
    else dialog.close();
  });
}

async function moveShot(pos, delta) {
  const next = cloneManifest();
  const indexes = visibleShotIndexes(next);
  const a = indexes[pos], b = indexes[pos + delta];
  if (a === undefined || b === undefined) return;
  [next.shots[a], next.shots[b]] = [next.shots[b], next.shots[a]];
  await saveAndReload(next, [], "grid");
}

async function deleteShot(index) {
  const next = cloneManifest();
  const [removed] = next.shots.splice(index, 1);
  await saveAndReload(next, [removed.src, removed.thumb], "grid");
}

// ── Media settings: intro film + avatar ─────────────────────────────
function openMediaSettings() {
  const m = archive.manifest;

  const filmPreview = el("div", { class: "ed-preview" });
  if (m.intro && m.intro.video) {
    filmPreview.appendChild(el("video", { src: m.intro.video, muted: "", loop: "", playsinline: "", autoplay: "", controls: "" }));
  } else filmPreview.textContent = "No intro film";
  const filmBtn = el("button", { class: "ed-btn", type: "button" }, "Replace");
  const filmSlot = el("div", { class: "ed-slot" },
    el("h3", {}, "Intro film"), filmPreview,
    el("p", {}, "MP4 or WebM, up to 150 MB. Under 30 MB loads best. Plays muted."),
    el("div", {}, filmBtn));
  filmBtn.addEventListener("click", () => pickFiles("video/mp4,video/webm", false, (f) => replaceIntro(f[0])));
  dropZone(filmSlot, (files) => replaceIntro(files.find(isVideo)));

  const avatarPreview = el("div", { class: "ed-preview" });
  if (m.avatar) avatarPreview.appendChild(el("img", { src: m.avatar, alt: "" }));
  else avatarPreview.textContent = "No avatar";
  const avatarBtn = el("button", { class: "ed-btn", type: "button" }, "Replace");
  const avatarSlot = el("div", { class: "ed-slot" },
    el("h3", {}, "Avatar"), avatarPreview,
    el("p", {}, "JPG, PNG or WebP. Shown in the top bar and the corner."),
    el("div", {}, avatarBtn));
  avatarBtn.addEventListener("click", () => pickFiles("image/jpeg,image/png,image/webp", false, (f) => replaceAvatar(f[0])));
  dropZone(avatarSlot, (files) => replaceAvatar(files.find(isImage)));

  openDialog(el("div", { class: "ed-card wide" },
    el("h2", {}, "Media settings"),
    el("p", { class: "ed-sub" }, "Click Replace or drop a file onto a slot."),
    el("div", { class: "ed-slots" }, filmSlot, avatarSlot),
    el("div", { class: "ed-actions" }, closeButton("Done"))));
}

async function replaceIntro(file) {
  if (!file) return;
  if (!isVideo(file)) { toast(file.name, { error: "The intro film must be an MP4 or WebM video." }); return; }
  if (!(await ensureAuthorized())) return;
  const t = toast(file.name);
  if (file.size > VIDEO_WARN_BYTES) {
    t.warn(`This video is ${(file.size / 1048576).toFixed(0)} MB. It will upload, but visitors will wait for it. Consider compressing it first.`);
  }
  try {
    const ext = file.type === "video/webm" ? "webm" : "mp4";
    const result = await uploadFile(`archive/video/${slug(file.name)}.${ext}`, file, file.type, (p) => t.progress(p));
    t.done("Uploaded");
    const next = cloneManifest();
    const old = next.intro && next.intro.video;
    next.intro = Object.assign({}, next.intro, { video: result.url });
    await saveAndReload(next, [old], "media");
  } catch (err) {
    t.fail(friendlyError(err));
  }
}

async function replaceAvatar(file) {
  if (!file) return;
  if (!isImage(file)) { toast(file.name, { error: "The avatar must be a JPG, PNG or WebP image." }); return; }
  if (!(await ensureAuthorized())) return;
  const t = toast(file.name);
  try {
    const image = await resizeImage(file, AVATAR);
    const result = await uploadFile(`archive/photos/avatar-${slug(file.name)}.${image.ext}`, image.blob, image.type, (p) => t.progress(p));
    t.done("Uploaded");
    const next = cloneManifest();
    const old = next.avatar;
    next.avatar = result.url;
    await saveAndReload(next, [old], "media");
  } catch (err) {
    t.fail(friendlyError(err));
  }
}

// ── Upload + save plumbing ───────────────────────────────────────────
async function ensureAuthorized() {
  if (!password) { lockOut("You're not unlocked. Click Edit and enter the password."); return false; }
  try {
    if (await checkPassword(password)) return true;
    lockOut();
    setTimeout(() => location.reload(), 1800);
    return false;
  } catch {
    toast("Edit mode", { error: "Couldn't reach the server. Check your connection and try again." });
    return false;
  }
}

async function uploadPhoto(file, t) {
  if (!isImage(file)) throw new Error("type: Only JPG, PNG or WebP photos can be added.");
  t.status("Preparing…");
  const big = await resizeImage(file, PHOTO_SRC);
  const small = await resizeImage(file, PHOTO_THUMB);
  const base = slug(file.name);
  t.status("Uploading…");
  const src = await uploadFile(`archive/photos/${base}.${big.ext}`, big.blob, big.type, (p) => t.progress(p * 0.7));
  const thumb = await uploadFile(`archive/photos/${base}-thumb.${small.ext}`, small.blob, small.type, (p) => t.progress(70 + p * 0.3));
  return { src: src.url, thumb: thumb.url };
}

function uploadFile(pathname, body, contentType, onProgress) {
  return upload(pathname, body, {
    access: "public",
    handleUploadUrl: "/api/archive/upload",
    clientPayload: password,
    contentType,
    multipart: body.size > MULTIPART_FROM_BYTES,
    onUploadProgress: (e) => onProgress(e.percentage),
  });
}

async function saveAndReload(manifest, oldUrls, reopen) {
  const t = toast("Saving changes");
  t.status("Saving…");
  let response;
  try {
    response = await fetch("/api/archive/manifest", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password || "" },
      body: JSON.stringify(manifest),
      cache: "no-store",
    });
  } catch {
    t.fail("Network problem. Your change wasn't saved. Check your connection and try again.");
    return false;
  }
  if (response.status === 401) { t.fail("Wrong password. Your change wasn't saved."); lockOut(); return false; }
  if (!response.ok) {
    let msg = "The server couldn't save the change.";
    try { msg = (await response.json()).error || msg; } catch {}
    t.fail(msg);
    return false;
  }

  // Only files in this site's Blob store are ever deleted (the server checks too).
  const removable = (oldUrls || []).filter(isBlobUrl).filter((u) => !JSON.stringify(manifest).includes(u));
  if (removable.length) {
    try {
      await fetch("/api/archive/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password || "" },
        body: JSON.stringify({ urls: removable }),
      });
    } catch {}
  }

  t.done("Saved. Reloading…");
  try { if (reopen) sessionStorage.setItem(REOPEN_KEY, reopen); } catch {}
  setTimeout(() => location.reload(), 400);
  return true;
}

// Resize with canvas; WebP when the browser can encode it, otherwise JPEG.
async function resizeImage(file, { maxWidth, quality }) {
  let source;
  try {
    source = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("decode: That image couldn't be read. Try a JPG, PNG or WebP file.");
  }
  const scale = Math.min(1, maxWidth / source.width);
  const w = Math.max(1, Math.round(source.width * scale));
  const h = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  if (source.close) source.close();

  let blob = await new Promise((r) => canvas.toBlob(r, "image/webp", quality));
  if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
  if (!blob) throw new Error("decode: That image couldn't be processed.");
  return { blob, type: blob.type, ext: blob.type === "image/webp" ? "webp" : "jpg" };
}

function friendlyError(err) {
  const text = String((err && (err.message || err.name)) || err || "");
  const lower = text.toLowerCase();
  if (lower.startsWith("type:") || lower.startsWith("decode:")) return text.slice(text.indexOf(":") + 1).trim();
  if (lower.includes("too large") || lower.includes("filetoolarge") || lower.includes("maximum size")) {
    return "File too big. Photos can be up to 25 MB and videos up to 150 MB.";
  }
  if (lower.includes("content type") || lower.includes("contenttype")) return "That file type isn't allowed here.";
  if (lower.includes("isn't connected") || lower.includes("503")) {
    return "Blob storage isn't connected to this project yet, so files can't be uploaded.";
  }
  if (lower.includes("unauthorized") || lower.includes("401") || lower.includes("client token")) {
    return "Upload refused. Check the password, and that a Blob store is connected to the project.";
  }
  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("load failed")) {
    return "Network problem. Check your connection and try again.";
  }
  return text || "Something went wrong.";
}

// ── Small helpers ────────────────────────────────────────────────────
function readPassword() {
  try { return sessionStorage.getItem(PASSWORD_KEY); } catch { return null; }
}

function isImage(f) { return !!f && ["image/jpeg", "image/png", "image/webp"].includes(f.type); }
function isVideo(f) { return !!f && ["video/mp4", "video/webm"].includes(f.type); }

function isBlobUrl(u) {
  if (typeof u !== "string") return false;
  try { const url = new URL(u); return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX); }
  catch { return false; }
}

function humanize(filename) {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : "Untitled";
}

function slug(filename) {
  return filename.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
}

function pickFiles(accept, multiple, onPick) {
  const input = el("input", { type: "file", accept });
  input.multiple = multiple;
  input.addEventListener("change", () => { const files = Array.from(input.files || []); if (files.length) onPick(files); });
  input.click();
}

function dropZone(node, onFiles) {
  node.addEventListener("dragover", (e) => { e.preventDefault(); node.classList.add("over"); });
  node.addEventListener("dragleave", () => node.classList.remove("over"));
  node.addEventListener("drop", (e) => {
    e.preventDefault();
    node.classList.remove("over");
    const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
    if (files.length) onFiles(files);
  });
}

function openDialog(content) {
  const dialog = el("div", { class: "ed-dialog", role: "dialog", "aria-modal": "true" }, content);
  const close = () => { dialog.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target.closest("[data-ed-close]")) close(); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(dialog);
  return { close };
}

function closeButton(label) {
  return el("button", { class: "ed-btn", type: "button", "data-ed-close": "" }, label);
}

function toast(name, opts = {}) {
  const pct = el("span", {}, "");
  const msg = el("div", { class: "msg" }, "");
  const fill = el("i");
  const node = el("div", { class: "ed-toast" },
    el("div", { class: "name" }, el("span", {}, name), pct),
    el("div", { class: "bar" }, fill), msg);
  toasts.appendChild(node);
  const api = {
    progress(p) { const v = Math.max(0, Math.min(100, p)); fill.style.width = v + "%"; pct.textContent = Math.round(v) + "%"; },
    status(text) { msg.textContent = text; },
    warn(text) { node.classList.add("warn"); msg.textContent = text; },
    done(text) { api.progress(100); node.classList.remove("warn"); node.classList.add("ok"); msg.textContent = text || "Done"; setTimeout(() => node.remove(), 5000); },
    fail(text) { node.classList.remove("warn"); node.classList.add("error"); msg.textContent = text; pct.textContent = ""; setTimeout(() => node.remove(), 12000); },
  };
  if (opts.error) api.fail(opts.error);
  return api;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "value") node.value = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) if (c !== null && c !== undefined) node.append(c);
  return node;
}
