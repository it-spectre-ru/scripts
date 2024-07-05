const fs = require('fs');
const { Parser } = require('json2csv');

// Function to convert JSON to CSV
const jsonToCsv = (jsonData) => {
  // Flatten the arrays into a single string separated by commas
  const flattenArray = (arr) => arr.join(',');

  // Map through the data to prepare it for CSV conversion
  const csvData = jsonData.map((item) => ({
    url: item.url,
    title: item.title,
    subtitle: item.subtitle,
    paragraphs: flattenArray(item.paragraphs),
    competitions: flattenArray(item.competitions)
  }));

  // Fields for the CSV file
  const fields = ['url', 'title', 'subtitle', 'paragraphs', 'competitions'];

  // Create a new parser
  const json2csvParser = new Parser({ fields });

  // Convert the data to CSV
  return json2csvParser.parse(csvData);
};

// Read JSON data from file
fs.readFile('results.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  // Parse JSON data
  const jsonData = JSON.parse(data);

  // Convert JSON to CSV
  const csv = jsonToCsv(jsonData);

  // Save the CSV to a file
  fs.writeFile('output.csv', csv, (err) => {
    if (err) {
      console.error('Error writing to CSV file:', err);
    } else {
      console.log('CSV file successfully written.');
    }
  });
});
