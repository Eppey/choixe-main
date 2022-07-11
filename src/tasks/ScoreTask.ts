import AWS from 'aws-sdk';
import axios, {AxiosResponse} from 'axios';
import cheerio from 'cheerio';

import {
  AWS_REGION,
  NAVER_API_URL,
  NAVER_STOCK_CHART,
  STOCK_SCORE_DATA_TABLE,
  TIMEOUT_LIMIT,
  WICS_L_SECTORS
} from '../Constants';
import {REPORTS_IN_SECTOR} from '../Queries';

AWS.config.update({region : AWS_REGION});
const docClient = new AWS.DynamoDB.DocumentClient();
axios.defaults.timeout = TIMEOUT_LIMIT;

export interface ScoreQueryResult {
  reportDate: string;
  businessCode: string;
  targetPrice: string;
}

export interface StockList {
  [stockId: string]: {count: number; targetPrices : number[]};
}

export interface NaverStockData {
  count?: number;
  targetPrices?: number[];
  cd: string;
  nm: string;
  sv: number;
  nv: number;
  cv: number;
  cr: number;
  rf: string;
  mt: string;
  ms: string;
  tyn: string;
  pcv: number;
  ov: number;
  hv: number;
  lv: number;
  ul: number;
  ll: number;
  aq: number;
  aa: number;
  nav: null;
  keps: number;
  eps: number;
  bps: number;
  cnsEps: null;
  dv: number;
}

/**
 * Return a list of stocks with at least 1 report generated in the past 3
 * months.
 */
const getStocksForScoring = async(): Promise<StockList> => {
  let stockList: StockList = {};
  for (const sector of WICS_L_SECTORS) {
    const {Items : reports} =
        await docClient.query(REPORTS_IN_SECTOR(sector)).promise();
    reports.forEach((r: ScoreQueryResult) => {
      const price = parseInt(r.targetPrice);
      const id = r.businessCode;
      if (id in stockList === false) {
        stockList[id] = {
          count : 0,
          targetPrices : [],
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

/**
 * Returns popularity score (max 100)
 * - volume: 거래량 (증가할수록 점수 ↑)
 * - momentum: 모멘텀 수치 (높을수록 점수 ↑)
 * - TODO: communityScore: 커뮤니티 활성도 (증가할수록 점수 ↑)
 * @param stockObj stock object
 */
const calPopularityScore = (stock: NaverStockData): string|number => {
  let res: AxiosResponse;
  try {
    res = await axios.get(NAVER_STOCK_CHART(stock.cd, 20, 'day'));
  } catch (e) {
    console.log(`[calPopularityScore]: Error => ${e.message}`);
  }

  const $ = cheerio.load(res.data, {xmlMode : true});
  let vData = [], pData = [];
  $('item').each(function() {
    const tmp = $(this).attr('data').split('|');
    vData.push(parseInt(tmp[5]));
    pData.push(parseInt(tmp[4]));
  });
  if (vData.length < 20) {
    return '-';
  }

  const volumneInc =
      (vData[15] + vData[16] + vData[17] + vData[18] + vData[19]) /
          (vData[10] + vData[11] + vData[12] + vData[13] + vData[14]) -
      1;
  const momentumByDays = {
    day5 : pData[0] / pData[4] > 1 ? 'Up' : 'Down',
    day10 : pData[0] / pData[9] > 1 ? 'Up' : 'Down',
    day20 : pData[0] / pData[19] > 1 ? 'Up' : 'Down',
  };

  let volume = 0;
  if (volumneInc < 0) {
    volume = 0;
  } else if (volumneInc > 2) {
    volume = 100;
  } else {
    volume = (volumneInc / 0.25) * 12.5;
  }

  let momentum = 0;
  if (momentumByDays.day5 === 'Up') {
    if (momentumByDays.day10 === 'Up') {
      if (momentumByDays.day20 === 'Up') {
        momentum = 100;
      } else {
        momentum = 80;
      }
    } else {
      if (momentumByDays.day20 === 'Up') {
        momentum = 60;
      } else {
        momentum = 60;
      }
    }
  } else {
    if (momentumByDays.day10 === 'Up') {
      if (momentumByDays.day20 === 'Up') {
        momentum = 20;
      } else {
        momentum = 40;
      }
    } else {
      if (momentumByDays.day20 === 'Up') {
        momentum = 20;
      } else {
        momentum = 0;
      }
    }
  }

  let report = 0;
  stock.count > 10 ? (report = 100) : (report = stock.count * 12.5);
  return (volume + momentum + report) / 3;
}

const calStockScore(stock: NaverStockData): string {
  let popScore = calPopularityScore(stock);
  let finScore = calFinScore(stock);
  let credScore = calCredScore(stock);

  if (popScore === '-' || finScore === '-')
    return '-';

  return Math.round((credScore + popScore + finScore) / 3);
}

export const updateScoreData = async(): Promise<void> => {
  const stockList = await getStocksForScoring();
  const query = Object.keys(stockList).join(',');
  try {
    const stockData: NaverStockData[] =
        (await axios.get(NAVER_API_URL(query))).data.result.areas[0].datas;
    for (let stock of stockData) {
      stock = {...stockList[stock.cd], ...stock};
      const params = {
        TableName : STOCK_SCORE_DATA_TABLE,
        Key : {
          stockId : stock.cd,
        },
        UpdateExpression : 'set #score = :score, #dt = :date',
        ExpressionAttributeNames : {
          '#dt' : 'date',
          '#score' : 'score',
        },
        ExpressionAttributeValues : {
          ':score' : calStockScore(stock),
          ':date' : new Date().toISOString().slice(0, 10),
        },
      };

      docClient.update(params, (e) => {
        if (e) {
          console.log('[scoreTask]: Error ', e);
        }
      });
    }
  } catch (e) {
  }
};
updateScoreData().then();
