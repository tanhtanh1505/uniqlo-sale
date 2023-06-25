import { Injectable } from '@nestjs/common';
import { Cloth } from 'src/entity';
import * as puppeteer from 'puppeteer';
import { LoggersService } from '../loggers/loggers.service';
import { LoggerType } from 'src/utils/enums';

@Injectable()
export class CrawlerService {
  constructor(private readonly loggersService: LoggersService) {}

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

    let response = await page.evaluate(() => {
      const items = document.getElementsByClassName('fr-grid-item w4');
      const links = [];
      for (let i = 0; i < items.length; i++) {
        const hasSaleTag = items[i].getElementsByClassName('price-limited')[0];
        if (hasSaleTag) {
          let url = items[i].getElementsByTagName('a')[0].getAttribute('href');

          if (url && url.indexOf('http') == -1) {
            url = `https://www.uniqlo.com${url}`;
          }

          links.push({
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
      if (!detail) {
        await this.loggersService.createLog({
          type: LoggerType.ERROR,
          content: `Crawl details failed: ${response[i].url}`,
        });
        continue;
      }

      response[i] = { ...response[i], ...detail };
      response[i].person = person;
    }

    response = response.filter((item) => item.code);

    await browser.close();

    return response;
  }

  async crawlDetails(url: string): Promise<Cloth> {
    if (!url) return null;

    const browser = await puppeteer.launch({
      // headless: false,
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, { waitUntil: 'networkidle0' });

    const response = await page.evaluate(() => {
      try {
        const colors = document.getElementsByName('product-color-picker');
        const sizes = document.getElementsByName('product-size-picker');
        const title =
          document.getElementsByClassName('fr-head h1')[0].textContent;

        const image = document
          .getElementsByClassName('fr-product-image')[0]
          .getElementsByTagName('img')[0]
          .getAttribute('src');

        const person =
          document.getElementsByClassName('fr-breadcrumbs')[0].children[1]
            .textContent;

        // price before sale
        const oldPrice = document.getElementsByClassName(
          'price fr-no-uppercase',
        )[0].children[0].textContent;

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
            )[0].children[1].textContent;

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
          price: oldPrice !== '' ? Number(oldPrice.replace(/[^\d+]/g, '')) : 0,
          listSizeaColor: listSizeaColor,
        };
      } catch (e) {
        return null;
      }
    });
    console.log(response);

    await browser.close();

    if (!response) return null;

    // Mac dinh, crawl 1 san pham chua biet sale hay khong
    return {
      person: response.person,
      title: response.title,
      image: response.image,
      price: response.price,
      salePrice: response.listSizeaColor[0].price,
      time: 'Now',
      sale: response.listSizeaColor[0].sale,
      url: url,
      code: url.split('?')[0].split('/').pop(),
      sizeColor: response.listSizeaColor,
    };
  }
}
