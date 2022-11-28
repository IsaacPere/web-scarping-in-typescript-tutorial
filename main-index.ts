import axios from 'axios';
import cheerio from 'cheerio';

export class capital_city_scarper {
	async scarp_city(website_url: string){
		const website_response = await axios.get(website_url);
		const website_html = website_response.data;
		const query_string = cheerio.load(website_html);
		const city_name = query_string("#firstHeading").text().trim();
		console.log(city_name);
	}
}

async function main_modules(){
	const website_scarpingg_modules = new capital_city_scarper();
	await website_scarpingg_modules.scarp_city("https://wikipedia.org/wiki/Kenya");	
}
main_modules();