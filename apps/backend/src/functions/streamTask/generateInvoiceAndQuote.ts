import { Task } from 'dependency-layer/API';
import invoiceTemplate from '../../helpers/invoiceTemplate';
import * as Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

const compileTemplate = (templateSource: string, data: Task) => {
  Handlebars.registerHelper('getIndex', (array, index) => array[index]);
  const template = Handlebars.compile(templateSource);
  return template(data);
};

const generatePDF = async (content: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  // await page.pdf({ path: outputPath, format: "A4" });
  // await browser.close();
  console.log('generatePDF----: ', page);
};

const generateImage = async (content: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  // await page.screenshot({ path: outputPath, type: format, fullPage: true });
  // await browser.close();
  console.log('generateImage----: ', page);
};

export const generateInvoiceAndQuote = async (task: Task) => {
  console.log('generateInvoiceAndQuote task: ', task);
  console.log('generateInvoiceAndQuote invoiceTemplate: ', invoiceTemplate);

  const content = compileTemplate(invoiceTemplate, task);
  console.log('generateInvoiceAndQuote content: ', content);
  await generatePDF(content);
  await generateImage(content);
};
