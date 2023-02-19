// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Injectable } from '@nestjs/common';
import { Cloth } from 'src/entity';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  private readonly clothes: Cloth[] = [];

  async crawlScheduleSale(url: string): Promise<Cloth[]> {
    const browser = await puppeteer.launch({
      //headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, { waitUntil: 'networkidle0' });

    const response = await page.evaluate(() => {
      const items = document.getElementsByClassName('fr-grid-item w4');
      const links = [];
      for (let i = 0; i < items.length; i++) {
        const title =
          items[i].children[0].childNodes[0].childNodes[3].childNodes[1]
            .innerHTML;
        const priceElement = items[i].children[0].childNodes[0].childNodes[3];
        const price = priceElement
          .querySelector('.fr-product-price')
          .querySelector('.dual-price-original').innerText;
        const salePrice = priceElement
          .querySelector('.fr-product-price')
          .querySelector('.price-limited').innerText;
        const time = priceElement
          .querySelector('.fr-product-price')
          .querySelector('.fr-status-flag-text').innerText;
        let url = items[i].firstChild.getAttribute('href');
        if (url && url.indexOf('http') == -1) {
          url = `https://www.uniqlo.com${url}`;
        }
        links.push({
          title: title,
          price: price,
          salePrice: salePrice,
          time: time,
          url: url,
        });
      }
      console.log(links);

      return links;
    });
    console.log(response);

    await browser.close();

    return response;
  }

  async crawlRandomSale(url: string): Promise<Cloth[]> {
    const browser = await puppeteer.launch({
      //headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, { waitUntil: 'networkidle0' });

    const response = await page.evaluate(() => {
      const items = document.getElementsByClassName('fr-grid-item w4');
      const links = [];
      for (let i = 0; i < items.length; i++) {
        const hasSaleTag =
          items[i].children[0].childNodes[0].children[2].children[2]
            .children[1];
        if (hasSaleTag) {
          const price =
            items[i].children[0].childNodes[0].children[2].children[2]
              .children[0].children[0].children[0].innerText;

          const salePrice =
            items[i].children[0].childNodes[0].children[2].children[2]
              .children[0].children[0].children[1].innerText;

          const title =
            items[i].children[0].childNodes[0].children[2].children[1]
              .innerText;

          // const size =
          //   items[i].children[0].childNodes[0].children[2].children[0]
          //     .children[1].innerText;

          // const image =
          //   items[i].children[0].childNodes[0].children[0].getElementsByTagName(
          //     'img',
          //   )[0].src;

          let url = items[i].firstChild.getAttribute('href');

          if (url && url.indexOf('http') == -1) {
            url = `https://www.uniqlo.com${url}`;
          }

          links.push({
            title: title,
            price: price,
            salePrice: salePrice,
            time: 'Random sale',
            url: url,
          });
        }
      }
      console.log(links);

      return links;
    });
    console.log(response);

    await browser.close();

    return response;
  }
}
