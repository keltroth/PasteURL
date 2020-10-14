import * as cheerio from 'cheerio';
import * as fetch from 'node-fetch';
import { URL } from 'url';

const sitesToProcess = new Map([
    ['github.com', '.f4.mt-3']
]);

export async function process(href: string) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38"
    };

    const result = await fetch(href, { headers });
    const dom = await result.text();
    
    const $ = cheerio.load(dom);
    
    const urlObject = new URL(href);
    const selector = sitesToProcess.get(urlObject.hostname) || 'title';

    let title = $(selector).text();   

    if (!title) {
        return {title : href, href};
    }

    title = title.replace(/\|/gi, '\\\|').trim();
    return {title, href};

}
