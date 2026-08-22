/**
 * English→Korean translation for soccer country/league names shown in the
 * scoreboard (sidebar groups, league headers). Two layers:
 *  1. An exact dictionary for countries (near-total coverage — there are only
 *     ~200 countries) and for well-known/branded league names.
 *  2. A generic term-substitution pass for the long tail of regional/youth/
 *     women's/reserve league name variants, so leagues outside the exact
 *     dictionary still come out mostly Korean instead of falling back to the
 *     raw English string untouched.
 * A name that still doesn't fully translate keeps its original (English)
 * fragments rather than guessing — safer than inventing a wrong name.
 */

const COUNTRY_NAME_KO: Record<string, string> = {
  Albania: "알바니아",
  Algeria: "알제리",
  Andorra: "안도라",
  Angola: "앙골라",
  Argentina: "아르헨티나",
  Armenia: "아르메니아",
  Australia: "호주",
  Austria: "오스트리아",
  Azerbaijan: "아제르바이잔",
  Bahrain: "바레인",
  Bangladesh: "방글라데시",
  Belarus: "벨라루스",
  Belgium: "벨기에",
  Bhutan: "부탄",
  Bolivia: "볼리비아",
  Bosnia: "보스니아",
  Botswana: "보츠와나",
  Brazil: "브라질",
  Bulgaria: "불가리아",
  Burundi: "부룬디",
  Cambodia: "캄보디아",
  Cameroon: "카메룬",
  Canada: "캐나다",
  Chile: "칠레",
  China: "중국",
  Colombia: "콜롬비아",
  "Costa-Rica": "코스타리카",
  Croatia: "크로아티아",
  Cuba: "쿠바",
  Cyprus: "키프로스",
  "Czech-Republic": "체코",
  Denmark: "덴마크",
  "Dominican-Republic": "도미니카공화국",
  Ecuador: "에콰도르",
  Egypt: "이집트",
  "El-Salvador": "엘살바도르",
  England: "잉글랜드",
  Estonia: "에스토니아",
  Ethiopia: "에티오피아",
  "Faroe-Islands": "페로제도",
  Fiji: "피지",
  Finland: "핀란드",
  France: "프랑스",
  Georgia: "조지아",
  Germany: "독일",
  Ghana: "가나",
  Gibraltar: "지브롤터",
  Greece: "그리스",
  Guatemala: "과테말라",
  Guyana: "가이아나",
  Haiti: "아이티",
  Honduras: "온두라스",
  "Hong-Kong": "홍콩",
  Hungary: "헝가리",
  Iceland: "아이슬란드",
  India: "인도",
  Indonesia: "인도네시아",
  Iran: "이란",
  Iraq: "이라크",
  Ireland: "아일랜드",
  Israel: "이스라엘",
  Italy: "이탈리아",
  "Ivory-Coast": "코트디부아르",
  Jamaica: "자메이카",
  Japan: "일본",
  Jordan: "요르단",
  Kazakhstan: "카자흐스탄",
  Kenya: "케냐",
  Kosovo: "코소보",
  Kuwait: "쿠웨이트",
  Laos: "라오스",
  Latvia: "라트비아",
  Lebanon: "레바논",
  Lesotho: "레소토",
  Liechtenstein: "리히텐슈타인",
  Lithuania: "리투아니아",
  Luxembourg: "룩셈부르크",
  Macedonia: "북마케도니아",
  Malawi: "말라위",
  Malaysia: "말레이시아",
  Malta: "몰타",
  Mexico: "멕시코",
  Moldova: "몰도바",
  Mongolia: "몽골",
  Monaco: "모나코",
  Montenegro: "몬테네그로",
  Morocco: "모로코",
  Mozambique: "모잠비크",
  Myanmar: "미얀마",
  Namibia: "나미비아",
  Nepal: "네팔",
  Netherlands: "네덜란드",
  "New-Zealand": "뉴질랜드",
  Nicaragua: "니카라과",
  Nigeria: "나이지리아",
  "North-Korea": "북한",
  "North-Macedonia": "북마케도니아",
  "Northern-Ireland": "북아일랜드",
  Norway: "노르웨이",
  Oman: "오만",
  Pakistan: "파키스탄",
  Panama: "파나마",
  "Papua-New-Guinea": "파푸아뉴기니",
  Paraguay: "파라과이",
  Peru: "페루",
  Philippines: "필리핀",
  Poland: "폴란드",
  Portugal: "포르투갈",
  "Puerto-Rico": "푸에르토리코",
  Qatar: "카타르",
  Romania: "루마니아",
  Russia: "러시아",
  Rwanda: "르완다",
  "San-Marino": "산마리노",
  "Saudi-Arabia": "사우디아라비아",
  Scotland: "스코틀랜드",
  Senegal: "세네갈",
  Serbia: "세르비아",
  Singapore: "싱가포르",
  Slovakia: "슬로바키아",
  Slovenia: "슬로베니아",
  "South-Africa": "남아프리카공화국",
  "South-Korea": "대한민국",
  Spain: "스페인",
  "Sri-Lanka": "스리랑카",
  Suriname: "수리남",
  Sweden: "스웨덴",
  Switzerland: "스위스",
  Syria: "시리아",
  Taiwan: "대만",
  Tanzania: "탄자니아",
  Thailand: "태국",
  "Trinidad-and-Tobago": "트리니다드토바고",
  Tunisia: "튀니지",
  Turkey: "튀르키예",
  Turkmenistan: "투르크메니스탄",
  Uganda: "우간다",
  Ukraine: "우크라이나",
  "United-Arab-Emirates": "아랍에미리트",
  Uruguay: "우루과이",
  USA: "미국",
  Uzbekistan: "우즈베키스탄",
  Venezuela: "베네수엘라",
  Vietnam: "베트남",
  Wales: "웨일스",
  World: "국제",
  Yemen: "예멘",
  Zambia: "잠비아",
  Zimbabwe: "짐바브웨",
};

