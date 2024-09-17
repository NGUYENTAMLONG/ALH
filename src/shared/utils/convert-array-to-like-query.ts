type OPTIONS = 'like' | 'equal';
export function arrayToQuery(column_name: any, data: any, options: OPTIONS) {
  if (typeof data === 'string') {
    const arr = JSON.parse(data);
    data = arr;
  }

  const query: any[] = [];
  if (options === 'like') {
    loopQueryCondition(column_name, data, query, options);
  }

  if (options === 'equal') {
    loopQueryCondition(column_name, data, query, options);
  }

  return query.join(' OR ');
}

function loopQueryCondition(
  column_name: string,
  data: any[],
  query: any[],
  options: OPTIONS,
) {
  data.forEach((element) => {
    const rawCondition = `${column_name} ${
      options === 'equal' ? '= ' : 'LIKE "%'
    }${element || ''}${options === 'equal' ? '' : '%"'}`;
    query.push(rawCondition);
  });
}
