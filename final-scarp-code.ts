import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';


interface City {
	name: string;
	country: string;
	area: number;
	population: number;
	flageImagePath: string;
}

export class CapitalCityScraper {
	async scrapeCity(url: string) {
		const response = await axios.get(url);
		const html = response.data;
		const query = cheerio.load(html);
		const cityName = query("#firstHeading").text().trim();
		const country = query(".mergedtoprow th:contains(Country) + td").text().trim();
		const areaRows = query(".mergedtoprow th:contains(Area)").parent().nextUntil(".mergedtoprow");
		const areaText = areaRows.find("th:contains(Capital city) + td").text().trim().replace(/km2.$/, "");
		const area = parseFloat(areaText.replace(/,/g, ''));

		const populationRows = query('.mergedtoprow th:contains(Population)').parent().nextUntil(".mergedtoprow");
		const populationText = populationRows.find("th:contains(Capital city) + td").text().trim();
		const population = parseFloat(populationText.replace(/,/g, ''));

		const flagPageLink = query('.mergedtoprow a image + div:contains(Flag)').prev().attr('href')!;
		const flagPageUrl = new URL(flagPageLink, url).toString();
		const flageImagePath = await this.scrapeImage(flagPageUrl);

		const city: City = {
			name: cityName,
			country,
			area,
			population,
			flageImagePath
		};
		return city;
}

 protected async scrapeImage(url: string) {
        const response = await axios.get(url);
        const html = response.data;

        const doc = cheerio.load(html);

        const imageLink = doc('#file a').attr('href')!;
        const imageUrl = new URL(imageLink, url).toString();

        const imagePath = await this.downloadFile(imageUrl, 'flags');

        return imagePath;
    }

    protected async downloadFile(url: string, dir: string) {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        fs.mkdirSync(dir, { recursive: true });

        const filePath = path.join(dir, path.basename(url));
        fs.writeFileSync(filePath, response.data);

        return filePath;
    }
}

async function main() {
    const scraper = new CapitalCityScraper();
    const city = await scraper.scrapeCity("https://en.wikipedia.org/wiki/Prague");
    console.log(city);
}

main();