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
    IndexName: 'lSector-reportDate-index',
    ProjectionExpression: 'reportDate, businessCode, targetPrice',
    KeyConditionExpression: 'lSector = :sector and reportDate >= :3M_date',
    ExpressionAttributeValues: {
      ':sector': sector,
      ':3M_date': getPastDate(91), // 3 months prior date
    },
    ScanIndexForward: false,
  };
};
