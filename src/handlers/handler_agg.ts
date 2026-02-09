import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'User-Agent': 'gator',
        }
    };
    try {
        const response = await fetch(feedURL, requestOptions);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const feedText = await response.text();
        const parser = new XMLParser();
        const feedData = parser.parse(feedText);
        const rssFeed = feedData.rss;
        if (!rssFeed) {
            throw new Error('Invalid RSS feed format: missing rss element.');
        }
        const channel = rssFeed.channel;
        if (!channel) {
            throw new Error('Invalid RSS feed format: missing channel element.');
        }
        const title = channel.title;
        if (!title) {
            throw new Error('Invalid RSS feed format: missing channel title.');
        }
        const description = channel.description;
        if (!description) {
            throw new Error('Invalid RSS feed format: missing channel description.');
        }
        const link = channel.link;
        if (!link) {
            throw new Error('Invalid RSS feed format: missing channel link.');
        }
        const items = channel.item;
        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid RSS feed format: missing or invalid channel items.');
        }
        const validItems: RSSItem[] = [];
        for (const item of items) {
            if (!item.title || !item.link || !item.description || !item.pubDate) {
                console.warn(`Skipping invalid item: ${JSON.stringify(item)}`);
                continue;
            }
            validItems.push(item);
        }
        const rssFeedOutput: RSSFeed = {
            channel: {
                title,
                description,
                link,
                item: validItems,
            }
        };
        return rssFeedOutput;
    } catch (err) {
        console.error(`Failed to fetch feed from ${feedURL}: ${err}`);
        throw err;
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    let feedURL: string;
    if (args.length === 0) {
        feedURL = 'https://www.wagslane.dev/index.xml';
    } else {
        feedURL = args[0];
    }
    try {
        const feedData = await fetchFeed(feedURL);
        console.log(`Fetched feed data from ${feedURL}:`);
        console.log(JSON.stringify(feedData, null, 2));
    } catch (err) {
        console.error(`Failed to fetch feed from ${feedURL}: ${err}`);
        throw err;
    }
}