/** country|leagueName -> Korean name, for the rare case a bare league name needs a
 * different translation depending on the country (e.g. France's "Ligue 1" has the
 * specific nickname "리그앙", while other countries literally named "Ligue 1" don't). */
const LEAGUE_NAME_KO_BY_COUNTRY: Record<string, string> = {
  "France|Ligue 1": "리그앙",
};

/** Country-agnostic exact league-name translations for well-known/branded competitions. */
const LEAGUE_NAME_KO: Record<string, string> = {
  "Premier League": "프리미어리그",
  Championship: "챔피언십",
  "League One": "리그원",
  "League Two": "리그투",
  "National League": "내셔널리그",
  "La Liga": "라리가",
  "Segunda División": "세군다 디비시온",
  "Segunda Division": "세군다 디비시온",
  Bundesliga: "분데스리가",
  "Frauen Bundesliga": "여자 분데스리가",
  "U19 Bundesliga": "U19 분데스리가",
  "DFB Pokal": "DFB포칼",
  "Super Cup": "슈퍼컵",
  "Ligue 2": "리그 2",
  "Serie A": "세리에 A",
  "Serie B": "세리에 B",
  "Serie C": "세리에 C",
  "Serie D": "세리에 D",
  "Coppa Italia Primavera": "코파 이탈리아 프리마베라",
  "Eredivisie": "에레디비시",
  "Eredivisie Women": "여자 에레디비시",
  "Eerste Divisie": "에이르스터 디비시",
  "Tweede Divisie": "트베이더 디비시",
  "Derde Divisie": "데르더 디비시",
  "Primeira Liga": "프리메이라 리가",
  "Segunda Liga": "세군다 리가",
  "Liga 3": "리가 3",
  "Süper Lig": "쉬페르리그",
  "1. Lig": "1. 리그",
  Ekstraklasa: "엑스트라클라사",
  "I Liga": "1부리그",
  "II Liga - East": "2부리그 - 동부",
  HNL: "HNL",
  "First NL": "1부 내셔널리그",
  "Second NL": "2부 내셔널리그",
  "Erovnuli Liga": "에로브누리 리가",
  "Erovnuli Liga 2": "에로브누리 리가 2",
  Allsvenskan: "알스벤스칸",
  Damallsvenskan: "다말스벤스칸",
  Superettan: "수페레탄",
  Eliteserien: "엘리테세리엔",
  Toppserien: "톱세리엔",
  Veikkausliiga: "베이카우스리가",
  Ykkösliiga: "위꼬스리가",
  Ykkönen: "위꼬넨",
  "Kansallinen Liiga": "칸살리넨 리가",
  Meistriliiga: "메이스트리리가",
  Virsliga: "비르스리가",
  "1 Lyga": "1부리그",
  "Czech Liga": "체코 리가",
  "Jupiler Pro League": "윱필러 프로리그",
  "Challenger Pro League": "챌린저 프로리그",
  "Super League": "수퍼리그",
  "Super League 1": "수퍼리그 1",
  Superliga: "수페르리가",
  "Super Liga": "수페르리가",
  Premijer: "프레미예르 리가",
  "Premijer Liga": "프레미예르 리가",
  "Premyer Liqa": "프레미예르 리가",
  Ligat: "리가트 하알",
  "Ligat Ha'al": "리가트 하알",
  "Pro League": "프로리그",
  "Stars League": "스타스리그",
  "Iraqi League": "이라크리그",
  "Liga MX": "리가 MX",
  "Liga MX Femenil": "여자 리가 MX",
  "Liga MX U21": "리가 MX U21",
  "Liga de Expansión MX": "리가 데 엑스판시온 MX",
  "Major League Soccer": "메이저리그사커",
  "MLS Next Pro": "MLS 넥스트 프로",
  "Canadian Premier League": "캐나다 프리미어리그",
  "Northern Super League": "노던 수퍼리그",
  "USL Championship": "USL 챔피언십",
  "USL League One": "USL 리그원",
  "USL Super League": "USL 수퍼리그",
  "NWSL Women": "NWSL 여자리그",
  "Liga Profesional Argentina": "리가 프로페시오날 아르헨티나",
  "Primera Nacional": "프리메라 나시오날",
  "Primera B Metropolitana": "프리메라 B 메트로폴리타나",
  "Primera C": "프리메라 C",
  "Torneo Federal A": "토르네오 페데랄 A",
  "Torneo Promocional Amateur": "토르네오 프로모시오날 아마추어",
  "Primera División": "프리메라 디비시온",
  "Primera Division": "프리메라 디비시온",
  "Primera A": "프리메라 A",
  "Primera B": "프리메라 B",
  "Liga Pro": "리가 프로",
  "Liga Pro Serie B": "리가 프로 세리에 B",
  "Liga Nacional": "리가 나시오날",
  "Liga Mayor": "리가 마요르",
  "Liga de Ascenso": "리가 데 아센소",
  "Liga Panameña de Fútbol": "파나마 축구리그",
  "Division Intermedia": "디비시온 인테르메디아",
  "Division Profesional - Clausura": "디비시온 프로페시오날 - 클라우수라",
  "Nacional B": "나시오날 B",
  "Primera B Nacional": "프리메라 B 나시오날",
  "China League One": "중국 갑급리그",
  "League Two (China)": "중국 을급리그",
  "Super League (China)": "중국 슈퍼리그",
  Girabola: "지라볼라",
  "K League 1": "K리그1",
  "K League 2": "K리그2",
  "K3 League": "K3리그",
  "K4 League": "K4리그",
  "WK-League": "WK리그",
  "J1 League": "J1리그",
  "J2 League": "J2리그",
  "J3 League": "J3리그",
  "WE League": "WE리그",
  "Saudi Pro League": "사우디 프로리그",
  "ASEAN Championship": "아세안 챔피언십",
  "OFC Champions League": "OFC 챔피언스리그",
  "Friendlies Clubs": "클럽 친선경기",
  Cup: "컵",
};

