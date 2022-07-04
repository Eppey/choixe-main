import axios from 'axios';
import AWS from 'aws-sdk';

import { AWS_REGION, TIMEOUT_LIMIT, WICS_L_SECTORS } from '../Constants';
import { SCORE_QUERY } from '../Queries';

import { Report } from './ReportTask';

AWS.config.update({ region: AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();
const ddb = new AWS.DynamoDB();
axios.defaults.timeout = TIMEOUT_LIMIT;

export interface ScoreQueryResult {
  reportDate: string;
  businessCode: string;
  targetPrice: string;
}

export interface Stock {}

/**
 * Return a list of stocks with at least 1 report generated in the past 3 months.
 * @param fromDate start date, "YYYY-MM-DD"
 * @param toDate end date, "YYYY-MM-DD"
 */
export const getStocks = async (): Promise<Stock> => {
  let stockList: Stock[] = [];
  let reportList: Report[] = [];

  return {};
};

export const getStockOverallData = async () => {
  let stockList = [];
  let reportList: ScoreQueryResult[] = [];

  for (const sector of WICS_L_SECTORS) {
    const result = await docClient.query(SCORE_QUERY(sector)).promise();
    console.log(result);
    // reportList.push(...result.Items);
  }

  // console.log(reportList);

  reportList.forEach((item) => {
    const price = parseInt(item.targetPrice);
    const id = item.businessCode;

    if (!stockList[id]) {
      stockList[id] = { stockId: id, count: 1 };
      if (price !== 0) {
        stockList[id].price = [price];
        stockList[id].countPrice = 1;
      } else {
        stockList[id].price = [];
        stockList[id].countPrice = 0;
      }
    }
    stockList[id].count++;
    if (price !== 0) {
      stockList[id].price.push(price);
      stockList[id].countPrice++;
    }
  });
};

export const updateScoreData = async (): Promise<void> => {
  /*
   * retrieve the list of stockIds with
   */
  const stocks = await getStocks();
};
getStockOverallData().then();
