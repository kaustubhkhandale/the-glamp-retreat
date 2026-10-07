import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// Connect only to an explicitly launched, isolated QA browser.
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const endpoint = process.env.TEST_BROWSER_ENDPOINT || 'http://127.0.0.1:9237';
const targets = await (await fetch(`${endpoint}/json/list`)).json();
const target = targets.find((entry) => entry.type === 'page' && entry.url === 'about:blank');
assert(target, 'Start an isolated QA browser with an about:blank tab first.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0;
const pending = new Map(), errors = [], resourceErrors = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request?.reject(new Error(JSON.stringify(message.error)));
    else request?.resolve(message.result);
  } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(arg => arg.value || arg.description));
  else if (message.method === 'Network.responseReceived' && message.params.response.url.startsWith(origin) && message.params.response.status >= 400) resourceErrors.push(message.params.response);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function ready(path) {
  await send('Page.navigate', { url: `${origin}${path}` });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('main h1')`)) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await evaluate('document.fonts.ready.then(() => true)');
}
await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
await mkdir('.qa', { recursive: true });
const routes = ['/', '/about', '/gallery', '/amenities', '/packages', '/contact', '/privacy', '/booking-terms'];
const reports = [], anchors = new Set();
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const path of routes) {
      await ready(path);
      const report = await evaluate(`(() => {
        const root = getComputedStyle(document.documentElement);
        return { path: location.pathname, width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelectorAll('h1').length, header: document.querySelectorAll('header.header').length,
          footer: document.querySelectorAll('footer').length, headingFont: getComputedStyle(document.querySelector('h1')).fontFamily,
          bodyFont: getComputedStyle(document.body).fontFamily, background: getComputedStyle(document.body).backgroundColor,
          headerPosition: getComputedStyle(document.querySelector('header.header')).position,
          missingTokens: [...new Set([...Array.from(document.styleSheets).flatMap(sheet => { try { return Array.from(sheet.cssRules).map(rule => rule.cssText); } catch { return []; } }).join('').matchAll(/var\\((--(?:color|font)-[\\w-]+)/g)].map(match => match[1]))].filter(token => !root.getPropertyValue(token).trim()),
          links: Array.from(document.querySelectorAll('a[href]')).map(link => link.getAttribute('href')) };
      })()`);
      assert.equal(report.h1, 1, `${path}: one h1`);
      assert.equal(report.header, 1, `${path}: shared header`);
      assert.equal(report.footer, 1, `${path}: shared footer`);
      assert(report.scrollWidth <= report.width, `${path} overflows at ${width}: ${report.scrollWidth}`);
      assert.equal(report.background, 'rgb(252, 249, 244)', `${path}: brand background`);
      assert.equal(report.headerPosition, 'fixed', `${path}: header styling`);
      assert.deepEqual(report.missingTokens, [], `${path}: missing runtime design tokens`);
      assert.match(report.headingFont, /headingFont/i, `${path}: local Playfair font`);
      assert.match(report.bodyFont, /bodyFont/i, `${path}: local Jakarta font`);
      for (const href of report.links.filter(href => href.startsWith('/') && !href.startsWith('//'))) {
        assert(routes.includes(href.split('#')[0] || path), `${path}: unknown page link ${href}`);
        if (href.includes('#')) anchors.add(href);
      }
      for (const href of report.links.filter(href => href.startsWith('#'))) anchors.add(`${path}${href}`);
      reports.push({ ...report, links: undefined });
      if (width === 1440 || width === 390) {
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
        await writeFile(`.qa/${path === '/' ? 'home' : path.slice(1)}-${width}.png`, Buffer.from(screenshot.data, 'base64'));
      }
    }
  }
  for (const href of anchors) {
    const [path, fragment] = href.split('#');
    await ready(path);
    assert(await evaluate(`!!document.getElementById(${JSON.stringify(decodeURIComponent(fragment))})`), `Missing anchor target: ${href}`);
  }
  await ready('/');
  await evaluate(`document.querySelector('.menu-toggle').click()`);
  await new Promise(resolve => setTimeout(resolve, 200));
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'true');
  assert.equal(await evaluate(`document.activeElement.closest('nav')?.id`), 'main-navigation');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false');
  assert.equal(await evaluate(`document.activeElement.className`), 'menu-toggle');
  await evaluate(`document.querySelector('.menu-toggle').click()`);
  await evaluate(`document.querySelector('nav a[href="/about"]').click()`);
  for (let attempt = 0; attempt < 100 && !(await evaluate(`location.pathname === '/about'`)); attempt++) await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(await evaluate('location.pathname'), '/about');
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false');
  assert.equal(await evaluate(`document.querySelector('nav a[aria-current="page"]').getAttribute('href')`), '/about');
  assert.deepEqual(errors, [], 'No uncaught browser JavaScript errors');
  assert.deepEqual(resourceErrors, [], 'No failed page or asset responses');
  await writeFile('.qa/browser-report.json', JSON.stringify(reports, null, 2));
  console.log(`Passed ${reports.length} page/viewport checks, ${anchors.size} anchor targets, navigation click, menu keyboard/focus checks, and runtime error checks. Screenshots: .qa/`);
} finally {
  await send('Page.navigate', { url: 'about:blank' });
  socket.close();
}
