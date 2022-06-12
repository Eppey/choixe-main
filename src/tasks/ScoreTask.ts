import axios from 'axios';
import AWS from 'aws-sdk';

import { AWS_REGION, TIMEOUT_LIMIT, WICS_L_SECTORS } from '../Constants';
import { SCORE_QUERY } from '../Queries';

AWS.config.update({ region: AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();
const ddb = new AWS.DynamoDB();
axios.defaults.timeout = TIMEOUT_LIMIT;

export interface ScoreQueryResults {
  businessCode: string;
  targetPrice: string;
}

export const getStockOverallData = async () => {
  const stockList = {};
  let reportList = [];

  for (const sector of WICS_L_SECTORS) {
    const result = await docClient.query(SCORE_QUERY(sector)).promise();
    reportList.push(...result.Items);
  }

  reportList.forEach((item: ScoreQueryResults) => {
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
