import {knex} from '../connect.js';
import {GOODS_DB, SERVER_ERROR_MESSAGE} from '../const.js';

export const getProductById = async (res, id) => {
	if (!id || id === '0') return;

	try {
		const product = await knex(GOODS_DB).where({id}).first();

		if (product) {
			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
      res.end(JSON.stringify(product));
		} else {
			res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
		}
	} catch (err) {
		console.error(`Ошибка при получении данных о товаре: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify({message: SERVER_ERROR_MESSAGE}));
	}
}
