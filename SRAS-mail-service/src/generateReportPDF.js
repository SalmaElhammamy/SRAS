const puppeteer = require('puppeteer');
const fs = require('fs');
const PDFDocument = require('pdfkit');


function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time);
  });
}

async function generatePDF(url, outputPath, selector) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080'
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    console.log('Navigation complete');

    console.log('Waiting for the page to fully render...');
    await page.waitForSelector(selector, { timeout: 60000 });

    // Wait for 10 seconds before proceeding
    await delay(10000);

    console.log('Taking screenshot of the specific element...');
    const element = await page.$(selector);
    const boundingBox = await element.boundingBox();
    const scaleFactor = 2;

   
    await element.screenshot({ path: 'element.png' });
    console.log('Element screenshot taken');

    console.log('Generating PDF with the specific element...');
    const doc = new PDFDocument({
      size: [boundingBox.width * scaleFactor, boundingBox.height * scaleFactor],  
      layout: 'portrait'
    });

    // Pipe the PDF document to a writable stream
    const outputStream = fs.createWriteStream(outputPath);
    doc.pipe(outputStream);

    
    doc.fontSize(60).font('Helvetica-Bold').text('Statistics', {
      align: 'center',
      width: doc.page.width,
      lineBreak: false
    });

    // Center the image within the PDF
    const centerX = (doc.page.width - boundingBox.width * scaleFactor) / 2;
    const centerY = doc.y + 50;

    doc.image('element.png', centerX, centerY, {
      fit: [boundingBox.width * scaleFactor, boundingBox.height * scaleFactor],
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

const url = 'http://localhost:3000/reports';
const outputPath = 'output2.pdf';
const selector = '#report-statistics';

generatePDF(url, outputPath, selector);

