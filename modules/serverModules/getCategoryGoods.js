import { knex } from '../connect.js';
import { GOODS_DB, NOT_FOUND_MESSAGE, SERVER_ERROR_MESSAGE } from '../const.js';
import { pagination } from '../dataModules/pagination.js';

export const getCategoryGoods = async (url, res, query) => {
  const category = decodeURIComponent(url.split('/').pop());
  try {
    const goodsCategory = await knex(GOODS_DB).where({ category });
    const page = +query.page || 1;
    const paginationCount = 10;
    if (goodsCategory.length) {
      const goodsData = pagination(goodsCategory, page, paginationCount);
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
      res.end(JSON.stringify(goodsData));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json; charset=utf8'});
      res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
    }
  } catch (err) {
    console.error(`Ошибка при получении товаров по категории ${category}: ${err.message}`);
    res.writeHead(500, {'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};
