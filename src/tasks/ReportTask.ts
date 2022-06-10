import axios from 'axios';
import { REPORT_REQUEST_URL, SECTOR_REQUEST_OPTION, SECTOR_REQUEST_URL, WICS_DICT } from '../Constants';

/**
 * Default report object
 */
export interface Report {
  reportIdx: number; // 리포트 번호
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
 * @param fromDate start date
 * @param toDate end date
 * @returns report data
 */
export const getReport = async (fromDate: string, toDate: string): Promise<Report[]> => {
  const reportData: Report[] = [];

  try {
    const reports = await axios.get(REPORT_REQUEST_URL(fromDate, toDate));

    for (const r of reports.data.data) {
      const sector = await getSector(r.BUSINESS_CODE);
      if (sector) {
        reportData.push({
          reportIdx: r.REPORT_IDX,
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
  console.log(`[ReportTask]: Fetched ${reportData.length} reports (${fromDate}~${toDate})`);
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
