import * as cheerio from 'cheerio';
import * as fetch from 'node-fetch';
import { URL } from 'url';

const defaultSelector = 'head > title';

const sitesToProcess = new Map([
    ['github.com', {selector: '.f4.mt-3', processor: defaultProcessor}],
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

    let title = $(defaultSelector).text();

    if (site) {
        title = await site.processor($(site.selector).text());
    } else {
        title = await defaultProcessor(title);
    }
    title = await title.replace(/\|/gi, '\\\|').trim();

    let outHref = await cleanHref(urlObject);

    if (!title) {
        title = outHref;
    }
    return {title, href: outHref};

}

async function defaultProcessor(title: string): Promise<string> {
    return title;
}

async function devtoProcessor(title: string): Promise<string> {
    return title.replace(/ - DEV.*/, '');
}

async function cleanHref(url): Promise<string> {

    const paramsToRemove = [
        'utm_campaign',
        'utm_source',
        'utm_medium',
        'utm_term'
    ];

    for (let param of paramsToRemove) {
        url.searchParams.delete(param);
    }

    return url.href;
}
