import {createServer} from 'node:http';
import {URLSearchParams} from 'node:url';
import {getGoods} from './serverModules/getGoods.js';
import {getProductById} from './serverModules/getProductById.js';
import {CATEGORIES_URL, GOODS_URL, TOTAL_URL} from './const.js';
import {getTotalPrice} from './serverModules/getTotalPrice.js';
import {getCategories} from './serverModules/getCategories.js';
import {getCategoryGoods} from './serverModules/getCategoryGoods.js';
import {addProduct} from './serverModules/addProduct.js';
import {getImage} from './serverModules/getImage.js';
import {deleteProduct} from './serverModules/deleteProduct.js';
import {updateProduct} from './serverModules/updateProduct.js';

export const startServer = () =>
	createServer(async (req, res) => {
    const url = req.url;
		const query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1]));

		res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=utf8');

		if (req.method === 'OPTIONS') {
      res.end();
      return;
    }

    if (req.url.substring(1, 6) === 'image') {
      getImage(req, res);
      return;
    }

		if (req.method === 'GET' && url === GOODS_URL) {
			getGoods(res, query);
		}

		if (req.method === 'GET' && url.startsWith(GOODS_URL)) {
			const productId = url.split('/').pop();
			productId.startsWith('?') || productId === 'goods' ? getGoods(res, query) : getProductById(res, productId);
		}

		if (req.method === 'GET' && url.startsWith(CATEGORIES_URL)) {
			const category = url.split('/').pop();
			if (category && category !== 'categories') {
				getCategoryGoods(url, res, query);
			} else {
				getCategories(res);
			}
		}

		if (req.method === 'GET' && url === TOTAL_URL) {
			getTotalPrice(res);
		}

		if (req.method === 'POST' && url === GOODS_URL) {
			await addProduct(req, res);
			return;
		}

		if (url.startsWith(GOODS_URL) && req.method === 'PATCH') {
		  const productId = url.split('/').pop();
			await updateProduct(req, res, productId);
		  return;
		}

		if (url.startsWith(GOODS_URL) && req.method === 'DELETE') {
		  const productId = url.split('/').pop();
		  await deleteProduct(res, productId);
		  return;
		}
	});
