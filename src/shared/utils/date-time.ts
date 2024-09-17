// Other dependencies
import * as dayjs from 'dayjs';

type OPTIONS = 'fmonth' | 'lmonth';

export function getDateTime(time: Date | undefined, options: OPTIONS) {
  if (options === 'fmonth') {
    return dayjs(time).startOf('month').format('YYYY-MM-DD HH:mm:ss');
  }

  if (options === 'lmonth') {
    return dayjs(time).endOf('month').format('YYYY-MM-DD HH:mm:ss');
  }
}
export function convertDateTime(
  from_date: Date | undefined,
  to_date: Date | undefined,
) {
  let fromDate;
  if (from_date) {
    fromDate = dayjs(from_date);
  } else {
    fromDate = dayjs(0);
  }
  let toDate;
  if (to_date) {
    toDate = dayjs(to_date).add(1, 'd');
  } else {
    toDate = dayjs().add(1, 'd');
  }
  return {
    fromDate: fromDate.format('YYYY-MM-DD'),
    toDate: toDate.format('YYYY-MM-DD'),
  };
}
