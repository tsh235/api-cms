import { knex } from '../connect.js';
import {GOODS_DB, SERVER_ERROR_MESSAGE } from '../const.js';

export const getTotalPrice = async res => {
  try {
    const goodsData = await knex(GOODS_DB).column(['price', 'count']);
    const goodsTotalPrice = goodsData.reduce((acc, { price, count }) => acc + price * count, 0);
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify(goodsTotalPrice));
  } catch (err) {
    console.error(`Ошибка при получении сведений о товарах из базы данных: ${err.message}`);
    res.writeHead(500, {'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify({message: SERVER_ERROR_MESSAGE}));
  }
};
