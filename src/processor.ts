import * as cheerio from 'cheerio';
import * as fetch from 'node-fetch';
import { URL } from 'url';

const defaultSelector = 'head > title';

const sitesToProcess = new Map([
    ['github.com', {selector: '.f4.mt-3', processor: githubProcessor}],
    ['dev.to', {selector: defaultSelector, processor: devtoProcessor}]
]);

export async function process(href: string) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38"
    };

    const result = await fetch(href, { headers });
    const dom = await result.text();
    
    const $ = cheerio.load(dom);
    
    const urlObject = new URL(href);
    const site = sitesToProcess.get(urlObject.hostname);

    let selector = defaultSelector;
    let title = $(selector).text();   

    if (site) {
        selector = site.selector;
        title = await site.processor(title);
    }
    title = title.replace(/\|/gi, '\\\|').trim();

    if (!title) {
        title = href;
    }
    return {title, href};

}

async function githubProcessor(title: string): Promise<string> {
    return title;
}

async function devtoProcessor(title: string): Promise<string> {
    return title.replace(/ - DEV.*/, '');
}