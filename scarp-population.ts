import axios from 'axios';
import cheerio from 'cheerio';

export class country_population {
	async country_and_city(application_url: string){
		const citizens_population = await axios.get(application_url);
		const country_population = citizens_population.data;
		const citizens_population_2 = cheerio.load(country_population);
		const populationRows = citizens_population_2('.mergedtoprow th:contains(Population)').parent().nextUntil('mergedtoprow');
		const population = populationRows.find('th:contains(Capital city) + td').text().trim();
		console.log(population);
	}
}

async function the_citizens_populations(){
	const scarp_modules = new country_population();
	await scarp_modules.country_and_city("https://wikipedia.org/wiki/Prague");
}
the_citizens_populations();