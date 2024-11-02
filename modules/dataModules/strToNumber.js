export const strToNumber = data => {
	let discount = 0;
	if ('discount' in data) {
		discount = parseInt(data.discount) >= 0 && parseInt(data.discount) < 100 ? parseInt(data.discount) : 0;
	} else {
		discount = parseInt(data.discount_count) >= 0 && parseInt(data.discount_count) < 100 ? parseInt(data.discount_count) : 0;
	}

  const price = parseFloat(data.price) > 0 ? parseFloat(data.price) : 0;
  const count = parseInt(data.count) > 0 ? parseInt(data.count) : 0;

  return {
    discount,
    price,
    count,
  };
};
