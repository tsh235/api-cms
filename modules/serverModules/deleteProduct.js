import { knex } from '../connect.js';
import { unlink } from 'node:fs/promises';
import { GOODS_DB, NOT_FOUND_MESSAGE, SERVER_ERROR_MESSAGE } from '../const.js';

export const deleteProduct = async (res, id) => {
  if (id === '0') return;
  try {
    const [removedItem] = await knex(GOODS_DB).where({ id }).del(['id', 'image']);

    if (!removedItem?.id) {
      res.writeHead(404, {'Content-Type': 'application/json; charset=utf8'});
      res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
      return;
    }

    await unlink(removedItem.image);

    res.writeHead(204, {'Content-Type': 'application/json; charset=utf8'});
    res.end();
  } catch (err) {
    console.error(`Ошибка при удалении товара: ${err}`);
    res.writeHead(500, {'Content-Type': 'application/json; charset=utf8'});
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};
