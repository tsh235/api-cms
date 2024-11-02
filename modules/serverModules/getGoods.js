import { knex } from '../connect.js';
import { GOODS_DB, NOT_FOUND_DATA, ERROR_LOAD_GOODS, SERVER_ERROR_MESSAGE } from '../const.js';
import { pagination } from '../dataModules/pagination.js';

export const getGoods = async (res, query) => {
  try {
    const data = await knex(GOODS_DB);

    let goodsData = data;

    const page = +query.page || 1;
    const paginationCount = +query.count || 10;

    if (query.search) {
			const search = query.search.trim().toLowerCase();
      goodsData = data.filter(
				item => item.title.toLowerCase().includes(search) || item.category.toLowerCase().includes(search),
      );
    }

    if (goodsData.length) {
      const goods = pagination(goodsData, page, paginationCount);
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
      res.end(JSON.stringify(goods));
    } else if (!data.length && query.search) {
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
      res.end(JSON.stringify(ERROR_LOAD_GOODS));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json; charset=utf8'});
      res.end(JSON.stringify(NOT_FOUND_DATA));
    }
  } catch (err) {
    console.error(`Ошибка при получении товаров из базы данных: ${err.message}`);
    res.writeHead(500, {'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};
