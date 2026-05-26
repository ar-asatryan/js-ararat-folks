# javascript-basics-ararat-folks

> Cover some Basic Concepts of JavaScript.

An interactive visualization of the JavaScript **Event Loop**, **Call Stack**, **Web APIs**, **Macrotask Queue**, and **Microtask Queue**.
Everything lives in a single self-contained file: [`event-loop-simulator.html`](./event-loop-simulator.html) — no build step, no dependencies, no internet required.

---

## Running in Google Chrome

Pick whichever option you prefer. All three open the same file.

### Option 1 — Open the file directly (simplest)

1. Open **Google Chrome**.
2. In **Finder**, navigate to this project folder:
   ```
   /Users/aroray/projects/js-ararat-folks
   ```
3. Find `event-loop-simulator.html`.
4. **Right-click** the file → **Open With** → **Google Chrome**.
   *(Or simply drag the file onto an open Chrome window.)*
5. Chrome's address bar should now show:
   ```
   file:///Users/aroray/projects/js-ararat-folks/event-loop-simulator.html
   ```
6. Done — use the buttons in the UI to push tasks onto the stack, queues, and Web APIs.

### Option 2 — Paste the path into Chrome's address bar

1. Open **Google Chrome**.
2. Click the address bar and paste:
   ```
   file:///Users/aroray/projects/js-ararat-folks/event-loop-simulator.html
   ```
3. Press **Enter**.

### Option 3 — Open from the macOS Terminal

1. Open the **Terminal** app.
2. Run:
   ```bash
   open -a "Google Chrome" /Users/aroray/projects/js-ararat-folks/event-loop-simulator.html
   ```
3. Chrome will launch (or focus) and open the simulator in a new tab.

---

## Tips

- Open Chrome DevTools with **⌘ + ⌥ + I** to watch the Console while interacting with the simulator.
- If the page looks stale, hard-reload with **⌘ + ⇧ + R** to bypass the cache.
- The file is fully **offline** — no internet connection is required.
