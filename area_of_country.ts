import axios from 'axios';
import cheerio from 'cheerio';

export class country_area{
	async world_country_area_scarp(app_url: string) {
		const website_response = await axios.get(app_url);
		const website_html = website_response.data;
		const web_query_string = cheerio.load(website_html);
		const area_rows = web_query_string('.mergedtoprow th:contains(Area)').parent().nextUntil('.mergedtoprow');
		const area = area_rows.find('th:contains(Capital city) + td').text().trim();
		console.log(area);
	}
}

async function country_area_sizes(){
	const scarping_country_size = new country_area();
	await scarping_country_size.world_country_area_scarp("https://wikipedia.org/wiki/Prague");
}
country_area_sizes();