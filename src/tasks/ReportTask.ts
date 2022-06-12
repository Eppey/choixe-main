import axios from 'axios';
import AWS from 'aws-sdk';

import {
  AWS_REGION,
  BATCH_SIZE,
  REPORT_REQUEST_URL,
  SECTOR_REQUEST_OPTION,
  SECTOR_REQUEST_URL,
  WICS_DICT,
} from '../Constants';

AWS.config.update({ region: AWS_REGION });
const ddb = new AWS.DynamoDB();

/**
 * Default report object
 */
export interface Report {
  reportIdx: string; // 리포트 번호
  officeName: string; // 증권사
  businessCode: string; // 종목 번호
  businessName: string; // 종목 이름
  reportTitle: string; // 리포트 이름
  reportWriter: string; // 리포트 작성자
  filePath: string; // 리포트 url
  reportDate: string; // 작성일
  gradeValue: string; // 투자 의견
  targetPrice: string; // 목표가
  oldTargetPrice: string; // 이전 목표가
  lSector: string; // WICS 대분류
  mSector: string; // WICS 중분류
  sSector: string; // WICS 소분류
}

/**
 * Default sector object
 */
export interface Sector {
  lSector: string; // WICS 대분류
  mSector: string; // WICS 중분류
  sSector: string; // WICS 소분류
}

/**
 * Fetch report data
 * @param fromDate start date (yyyy-MM-dd)
 * @param toDate end date (yyyy-MM-dd)
 * @returns report data
 */
export const getReports = async (fromDate: string, toDate: string): Promise<Report[]> => {
  const reportData: Report[] = [];

  try {
    const reports = await axios.get(REPORT_REQUEST_URL(fromDate, toDate));

    for (const r of reports.data.data) {
      const sector = await getSector(r.BUSINESS_CODE);
      if (sector) {
        reportData.push({
          reportIdx: r.REPORT_IDX.toString(),
          officeName: r.OFFICE_NAME,
          businessCode: r.BUSINESS_CODE,
          businessName: r.BUSINESS_NAME,
          reportTitle: r.REPORT_TITLE,
          reportWriter: r.REPORT_WRITER,
          filePath: r.REPORT_FILEPATH,
          reportDate: r.REPORT_DATE,
          gradeValue: r.GRADE_VALUE,
          targetPrice: r.TARGET_STOCK_PRICES,
          oldTargetPrice: r.OLD_TARGET_STOCK_PRICES,
          lSector: sector.lSector,
          mSector: sector.mSector,
          sSector: sector.sSector,
        });
      }
    }
  } catch (e) {
    console.log(`[ReportTask]: Error => ${e.message}`);
  }
  console.log(`[ReportTask]: Fetched ${reportData.length} reports (${fromDate} ~ ${toDate})`);
  return reportData;
};

/**
 * Fetch sector data
 * @param stockId stock id
 * @returns sectors
 */
export const getSector = async (stockId: string): Promise<Sector | null> => {
  try {
    const wics = await axios.get(SECTOR_REQUEST_URL(stockId), SECTOR_REQUEST_OPTION(stockId));
    const sSector = wics.data.wicsSectorName.replace(/ /g, '');
    return {
      lSector: WICS_DICT[sSector][1],
      mSector: WICS_DICT[sSector][0],
      sSector: sSector,
    };
  } catch (e) {
    console.log(`[ReportTask]: Failed fetching sector for stockId: ${stockId}`);
    return null;
  }
};

/**
 * Adds new report data to the database in batch
 * @param fromDate start date, "YYYY-MM-DD"
 * @param toDate end date, "YYYY-MM-DD"
 */
export const updateReportData = async (fromDate: string, toDate: string, tableName?: string): Promise<void> => {
  const reports = await getReports(fromDate, toDate);
  const reportChunks = reports.reduce((result, item, idx) => {
    const chunkIdx = Math.floor(idx / BATCH_SIZE);
    if (!result[chunkIdx]) {
      result[chunkIdx] = [];
    }
    result[chunkIdx].push(item);
    return result;
  }, []);
  console.log(`[ReportTask]: Created ${reportChunks.length} chunks`);

  for (const chunk of reportChunks) {
    const changeRequests = chunk.map((r: Report) => {
      return {
        PutRequest: {
          Item: {
            reportIdx: { S: r.reportIdx },
            officeName: { S: r.officeName },
            businessCode: { S: r.businessCode },
            businessName: { S: r.businessName },
            reportTitle: { S: r.reportTitle },
            reportWriter: { S: r.reportWriter },
            filePath: { S: r.filePath },
            reportDate: { S: r.reportDate },
            gradeValue: { S: r.gradeValue },
            targetPrice: { S: r.targetPrice },
            oldTargetPrice: { S: r.oldTargetPrice },
            lSector: { S: r.lSector },
            mSector: { S: r.mSector },
            sSector: { S: r.sSector },
          },
        },
      };
    });
    const params = tableName
      ? {
          RequestItems: {
            [tableName]: changeRequests,
          },
        }
      : {
          RequestItems: {
            reportTestTable: changeRequests,
          },
        };
    ddb.batchWriteItem(params, (e) => {
      if (e) {
        console.log(`[ReportTask]: Error in updateReportData => ${e.message}`);
      }
      console.log(`[ReportTask]: Finished writing ${reports.length} items!`);
    });
  }
};

// example function execution for testing
// updateReportData('reportList', '2022-05-01', '2022-05-02').then();
