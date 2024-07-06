const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function mergePDFs(pdfPaths, outputPath) {
  try {
    console.log('Loading PDF files...');
    // Load all PDF files
    const pdfDocs = await Promise.all(pdfPaths.map(async (path) => {
      console.log(`Loading PDF: ${path}`);
      const file = fs.readFileSync(path);
      return await PDFDocument.load(file);
    }));

    console.log('Creating a new PDFDocument...');
    // Create a new PDFDocument to merge all PDFs into
    const mergedPdf = await PDFDocument.create();

    console.log('Copying pages...');
    for (const pdfDoc of pdfDocs) {
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    console.log('Saving the merged PDF...');
    
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);

    console.log(`PDFs merged successfully: ${outputPath}`);
  } catch (error) {
    console.error('Error merging PDFs:', error);
  }
}


const pdfPaths = ['output1.pdf', 'output2.pdf', 'output3.pdf']; 
const outputPath = 'merged_output.pdf';
mergePDFs(pdfPaths, outputPath);
