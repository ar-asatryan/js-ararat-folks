import "./styles.css";

const $ = (id) => document.getElementById(id);
  const codeEl = $("code");
  const stackEl = $("stack");
  const webapiEl = $("webapi");
  const microEl = $("micro");
  const macroEl = $("macro");
  const consoleEl = $("console");
  const stackCount = $("stackCount");
  const webapiCount = $("webapiCount");
  const microCount = $("microCount");
  const macroCount = $("macroCount");
  const speedEl = $("speed");
  const runBtn = $("runBtn");
  const resetBtn = $("resetBtn");
  const clearBtn = $("clearBtn");
  const stepBtn = $("stepBtn");
  const loopStatusEl = $("loopStatus");
  const modeRadios = document.querySelectorAll('input[name="loopMode"]');
  const examplesEl = $("examples");
  const STORAGE_KEY = "event-loop-simulator:code";
  const INDENT = "  ";

  const examples = {
    basic: `console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise 1');
}).then(() => {
  console.log('promise 2');
});

console.log('script end');`,
    microFirst: `console.log('A');
setTimeout(() => console.log('macrotask 1'), 0);
setTimeout(() => console.log('macrotask 2'), 0);
queueMicrotask(() => console.log('microtask 1'));
queueMicrotask(() => console.log('microtask 2'));
console.log('B');`,
    nested: `console.log('start');
setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);
Promise.resolve().then(() => {
  console.log('promise 1');
  setTimeout(() => console.log('timeout inside promise'), 0);
});
console.log('end');`,
    zero: `console.log('1');
setTimeout(() => console.log('2 (timeout 0)'), 0);
Promise.resolve().then(() => console.log('3 (microtask)'));
console.log('4');`,
    raf: `console.log('start');
requestAnimationFrame(() => console.log('rAF callback'));
setTimeout(() => console.log('setTimeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');`,
    chain: `setTimeout(() => {
  console.log('timer fires');
  Promise.resolve()
    .then(() => console.log('then 1'))
    .then(() => console.log('then 2'))
    .then(() => console.log('then 3'));
  console.log('after chain registration');
}, 0);
console.log('main script done');`,
  };

  let speed = +speedEl.value;
  speedEl.addEventListener("input", () => (speed = +speedEl.value));

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const tick = () => sleep(speed);

  function fmt(v) {
    if (typeof v === "string") return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  function logTo(kind, ...args) {
    const line = document.createElement("div");
    line.className = "line " + kind;
    line.textContent = args.map(fmt).join(" ");
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  const State = {
    stack: [],
    webapi: [],
    micro: [],
    macro: [],
    raf: [],
    timerSeq: 0,
    promiseSeq: 0,
    cancelled: new Set(),
    running: false,
    aborted: false,
    mode: "auto",
  };

  let stepResolver = null;
  function setStepBtnEnabled(enabled) {
    stepBtn.disabled = !enabled;
  }
  function setLoopStatus(text, paused = false) {
    loopStatusEl.textContent = text;
    loopStatusEl.classList.toggle("paused", paused);
  }
  function waitForNextStep() {
    if (State.aborted || !State.running) return Promise.resolve();
    if (State.mode === "auto") return Promise.resolve();
    return new Promise((resolve) => {
      stepResolver = resolve;
      setStepBtnEnabled(true);
      setLoopStatus("paused — click Step to advance", true);
    });
  }
  function triggerStep() {
    if (!stepResolver) return;
    const r = stepResolver;
    stepResolver = null;
    setStepBtnEnabled(false);
    setLoopStatus("stepping…");
    r();
  }
  function setMode(mode) {
    State.mode = mode;
    if (mode === "auto") {
      setStepBtnEnabled(false);
      setLoopStatus(State.running ? "running automatically" : "running automatically");
      if (stepResolver) triggerStep();
    } else {
      setLoopStatus(State.running ? "manual mode — use Step" : "manual mode (will pause on Run)");
      if (State.running && !stepResolver) setStepBtnEnabled(true);
    }
  }

  function render() {
    const renderZone = (el, list, cls, opts = {}) => {
      el.innerHTML = "";
      list.forEach((it, idx) => {
        const div = document.createElement("div");
        div.className = "item " + cls + (it.running ? " running" : "");
        const label = document.createElement("span");
        label.textContent = it.label;
        div.appendChild(label);
        if (it.meta) {
          const meta = document.createElement("span");
          meta.className = "meta";
          meta.textContent = it.meta;
          div.appendChild(meta);
        }
        el.appendChild(div);
      });
    };
    renderZone(stackEl, State.stack, "stack");
    renderZone(webapiEl, State.webapi, "webapi");
    renderZone(microEl, State.micro, "micro");
    renderZone(macroEl, State.macro, "macro");
    stackCount.textContent = State.stack.length;
    webapiCount.textContent = State.webapi.length;
    microCount.textContent = State.micro.length;
    macroCount.textContent = State.macro.length;
  }

  async function pushStack(label) {
    State.stack.push({ label, running: true });
    render();
    await tick();
  }
  async function popStack() {
    State.stack.pop();
    render();
    await tick();
  }

  function addWebApi(label, meta) {
    const obj = { label, meta };
    State.webapi.push(obj);
    render();
    return obj;
  }
  function removeWebApi(obj) {
    const i = State.webapi.indexOf(obj);
    if (i >= 0) State.webapi.splice(i, 1);
    render();
  }

  function enqueueMicro(label, fn) {
    State.micro.push({ label, fn });
    render();
  }
  function enqueueMacro(label, fn, meta) {
    State.macro.push({ label, fn, meta });
    render();
  }

  async function stepOnce() {
    if (State.aborted) return "aborted";
    if (State.micro.length > 0) {
      const task = State.micro.shift();
      render();
      await pushStack(task.label);
      await task.fn();
      await popStack();
      return "micro";
    }
    if (State.macro.length > 0) {
      const task = State.macro.shift();
      render();
      await pushStack(task.label);
      await task.fn();
      await popStack();
      return "macro";
    }
    if (State.webapi.length > 0) return "waiting";
    return "idle";
  }

  function makePromise(name = `p${++State.promiseSeq}`) {
    const handlers = { fulfilled: [], rejected: [], finally: [] };
    let state = "pending";
    let value;

    const settle = (newState, val) => {
      if (state !== "pending") return;
      state = newState;
      value = val;
      const which = newState === "fulfilled" ? handlers.fulfilled : handlers.rejected;
      which.forEach((h) => enqueueMicro(`${name}.then`, h));
      handlers.finally.forEach((h) => enqueueMicro(`${name}.finally`, h));
    };

    const p = {
      __isSimPromise: true,
      __name: name,
      then(onF, onR) {
        const child = makePromise();
        const handleF = async () => {
          if (typeof onF !== "function") return child.__resolve(value);
          try {
            const r = await maybeAwait(onF(value));
            child.__resolve(r);
          } catch (e) { child.__reject(e); }
        };
        const handleR = async () => {
          if (typeof onR !== "function") return child.__reject(value);
          try {
            const r = await maybeAwait(onR(value));
            child.__resolve(r);
          } catch (e) { child.__reject(e); }
        };
        if (state === "fulfilled") enqueueMicro(`${name}.then`, handleF);
        else if (state === "rejected") enqueueMicro(`${name}.then`, handleR);
        else { handlers.fulfilled.push(handleF); handlers.rejected.push(handleR); }
        return child;
      },
      catch(onR) { return p.then(undefined, onR); },
      finally(onF) {
        const child = makePromise();
        const run = async () => {
          try { if (typeof onF === "function") await maybeAwait(onF()); } catch (e) { return child.__reject(e); }
          if (state === "fulfilled") child.__resolve(value);
          else child.__reject(value);
        };
        if (state === "pending") handlers.finally.push(run);
        else enqueueMicro(`${name}.finally`, run);
        return child;
      },
      __resolve(v) { settle("fulfilled", v); },
      __reject(v) { settle("rejected", v); },
    };
    return p;
  }

  async function maybeAwait(v) {
    if (v && v.__isSimPromise) {
      return new Promise((resolve, reject) => {
        v.then(resolve, reject);
      });
    }
    return v;
  }

  function makeSandbox() {
    const sim = {
      console: {
        log: (...a) => logTo("log", ...a),
        info: (...a) => logTo("info", ...a),
        warn: (...a) => logTo("warn", ...a),
        error: (...a) => logTo("err", ...a),
      },
      setTimeout(fn, delay = 0, ...args) {
        const id = ++State.timerSeq;
        const meta = `${delay}ms`;
        const apiObj = addWebApi(`setTimeout #${id}`, meta);
        const realDelay = Math.max(50, Math.min(2000, +delay || 0) + 200);
        setTimeout(() => {
          if (State.cancelled.has(id) || State.aborted) {
            removeWebApi(apiObj);
            return;
          }
          removeWebApi(apiObj);
          enqueueMacro(`timer #${id} cb`, async () => { await fn(...args); }, meta);
        }, realDelay);
        return id;
      },
      clearTimeout(id) { State.cancelled.add(id); },
      setInterval(fn, delay = 0) {
        return sim.setTimeout(fn, delay);
      },
      clearInterval(id) { State.cancelled.add(id); },
      queueMicrotask(fn) { enqueueMicro("microtask", async () => { await fn(); }); },
      requestAnimationFrame(fn) {
        const id = ++State.timerSeq;
        const apiObj = addWebApi(`rAF #${id}`, "~16ms");
        setTimeout(() => {
          removeWebApi(apiObj);
          enqueueMacro(`rAF #${id} cb`, async () => { await fn(performance.now()); }, "rAF");
        }, Math.max(speed, 200));
        return id;
      },
      Promise: {
        resolve(v) { const p = makePromise(); p.__resolve(v); return p; },
        reject(v) { const p = makePromise(); p.__reject(v); return p; },
        all(arr) {
          const p = makePromise();
          const results = [];
          let remaining = arr.length;
          if (!remaining) p.__resolve([]);
          arr.forEach((item, i) => {
            const handle = (v) => { results[i] = v; if (--remaining === 0) p.__resolve(results); };
            if (item && item.__isSimPromise) item.then(handle, p.__reject);
            else handle(item);
          });
          return p;
        },
      },
      __makePromise: makePromise,
    };
    return sim;
  }

  function transformCode(src) {
    return src.replace(/\bnew\s+Promise\s*\(/g, "__newSimPromise(");
  }

  function buildRunner(src) {
    const sandbox = makeSandbox();
    const transformed = transformCode(src);
    const __newSimPromise = (executor) => {
      const p = sandbox.__makePromise();
      try {
        executor(
          (v) => p.__resolve(v),
          (e) => p.__reject(e),
        );
      } catch (e) { p.__reject(e); }
      return p;
    };
    const fn = new Function(
      "console", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
      "queueMicrotask", "requestAnimationFrame", "Promise", "__newSimPromise",
      transformed
    );
    return () => fn(
      sandbox.console, sandbox.setTimeout, sandbox.clearTimeout, sandbox.setInterval,
      sandbox.clearInterval, sandbox.queueMicrotask, sandbox.requestAnimationFrame,
      sandbox.Promise, __newSimPromise
    );
  }

  async function runMainScript(runner) {
    await pushStack("main()");
    try { runner(); } catch (e) { logTo("err", "Error:", e.message || e); }
    await popStack();
  }

  async function run() {
    if (State.running) return;
    reset(false);
    State.running = true;
    runBtn.disabled = true;
    setLoopStatus(State.mode === "manual" ? "manual mode — use Step" : "running automatically",
                  State.mode === "manual");
    logTo("sys", "▶ running…");
    try {
      const runner = buildRunner(codeEl.value);
      await runMainScript(runner);
      while (!State.aborted) {
        await waitForNextStep();
        if (State.aborted) break;
        const result = await stepOnce();
        if (result === "idle") break;
        if (result === "waiting") {
          await sleep(160);
          if (!State.micro.length && !State.macro.length && !State.webapi.length) break;
        }
      }
      if (!State.aborted) logTo("sys", "✓ event loop idle");
    } catch (e) {
      logTo("err", "Error:", e.message || e);
    } finally {
      State.running = false;
      runBtn.disabled = false;
      setStepBtnEnabled(false);
      stepResolver = null;
      setLoopStatus(State.mode === "manual" ? "manual mode (will pause on Run)" : "running automatically");
    }
  }

  function reset(clearConsole = true) {
    State.aborted = true;
    setTimeout(() => (State.aborted = false), 50);
    State.stack.length = 0;
    State.webapi.length = 0;
    State.micro.length = 0;
    State.macro.length = 0;
    State.cancelled.clear();
    State.timerSeq = 0;
    State.promiseSeq = 0;
    if (stepResolver) { const r = stepResolver; stepResolver = null; r(); }
    setStepBtnEnabled(false);
    if (clearConsole) consoleEl.innerHTML = "";
    render();
  }

  function saveCode() {
    try { localStorage.setItem(STORAGE_KEY, codeEl.value); } catch (_) {}
  }
  function loadSavedCode() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function getLineStart(value, pos) {
    const before = value.slice(0, pos);
    const nl = before.lastIndexOf("\n");
    return nl === -1 ? 0 : nl + 1;
  }
  function getLeadingWhitespace(line) {
    const m = line.match(/^[ \t]*/);
    return m ? m[0] : "";
  }
  function indentSelection(direction) {
    const value = codeEl.value;
    let start = codeEl.selectionStart;
    let end = codeEl.selectionEnd;
    const blockStart = getLineStart(value, start);
    const before = value.slice(0, blockStart);
    const block = value.slice(blockStart, end);
    const after = value.slice(end);
    const lines = block.split("\n");
    let firstDelta = 0;
    let totalDelta = 0;
    const newBlock = lines
      .map((line, i) => {
        if (direction === 1) {
          if (i === 0) firstDelta = INDENT.length;
          totalDelta += INDENT.length;
          return INDENT + line;
        } else {
          let removed = 0;
          if (line.startsWith(INDENT)) { line = line.slice(INDENT.length); removed = INDENT.length; }
          else if (line.startsWith("\t")) { line = line.slice(1); removed = 1; }
          else if (line.startsWith(" ")) { line = line.slice(1); removed = 1; }
          if (i === 0) firstDelta = -removed;
          totalDelta -= removed;
          return line;
        }
      })
      .join("\n");
    codeEl.value = before + newBlock + after;
    codeEl.selectionStart = Math.max(blockStart, start + firstDelta);
    codeEl.selectionEnd = Math.max(blockStart, end + totalDelta);
    saveCode();
  }
  function insertTab() {
    const start = codeEl.selectionStart;
    const end = codeEl.selectionEnd;
    if (start !== end) { indentSelection(1); return; }
    const value = codeEl.value;
    codeEl.value = value.slice(0, start) + INDENT + value.slice(end);
    codeEl.selectionStart = codeEl.selectionEnd = start + INDENT.length;
    saveCode();
  }
  function handleEnter(e) {
    const start = codeEl.selectionStart;
    const end = codeEl.selectionEnd;
    const value = codeEl.value;
    const lineStart = getLineStart(value, start);
    const currentLine = value.slice(lineStart, start);
    const indent = getLeadingWhitespace(currentLine);
    const charBefore = value[start - 1];
    const charAfter = value[start];
    let extra = "";
    if (charBefore === "{" || charBefore === "[" || charBefore === "(") extra = INDENT;
    e.preventDefault();
    const insert = "\n" + indent + extra;
    if (extra && ((charBefore === "{" && charAfter === "}") ||
                  (charBefore === "[" && charAfter === "]") ||
                  (charBefore === "(" && charAfter === ")"))) {
      const tail = "\n" + indent;
      codeEl.value = value.slice(0, start) + insert + tail + value.slice(end);
      codeEl.selectionStart = codeEl.selectionEnd = start + insert.length;
    } else {
      codeEl.value = value.slice(0, start) + insert + value.slice(end);
      codeEl.selectionStart = codeEl.selectionEnd = start + insert.length;
    }
    saveCode();
  }

  codeEl.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) indentSelection(-1);
      else insertTab();
    } else if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      handleEnter(e);
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      run();
    }
  });
  codeEl.addEventListener("input", saveCode);

  examplesEl.addEventListener("change", () => {
    const current = codeEl.value.trim();
    const wasExample = Object.values(examples).some((ex) => ex.trim() === current);
    if (current && !wasExample) {
      const ok = confirm("Load this example and discard your current edits?");
      if (!ok) { examplesEl.value = ""; return; }
    }
    codeEl.value = examples[examplesEl.value];
    saveCode();
  });
  runBtn.addEventListener("click", run);
  resetBtn.addEventListener("click", () => {
    reset(true);
    setLoopStatus(State.mode === "manual" ? "manual mode (will pause on Run)" : "running automatically");
  });
  clearBtn.addEventListener("click", () => {
    codeEl.value = "";
    saveCode();
    codeEl.focus();
  });
  stepBtn.addEventListener("click", triggerStep);
  modeRadios.forEach((r) => r.addEventListener("change", (e) => {
    if (e.target.checked) setMode(e.target.value);
  }));

  const saved = loadSavedCode();
  codeEl.value = saved && saved.trim() ? saved : examples.basic;
  render();
