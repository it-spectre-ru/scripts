const axios = require('axios');
const cheerio = require('cheerio');

// List of URLs to scrape
const urls = [
  'https://getmentor.dev/mentor/petr-kostiukov-2466',
  'https://getmentor.dev/mentor/korovin-vladimir-3450',
  // Add more URLs as needed
];

async function scrapeWebsite(url) {
    try {
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, { timeout: 10000 }); // 10 second timeout
        console.log(`Successfully fetched ${url}`);

        const $ = cheerio.load(response.data);

        const result = {};

        // Extract data from <div class="flex-1">
        const flex1Div = $('.flex-1');
        if (flex1Div.length === 0) {
            console.warn(`Warning: Could not find <div class="flex-1"> on ${url}`);
        }
        result.title = flex1Div.find('h1.mb-2').text().trim();
        result.subtitle = flex1Div.find('div.mb-3').text().trim();

        // Extract data from <div class="prose my-4">
        const proseDiv = $('.prose.my-4');
        if (proseDiv.length === 0) {
            console.warn(`Warning: Could not find <div class="prose my-4"> on ${url}`);
        }
        result.paragraphs = proseDiv.find('p').map((i, el) => $(el).text().trim()).get();

        console.log(`Scraped data from ${url}:`, result);
        return result;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        if (error.response) {
            console.error(`HTTP Status: ${error.response.status}`);
            console.error(`Response headers:`, error.response.headers);
        }
        return null;
    }
}

async function scrapeAllWebsites() {
    const results = [];

    for (const url of urls) {
        console.log(`Starting to scrape ${url}...`);
        const result = await scrapeWebsite(url);
        if (result) {
            results.push({ url, ...result });
        }
    }

    console.log('Scraping completed. Results:');
    console.log(JSON.stringify(results, null, 2));
}

scrapeAllWebsites().catch(error => {
    console.error('An error occurred in the main scraping process:', error);
});