import axios from 'axios';
import AWS from 'aws-sdk';

import { AWS_REGION, TIMEOUT_LIMIT, WICS_L_SECTORS } from '../Constants';
import { REPORTS_IN_SECTOR } from '../Queries';

AWS.config.update({ region: AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();
const ddb = new AWS.DynamoDB();
axios.defaults.timeout = TIMEOUT_LIMIT;

export interface ScoreQueryResult {
  reportDate: string;
  businessCode: string;
  targetPrice: string;
}

export interface StockList {
  [stockId: string]: { count: number; targetPrices: Array<number> };
}

/**
 * Return a list of stocks with at least 1 report generated in the past 3 months.
 */
export const getStocksForScoring = async (): Promise<StockList> => {
  let stockList: StockList = {};
  for (const sector of WICS_L_SECTORS) {
    const { Items: reports } = await docClient.query(REPORTS_IN_SECTOR(sector)).promise();
    reports.forEach((r: ScoreQueryResult) => {
      const price = parseInt(r.targetPrice);
      const id = r.businessCode;
      if (id in stockList === false) {
        stockList[id] = {
          count: 0,
          targetPrices: [],
        };
      }
      stockList[id].count++;
      if (price !== 0) {
        stockList[id].targetPrices.push(price);
      }
    });
  }
  return stockList;
};

export const updateScoreData = async (): Promise<void> => {};
getStocksForScoring().then();