/** Multi-word place names that contain a compass word as part of the proper
 * noun (e.g. "New South Wales") — must be substituted whole BEFORE the
 * generic compass-direction pass below, or "South" gets mistaken for a
 * tier/region qualifier and mangles the place name (e.g. "New 남부 Wales"). */
const PLACE_NAME_KO: [RegExp, string][] = [
  [/\bNew South Wales\b/g, "뉴사우스웨일스"],
  [/\bSouth Australia\b/g, "사우스오스트레일리아"],
  [/\bWestern Australia\b/g, "웨스턴오스트레일리아"],
  [/\bNorthern Territory\b/g, "노던준주"],
  [/\bCapital Territory\b/g, "수도준주"],
];

const DIRECTION_KO: [RegExp, string][] = [
  [/\bNortheast\b/g, "북동부"],
  [/\bNorthwest\b/g, "북서부"],
  [/\bSoutheast\b/g, "남동부"],
  [/\bSouthwest\b/g, "남서부"],
  [/\bNorth\b/g, "북부"],
  [/\bSouth\b/g, "남부"],
  [/\bEast\b/g, "동부"],
  [/\bWest\b/g, "서부"],
  [/\bCentral\b/g, "중부"],
  [/\bNorra\b/g, "북부"],
  [/\bSödra\b/g, "남부"],
];

