const puppeteer = require('puppeteer');

async function login() {
  const url = process.env.ALBA_URL;
  const account = process.env.ALBA_ACCOUNT;
  const user = process.env.ALBA_USER;
  const pass = process.env.ALBA_PASS;
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor(1000);

  await page.type('input[name="an"]', account);
  await page.type('input[name="us"]', user);
  await page.type('input[name="pw"]', pass);
  await page.click('button[type="submit"]');
  await page.waitFor(1000);
  return { browser, page };
}

async function assign({ territory, user }) {
  const { browser, page } = await login();

  await page.goto(`${process.env.ALBA_URL}assigned`);

  const territoryRowSelector = `#territories #te${territory}`;
  await page.waitFor(5000);
  await page.click(`${territoryRowSelector} .controls a.dropdown-toggle`);
  await page.waitFor(1000);
  await page.click(`${territoryRowSelector} .controls a.cmd-assign-to`);
  await page.waitFor(1000);
  await page.select(`${territoryRowSelector} .change_status select[name="users"]`, user);
  await page.waitFor(1000);
  await page.click(`${territoryRowSelector} .change_status button.cmd-assign`);
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const selector = '.navbar a.brand';
    const element = document.querySelector(selector);
    const text = element.innerText;
    return text;
  });

  browser.close();
  return result;
}

async function unassign({ territory }) {
  const { browser, page } = await login();

  await page.goto(`${process.env.ALBA_URL}assigned`);

  const territoryRowSelector = `#territories #te${territory}`;
  await page.waitFor(5000);
  await page.click(`${territoryRowSelector} .controls a.dropdown-toggle`);
  await page.waitFor(1000);
  await page.click(`${territoryRowSelector} .controls a.cmd-unassign`);
  await page.waitFor(1000);
  await page.click(`.bootbox .modal-footer a[data-handler="1"]`);
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const selector = '.navbar a.brand';
    const element = document.querySelector(selector);
    const text = element.innerText;
    return text;
  });

  browser.close();
  return result;
}

async function reassign({ territory, user }) {
  const { browser, page } = await login();

  await page.goto(`${process.env.ALBA_URL}assigned`);

  const territoryRowSelector = `#territories #te${territory}`;
  await page.waitFor(5000);
  await page.click(`${territoryRowSelector} .controls a.dropdown-toggle`);
  await page.waitFor(1000);
  await page.click(`${territoryRowSelector} .controls a.cmd-reassign-to`);
  await page.waitFor(1000);
  await page.select(`${territoryRowSelector} .change_status select[name="users"]`, user);
  await page.waitFor(1000);
  await page.click(`${territoryRowSelector} .change_status button.cmd-reassign`);
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    const selector = '.navbar a.brand';
    const element = document.querySelector(selector);
    const text = element.innerText;
    return text;
  });

  browser.close();
  return result;
}

module.exports = { assign, unassign, reassign };
