type OptionCreateArryObjectByKey = 'object' | 'value' | 'object_value';

export const createArrayObjectByKey = (
  data: any,
  key: string,
  recruitment_requirement_id: number,
  option: OptionCreateArryObjectByKey,
) => {
  let arr: any[] = [];

  if (option === 'object') {
    for (const item of data) {
      arr.push({
        [key]: item,
        recruitment_requirement_id,
      });
    }
  }

  if (option === 'object_value') {
    for (const item of data) {
      arr.push(item[key]);
    }
  }

  if (option === 'value') {
    arr = data;
  }

  return arr;
};
