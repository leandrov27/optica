// libs
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import utc from 'dayjs/plugin/utc';

// ----------------------------------------------------------------------

dayjs.extend(utc);

dayjs.locale('es-mx');

// ----------------------------------------------------------------------

export { dayjs };