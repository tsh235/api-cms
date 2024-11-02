import { knex } from '../connect.js';
import { unlink } from 'fs/promises';
import { GOODS_DB, INVALID_REQUEST_MESSAGE, NOT_FOUND_MESSAGE, SERVER_ERROR_MESSAGE } from '../const.js';
import { getFormData } from '../dataModules/getFormData.js';
import { saveImage } from '../dataModules/saveImage.js';
import {strToNumber} from '../dataModules/strToNumber.js';

export const updateProduct = async (req, res, id) => {
  const data = JSON.parse(await getFormData(req));

  const updatedProduct = {};

  const { discount, price, count } = strToNumber(data);

  if (!price || !count) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
    return;
  }

  const [product] = await knex(GOODS_DB).where({id});

  if (!product) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
    return;
  }

	// Записываем в новый объект данные из формы
  updatedProduct.title = data.title;
  updatedProduct.price = price;
  updatedProduct.description = data.description;
  updatedProduct.category = data.category;
  updatedProduct.discount = discount;
  updatedProduct.count = count;
  updatedProduct.units = data.units;

  // Сравниваем новый объект со старым и удаляем значения, которые совпадают
  for (const key in product) {
		if (product[key] === data[key]) {
			delete updatedProduct[key];
    }
  }

	// Обрабатываем картинку, если она есть
  if (data.image) {
    const format = data.image.match(/^data:image\/([a-z+]+);base64,/i)[1];
    if (!['png', 'svg+xml', 'jpeg'].includes(format)) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
      res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
      return;
    } else {
      try {
        updatedProduct.image = await saveImage(id, data.image, format);
      } catch (err) {
        console.error(`Ошибка при записи файла: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
        return;
      }
    }
  }

  // Удаляем старую картинку, если новая в другом формате
  if (updatedProduct.image && product.image !== updatedProduct.image) {
    await unlink(product.image);
  }

	// Обновляем товар в базе данных
  try {
    await knex(GOODS_DB).where({ id }).update(updatedProduct);
    res.writeHead(204, { 'Content-Type': 'application/json; charset=utf8' });
    res.end();
  } catch (err) {
    console.error(`Ошибка при обновлении товара: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};
