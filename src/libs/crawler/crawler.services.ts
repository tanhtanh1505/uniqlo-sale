// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Injectable } from '@nestjs/common';
import { Cloth } from 'src/entity';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  private readonly clothes: Cloth[] = [];

  async crawlRandomSale(person: string, url: string): Promise<Cloth[]> {
    if (!url) return [];

    const browser = await puppeteer.launch({
      //headless: false,
      executablePath: '/usr/bin/google-chrome',
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

          let url = items[i].firstChild.getAttribute('href');

          if (url && url.indexOf('http') == -1) {
            url = `https://www.uniqlo.com${url}`;
          }

          links.push({
            title: title,
            price: Number(price.replace(/[^\d+]/g, '')),
            salePrice: Number(salePrice.replace(/[^\d+]/g, '')),
            time: 'Random sale',
            sale: true,
            url: url,
          });
        }
      }
      return links;
    });

    for (let i = 0; i < response.length; i++) {
      const detail = await this.crawlDetails(response[i].url);
      response[i].sizeColor = detail.sizeColor;
      response[i].person = person;
      response[i].image = detail.image;
      response[i].code = detail.code;
    }

    await browser.close();

    return response;
  }

  async crawlDetails(url: string): Promise<Cloth> {
    if (!url) return [];

    const browser = await puppeteer.launch({
      // headless: false,
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, { waitUntil: 'networkidle0' });

    const response = await page.evaluate(() => {
      const colors = document.getElementsByName('product-color-picker');
      const sizes = document.getElementsByName('product-size-picker');
      const title = document.getElementsByClassName('fr-head h1')[0].innerText;
      const image =
        document.getElementsByClassName('fr-product-image')[0].children[1].src;
      const person =
        document.getElementsByClassName('fr-breadcrumbs')[0].children[1]
          .innerText;
      const listSizeaColor = [];

      for (let i = 0; i < colors.length; i++) {
        colors[i].click();
        const curColor = colors[i].parentElement.parentElement.dataset.test;

        for (let j = 0; j < sizes.length; j++) {
          sizes[j].click();
          const curSize = sizes[j].parentElement.innerText;

          const price = document.getElementsByClassName(
            'price fr-no-uppercase',
          )[0].children[1].className;
          const curPrice = document.getElementsByClassName(
            'price fr-no-uppercase',
          )[0].children[1].innerText;

          listSizeaColor.push({
            sale: price === 'price-limited',
            color: curColor,
            size: curSize,
            price: Number(curPrice.replace(/[^\d+]/g, '')),
          });
        }
      }
      return {
        person: person,
        title: title,
        image: image,
        listSizeaColor: listSizeaColor,
      };
    });
    console.log(response);

    await browser.close();

    return {
      person: response.person,
      title: response.title,
      image: response.image,
      price: 0,
      salePrice: 0,
      time: 'Now',
      sale: false,
      url: url,
      code: url.split('?')[0].split('/').pop(),
      sizeColor: response.listSizeaColor,
    };
  }
}
