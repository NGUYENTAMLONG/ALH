// Other dependencies

export function isArray(data: any) {
  if (typeof data === 'string') {
    const arr = JSON.parse(data);
    data = arr;
  }
  return Array.isArray(data) && data.length > 0 ? true : false;
}
