export const pagination = (data, page, count) => {
  const end = count * page;
  const start = page === 1 ? 0 : end - count;
  const totalCount = data.length;

  const pages = Math.ceil(data.length / count);

  return {
    goods: data.slice(start, end),
    page,
    pages,
    totalCount,
  };
};
