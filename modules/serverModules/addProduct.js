import { knex } from '../connect.js';
import { GOODS_DB, INVALID_FORMAT_MESSAGE, INVALID_REQUEST_MESSAGE, SERVER_ERROR_MESSAGE } from '../const.js';
import { getFormData } from '../dataModules/getFormData.js';
import { saveImage } from '../dataModules/saveImage.js';
import { strToNumber } from '../dataModules/strToNumber.js';

export const addProduct = async (req, res) => {
  const data = JSON.parse(await getFormData(req));
  const id = Math.random().toString().substring(2, 5) + Date.now().toString().substring(9) + data.id;

  const {discount, price, count} = strToNumber(data);

  if (!price || !count) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
    return;
  }

  const newProduct = {
		id,
    title: data.title,
    price,
    description: data.description,
    category: data.category,
    discount,
    count,
    units: data.units,
  };

	if (!data.image.startsWith('data:image')) {
		res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: INVALID_REQUEST_MESSAGE }));
		return;
	}

  const dataImage = data.image.match(/^data:image\/([a-z+]+);base64,/i);
	const format = dataImage ? dataImage[1] : null;

	if (!dataImage) {
		newProduct.image = data.image;
	} else {
		if (!['png', 'svg+xml', 'jpeg', 'webp'].includes(format)) {
			res.writeHead(400, { 'Content-Type': 'application/json' });
    	res.end(JSON.stringify({ message: INVALID_FORMAT_MESSAGE }));
			return;
		} else {
			try {
				newProduct.image = await saveImage(id, data.image, format);
			} catch (err) {
				console.error(`Ошибка при записи файла: ${err.message}`);
				res.writeHead(500, { 'Content-Type': 'application/json; charset=utf8' });
				res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
				return;
			}
		}
  }

  try {
    await knex(GOODS_DB).insert(newProduct);
    res.writeHead(201, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify(newProduct));
  } catch (err) {
    console.error(`Ошибка при добавлении товара: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf8' });
    res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }
};
