import { parseISO, format } from 'date-fns';

export default function Date({ dateString, ...props }) {
  const date = parseISO(dateString);
  return <time dateTime={dateString} { ...props }>{format(date, 'LLLL d, yyyy')}</time>;
}
