import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";

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

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        throw new Error('No feeds to fetch.');
    }
    await markFeedFetched(nextFeed.id);
    const feedData = await fetchFeed(nextFeed.url);
    if (!feedData) {
        throw new Error(`Failed to fetch feed data for feed ID ${nextFeed.id}`);
    }
    console.log(`\nFetched feed data for feed "${nextFeed.name}"`);
    feedData.channel.item.forEach(item => {
        console.log(`Title: ${item.title}`);
    });
}

function parseDuration(duration: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = duration.match(regex);
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case 'ms':
            return value;
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        default:
            throw new Error(`Invalid duration unit: ${unit}`);
    }
}

function handleScrapeError(err: any) {
    console.error(`Error during feed scraping: ${err}`);
}

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    const timeBetweenFetches = args.length > 0 ? args[0] : '1h';
    const timeBetweenFetchesMs = parseDuration(timeBetweenFetches);
    console.log(`Starting feed scraper with time between fetches: ${timeBetweenFetches} (${timeBetweenFetchesMs} ms)`);
    try {
        scrapeFeeds().catch(handleScrapeError);
        const interval = setInterval(() => {
            scrapeFeeds().catch(handleScrapeError);
        }, timeBetweenFetchesMs);
        await new Promise<void>((resolve) => {
            process.on("SIGINT", () => {
                console.log("Shutting down feed aggregator...");
                clearInterval(interval);
                resolve();
            });
        });
    } catch (err) {
        console.error(`Failed to start feed scraper: ${err}`);
        throw err;
    }
}