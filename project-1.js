const puppeteer = require('puppeteer');
let fs = require("fs");
let url = process.argv[2];
let nVideos = process.argv[3];
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"]
    });
    let tabs = await browser.pages();
    let page = tabs[0];
    await page.goto(url, { waitUntil: "networkidle2", timeout:0 });
    let Videos = await page.$$(".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer");
    console.log(Videos.length);
    let pArr =  [];
    for (let i = 0; i < Videos.length; i++) {
        if (i < nVideos) {
            let href = await page.evaluate((el) => {
                return el.getAttribute("href");
            }, Videos[i]);
            let VideoUrl = "https://www.youtube.com/" + href
            let newTab = await browser.newPage();
            let mWillAddProm =  HandleSingleUrl(newTab, VideoUrl,i);
            pArr.push(mWillAddProm);
        }
        await Promise.all(pArr);
        
    }
})();

async function HandleSingleUrl(newTab, VideoUrl,i) {
    console.log(i)
    await newTab.goto("https://www.y2mate.com", { waitUntil: "networkidle2" });
    await newTab.waitForSelector(".form-control.input-lg", { visible: true });
    await newTab.type(".form-control.input-lg", VideoUrl);
    await newTab.keyboard.press("Enter");
    await newTab.waitForSelector(".btn.btn-success", { visible: true });
    await newTab.click(".btn.btn-success");
    await newTab.waitForSelector(".form-group.has-success.has-feedback", { visible: true });
    await newTab.click(".form-group.has-success.has-feedback", { waitUntil: "networkidle0" });
    await newTab.close();
}