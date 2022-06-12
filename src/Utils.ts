/**
 * Returns past date
 * @param days days
 * @return past date (yyyy-MM-dd)
 */
export const getPastDate = (days: number) => {
  let today = new Date();
  today.setDate(today.getDate() - days);
  return today.toISOString().slice(0, 10);
};
