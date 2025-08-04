export const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const getCurrentYear = () => new Date().getFullYear();

export const getYearOptions = (startYear: number = getCurrentYear() - 50) => {
  const currentYear = getCurrentYear();
  const years = [];
  for (let year = currentYear + 5; year >= startYear; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};