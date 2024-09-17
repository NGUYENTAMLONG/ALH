import { Op } from 'sequelize';

type OPTIONS = 'likeOr' | 'equal';

export function arrayToCondition(data: any, options: OPTIONS): any {
  const condition = [];
  if (options === 'equal') {
    for (const element of data) {
      condition.push({ [Op.eq]: element });
    }
  }

  return { [Op.or]: condition };
}
