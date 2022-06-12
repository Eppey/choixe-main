import { REPORT_DATA_TABLE } from './Constants';
import { getPastDate } from './Utils';

/**
 * Finds stocks that have at least 1 report written for the past 3 months
 * @param sector WICS lSector
 * @returns businessCode and targetPrice of stocks
 */
export const SCORE_QUERY = (sector: string) => {
  return {
    TableName: REPORT_DATA_TABLE,
    IndexName: 'lSector-date-index',
    ProjectionExpression: '#dt, businessCode, targetPrice',
    KeyConditionExpression: '#sector = :sector and #dt >= :date',
    ExpressionAttributeNames: {
      '#sector': 'lSector',
      '#dt': 'date',
    },
    ExpressionAttributeValues: {
      ':sector': sector,
      ':date': getPastDate(91),
    },
    ScanIndexForward: false,
  };
};
