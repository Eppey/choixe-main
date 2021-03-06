/** The region of AWS */
export const AWS_REGION = 'ap-northeast-2';

/** The default request timeout limit */
export const TIMEOUT_LIMIT = 1500;

/** The size of batch */
export const BATCH_SIZE = 25;

/** The name of the table that report data is stored */
export const REPORT_DATA_TABLE = 'Report';

/** The name of the table that stock score data is stored */
export const STOCK_SCORE_DATA_TABLE = 'StockScore';

/**
 * The url for scraping report data
 * @param fromDate starting date
 * @param toDate ending date
 * @returns url
 */
export const REPORT_REQUEST_URL = (fromDate: string, toDate: string) => {
  return `https://markets.hankyung.com/api/v1/consensus/search/report?reportType=CO&fromDate=${fromDate}&toDate=${toDate}&page=`;
};

/**
 * The url for scraping sector
 * @param stockId stock id
 * @returns sector
 */
export const SECTOR_REQUEST_URL = (stockId: string) => {
  return `https://finance.daum.net/api/quotes/A${stockId}?summary=false&changeStatistics=true`;
};

/**
 * The request option for scraping sector
 * @param stockId stock id
 * @returns request option
 */
export const SECTOR_REQUEST_OPTION = (stockId: string) => {
  return {
    headers: {
      referer: `https://finance.daum.net/quotes/A${stockId}`,
      'user-agent': 'Mozilla/5.0',
    },
  };
};

/**
 * Naver API Url for scoring
 * @param stockIds list of stock ids
 * @returns request option
 */
export const NAVER_API_URL = (stockIds: string) => {
  return `https://polling.finance.naver.com/api/realtime?query=SERVICE_ITEM:${stockIds}`;
};

/**
 * Naver API Url for scoring
 * @param stockId stock businessCode
 * @param count number of data retrieved
 * @param option data request option
 */

export const NAVER_STOCK_CHART = (stockId: string, count: number, option: string) => {
  return `https://fchart.stock.naver.com/sise.nhn?requestType=0&symbol=${stockId}&count=${count}&timeframe=${option}`;
};

/**
 * List of WICS main categories
 */
export const WICS_L_SECTORS = [
  'IT',
  '필수소비재',
  '커뮤니케이션서비스',
  '유틸리티',
  '에너지',
  '소재',
  '산업재',
  '금융',
  '경기관련소비재',
  '건강관리',
];

/**
 * Dictionary of WICS subcategories
 */
export const WICS_DICT = {
  전기제품: ['전자와전기제품', 'IT'],
  전자제품: ['전자와전기제품', 'IT'],
  소프트웨어: ['소프트웨어와서비스', 'IT'],
  IT서비스: ['소프트웨어와서비스', 'IT'],
  반도체와반도체장비: ['반도체와반도체장비', 'IT'],
  디스플레이장비및부품: ['디스플레이', 'IT'],
  디스플레이패널: ['디스플레이', 'IT'],
  사무용전자제품: ['기술하드웨어와장비', 'IT'],
  전자장비와기기: ['기술하드웨어와장비', 'IT'],
  컴퓨터와주변기기: ['기술하드웨어와장비', 'IT'],
  통신장비: ['기술하드웨어와장비', 'IT'],
  핸드셋: ['기술하드웨어와장비', 'IT'],
  식품과기본식료품소매: ['식품과기본식료품소매', '필수소비재'],
  담배: ['식품,음료,담배', '필수소비재'],
  식품: ['식품,음료,담배', '필수소비재'],
  음료: ['식품,음료,담배', '필수소비재'],
  가정용품: ['가정용품과개인용품', '필수소비재'],
  다각화된통신서비스: ['전기통신서비스', '커뮤니케이션서비스'],
  무선통신서비스: ['전기통신서비스', '커뮤니케이션서비스'],
  게임엔터테인먼트: ['미디어와엔터테인먼트', '커뮤니케이션서비스'],
  광고: ['미디어와엔터테인먼트', '커뮤니케이션서비스'],
  방송과엔터테인먼트: ['미디어와엔터테인먼트', '커뮤니케이션서비스'],
  양방향미디어와서비스: ['미디어와엔터테인먼트', '커뮤니케이션서비스'],
  출판: ['미디어와엔터테인먼트', '커뮤니케이션서비스'],
  가스유틸리티: ['유틸리티', '유틸리티'],
  복합유틸리티: ['유틸리티', '유틸리티'],
  전기유틸리티: ['유틸리티', '유틸리티'],
  수도유틸리티: ['유틸리티', '유틸리티'],
  독립전력생산및에너지거래: ['유틸리티', '유틸리티'],
  석유와가스: ['에너지', '에너지'],
  에너지장비및서비스: ['에너지', '에너지'],
  비철금속: ['소재', '소재'],
  종이와목재: ['소재', '소재'],
  철강: ['소재', '소재'],
  포장재: ['소재', '소재'],
  화학: ['소재', '소재'],
  가구: ['자본재', '산업재'],
  건설: ['자본재', '산업재'],
  건축자재: ['자본재', '산업재'],
  건축제품: ['자본재', '산업재'],
  기계: ['자본재', '산업재'],
  무역회사와판매업체: ['자본재', '산업재'],
  복합기업: ['자본재', '산업재'],
  우주항공과국방: ['자본재', '산업재'],
  전기장비: ['자본재', '산업재'],
  조선: ['자본재', '산업재'],
  도로와철도운송: ['운송', '산업재'],
  운송인프라: ['운송', '산업재'],
  항공사: ['운송', '산업재'],
  항공화물운송과물류: ['운송', '산업재'],
  해운사: ['운송', '산업재'],
  상업서비스와공급품: ['상업서비스와공급품', '산업재'],
  증권: ['증권', '금융'],
  은행: ['은행', '금융'],
  부동산: ['부동산', '금융'],
  생명보험: ['보험', '금융'],
  손해보험: ['보험', '금융'],
  기타금융: ['다각화된금융', '금융'],
  창업투자: ['다각화된금융', '금융'],
  카드: ['다각화된금융', '금융'],
  '호텔,레스토랑,레저': ['호텔,레스토랑,레저등', '경기관련소비재'],
  다각화된소비자서비스: ['호텔,레스토랑,레저등', '경기관련소비재'],
  자동차: ['자동차와부품', '경기관련소비재'],
  자동차부품: ['자동차와부품', '경기관련소비재'],
  교육서비스: ['소매(유통)', '경기관련소비재'],
  백화점과일반상점: ['소매(유통)', '경기관련소비재'],
  인터넷과카탈로그소매: ['소매(유통)', '경기관련소비재'],
  전문소매: ['소매(유통)', '경기관련소비재'],
  판매업체: ['소매(유통)', '경기관련소비재'],
  가정용기기와용품: ['내구소비재와의류', '경기관련소비재'],
  레저용장비와제품: ['내구소비재와의류', '경기관련소비재'],
  문구류: ['내구소비재와의류', '경기관련소비재'],
  '섬유,의류,신발,호화품': ['내구소비재와의류', '경기관련소비재'],
  화장품: ['내구소비재와의류', '경기관련소비재'],
  생명과학도구및서비스: ['제약과생물공학', '건강관리'],
  생물공학: ['제약과생물공학', '건강관리'],
  제약: ['제약과생물공학', '건강관리'],
  건강관리기술: ['건강관리장비와서비스', '건강관리'],
  건강관리업체및서비스: ['건강관리장비와서비스', '건강관리'],
  건강관리장비와용품: ['건강관리장비와서비스', '건강관리'],
};
