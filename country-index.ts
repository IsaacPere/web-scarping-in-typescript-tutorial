import axios from 'axios';
import cheerio from 'cheerio';

export class capital_city_scarper {
	async scrap_city(website_url: string){
		const app_response = await axios.get(website_url);
		const app_html = app_response.data;
		const app_query_string = cheerio.load(app_html);
		const request_country = app_query_string('.mergedtoprow th:contains(Country) + td').text().trim();
		console.log(request_country);
	}
}

async function main_page_app(){
	const app_scrapping_file = new capital_city_scarper();
	await app_scrapping_file.scrap_city("https://wikipedia.org/wiki/Prague");
}

main_page_app();