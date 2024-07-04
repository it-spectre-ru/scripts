const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

// Function to add delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readUrlsFromFile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return data.split('\n').filter(url => url.trim() !== '');
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error.message);
        return [];
    }
}

async function scrapeWebsite(url) {
    try {
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, { timeout: 10000 }); // 10 second timeout
        console.log(`Successfully fetched ${url}`);

        const $ = cheerio.load(response.data);

        const result = { url };

        // Extract data from <div class="flex-1">
        const flex1Div = $('.flex-1');
        result.title = flex1Div.find('h1.mb-2').text().trim();
        result.subtitle = flex1Div.find('div.mb-3').text().trim();

        // Extract data from <div class="prose my-4">
        const proseDiv = $('.prose.my-4');
        result.paragraphs = proseDiv.find('p').map((i, el) => $(el).text().trim()).get();

        return result;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

async function scrapeAllWebsites(urls, delayMs = 2000) {
    const results = [];

    for (const url of urls) {
        console.log(`Starting to scrape ${url}...`);
        const result = await scrapeWebsite(url);
        if (result) {
            results.push(result);
        }
        console.log(`Waiting for ${delayMs}ms before next request...`);
        await delay(delayMs);
    }

    return results;
}

async function saveResultsToFile(results, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(results, null, 2));
        console.log(`Results saved to ${filename}`);
    } catch (error) {
        console.error(`Error saving results to ${filename}:`, error.message);
    }
}

async function main() {
    const urlsFile = 'urls.txt';
    const resultsFile = 'results.json';
    const delayBetweenRequests = 2000; // 2 seconds delay, adjust as needed

    try {
        const urls = await readUrlsFromFile(urlsFile);
        if (urls.length === 0) {
            console.log('No URLs found in the file. Exiting.');
            return;
        }

        console.log(`Found ${urls.length} URLs to scrape.`);
        const results = await scrapeAllWebsites(urls, delayBetweenRequests);
        await saveResultsToFile(results, resultsFile);
    } catch (error) {
        console.error('An error occurred in the main process:', error);
    }
}

main();