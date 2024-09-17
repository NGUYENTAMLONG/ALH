export function paginateData(dataCount: any, page: any, limit: any) {
  dataCount = parseInt(dataCount);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;

  const totalPages = Math.ceil(dataCount / limit);
  // const currentPage = Math.max(1, Math.min(parseInt(page), totalPages));
  const currentPage = parseInt(page);
  const offset = (currentPage - 1) * limit;

  const pagination = {
    current_page: currentPage || 1,
    total_pages: totalPages,
    page_size: limit || 12,
    total_count: dataCount || 0,
    offset: offset || 0,
  };

  return pagination;
}