/** Generic, low-risk word substitutions applied to whatever's left after the
 * exact-dictionary lookup misses — handles the long tail of regional/youth/
 * women's/reserve league name variants without asserting a specific league's
 * exact tier ranking (which upstream naming itself is often inconsistent
 * about across countries). */
function applyGenericTerms(input: string): string {
  let s = input;
  for (const [re, ko] of PLACE_NAME_KO) s = s.replace(re, ko);
  s = s.replace(/\bWomen\b/g, "여자").replace(/\bFeminin\b/gi, "여자").replace(/\bFemenil\b/gi, "여자");
  s = s.replace(/\bYouth\b/g, "유스").replace(/\bReserve\b/g, "리저브");
  s = s.replace(/\bCup\b/g, "컵").replace(/\bPokal\b/g, "포칼");
  s = s.replace(/\bDivision\b/g, "디비전").replace(/\bDivisie\b/g, "디비시");
  s = s.replace(/\bLeague\b/g, "리그").replace(/\bLiga\b/gi, "리가").replace(/\bLiiga\b/gi, "리가").replace(/\bLyga\b/gi, "리가");
  s = s.replace(/\bGroup\b/g, "조").replace(/\bGirone\b/gi, "조");
  for (const [re, ko] of DIRECTION_KO) s = s.replace(re, ko);
  return s;
}

export function toKoreanCountry(country: string): string {
  return COUNTRY_NAME_KO[country] ?? country;
}

export function toKoreanLeagueName(country: string, name: string): string {
  const byCountry = LEAGUE_NAME_KO_BY_COUNTRY[`${country}|${name}`];
  if (byCountry) return byCountry;

  const exact = LEAGUE_NAME_KO[name];
  if (exact) return exact;

  return applyGenericTerms(name);
}

const TIER4_PATTERN = /\b(U1[0-9]|U2[0-9]|U9|Youth|Junior|Juniores|Primavera|Reserve|Development|Women|Feminin|Femenil|Frauen|Damallsvenskan|Kvinde|NPL|State League|Amateur|Academy)\b/i;
const TIER3_PATTERN = /\b(3|4|5|6|7|8|III|IV|Third|Fourth|Serie C|Serie D|Regionalliga|Oberliga|National League|Non League)\b/i;
const TIER2_PATTERN = /\b(2|II|Second|Segunda|Serie B|Ligue 2|Championship|Challenger|Challenge League|Primera B|Liga 2|Zweite)\b/i;

/** Heuristic tier ranking from the RAW (English) league name — used only to sort
 * lower-division/regional/youth leagues further down the list, never to assert
 * a specific country's exact pyramid position (upstream naming is inconsistent
 * about that across countries, so we don't try to be more precise than "roughly
 * how prominent does this sound"). */
export function computeLeagueTier(country: string, name: string, popular: boolean): number {
  if (popular) return 0;
  if (TIER4_PATTERN.test(name)) return 4;
  if (TIER3_PATTERN.test(name)) return 3;
  if (TIER2_PATTERN.test(name)) return 2;
  return 1;
}
