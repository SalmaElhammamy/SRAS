const puppeteer = require('puppeteer');
const fs = require('fs');
const PDFDocument = require('pdfkit');

async function generatePDF(url, outputPath, selector) {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    defaultViewport: null 
  });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    console.log('Navigation complete');

    console.log('Waiting for the page to fully render...');
    await page.waitForSelector(selector, { timeout: 60000 });

    console.log('Taking screenshot of the specific element...');
    const element = await page.$(selector);
    await element.screenshot({ path: 'element.png' });
    console.log('Element screenshot taken');

    console.log('Generating PDF with the specific element...');
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outputPath));
    doc.image('element.png', {
      fit: [500, 400],
      align: 'center',
      valign: 'center'
    });
    doc.end();
    console.log(`PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
}


const url = 'https://studentportal.aast.edu/Login';
const outputPath = 'output.pdf';
const selector = 'button.btn.btn-danger.btn-block.btn-lg[type="button"]'; 

generatePDF(url, outputPath, selector);
