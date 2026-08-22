/**
 * Curated English→Korean team-name translations, used to show Korean team
 * names in the scoreboard. Covers MLB/NBA/NHL, the top-5 European soccer
 * leagues, K League 1/2, and J1 League — the leagues that actually surface
 * in the "인기 리그" sidebar and the TheSportsDB-backed sport tabs.
 *
 * API-FOOTBALL returns thousands of teams across leagues worldwide; a fully
 * accurate translation database for all of them isn't realistic to hand
 * curate, so anything not in this map falls back to its original name
 * rather than risk a wrong translation.
 */
const TEAM_NAME_KO: Record<string, string> = {
  // MLB
  "New York Yankees": "뉴욕 양키스",
  "Boston Red Sox": "보스턴 레드삭스",
  "Toronto Blue Jays": "토론토 블루제이스",
  "Baltimore Orioles": "볼티모어 오리올스",
  "Tampa Bay Rays": "탬파베이 레이스",
  "Chicago White Sox": "시카고 화이트삭스",
  "Cleveland Guardians": "클리블랜드 가디언스",
  "Detroit Tigers": "디트로이트 타이거스",
  "Kansas City Royals": "캔자스시티 로열스",
  "Minnesota Twins": "미네소타 트윈스",
  "Houston Astros": "휴스턴 애스트로스",
  "Los Angeles Angels": "로스앤젤레스 에인절스",
  Athletics: "애슬레틱스",
  "Oakland Athletics": "애슬레틱스",
  "Seattle Mariners": "시애틀 매리너스",
  "Texas Rangers": "텍사스 레인저스",
  "Atlanta Braves": "애틀랜타 브레이브스",
  "Miami Marlins": "마이애미 말린스",
  "New York Mets": "뉴욕 메츠",
  "Philadelphia Phillies": "필라델피아 필리스",
  "Washington Nationals": "워싱턴 내셔널스",
  "Chicago Cubs": "시카고 컵스",
  "Cincinnati Reds": "신시내티 레즈",
  "Milwaukee Brewers": "밀워키 브루어스",
  "Pittsburgh Pirates": "피츠버그 파이리츠",
  "St. Louis Cardinals": "세인트루이스 카디널스",
  "St Louis Cardinals": "세인트루이스 카디널스",
  "Arizona Diamondbacks": "애리조나 다이아몬드백스",
  "Colorado Rockies": "콜로라도 로키스",
  "Los Angeles Dodgers": "로스앤젤레스 다저스",
  "San Diego Padres": "샌디에이고 파드리스",
  "San Francisco Giants": "샌프란시스코 자이언츠",

  // NBA
  "Boston Celtics": "보스턴 셀틱스",
  "Brooklyn Nets": "브루클린 네츠",
  "New York Knicks": "뉴욕 닉스",
  "Philadelphia 76ers": "필라델피아 세븐티식서스",
  "Toronto Raptors": "토론토 랩터스",
  "Chicago Bulls": "시카고 불스",
  "Cleveland Cavaliers": "클리블랜드 캐벌리어스",
  "Detroit Pistons": "디트로이트 피스톤스",
  "Indiana Pacers": "인디애나 페이서스",
  "Milwaukee Bucks": "밀워키 벅스",
  "Atlanta Hawks": "애틀랜타 호크스",
  "Charlotte Hornets": "샬럿 호네츠",
  "Miami Heat": "마이애미 히트",
  "Orlando Magic": "올랜도 매직",
  "Washington Wizards": "워싱턴 위저즈",
  "Denver Nuggets": "덴버 너기츠",
  "Minnesota Timberwolves": "미네소타 팀버울브스",
  "Oklahoma City Thunder": "오클라호마시티 썬더",
  "Portland Trail Blazers": "포틀랜드 트레일블레이저스",
  "Utah Jazz": "유타 재즈",
  "Golden State Warriors": "골든스테이트 워리어스",
  "LA Clippers": "LA 클리퍼스",
  "Los Angeles Clippers": "LA 클리퍼스",
  "Los Angeles Lakers": "로스앤젤레스 레이커스",
  "Phoenix Suns": "피닉스 선즈",
  "Sacramento Kings": "새크라멘토 킹스",
  "Dallas Mavericks": "댈러스 매버릭스",
  "Houston Rockets": "휴스턴 로키츠",
  "Memphis Grizzlies": "멤피스 그리즐리스",
  "New Orleans Pelicans": "뉴올리언스 펠리컨스",
  "San Antonio Spurs": "샌안토니오 스퍼스",

  // NHL
  "Boston Bruins": "보스턴 브루인스",
  "Buffalo Sabres": "버팔로 세이버스",
  "Detroit Red Wings": "디트로이트 레드윙스",
  "Florida Panthers": "플로리다 팬서스",
  "Montreal Canadiens": "몬트리올 캐나디언스",
  "Ottawa Senators": "오타와 세너터스",
  "Tampa Bay Lightning": "탬파베이 라이트닝",
  "Toronto Maple Leafs": "토론토 메이플리프스",
  "Carolina Hurricanes": "캐롤라이나 허리케인스",
  "Columbus Blue Jackets": "콜럼버스 블루재키츠",
  "New Jersey Devils": "뉴저지 데블스",
  "New York Islanders": "뉴욕 아일랜더스",
  "New York Rangers": "뉴욕 레인저스",
  "Philadelphia Flyers": "필라델피아 플라이어스",
  "Pittsburgh Penguins": "피츠버그 펭귄스",
  "Washington Capitals": "워싱턴 캐피털스",
  "Chicago Blackhawks": "시카고 블랙호크스",
  "Colorado Avalanche": "콜로라도 애벌랜치",
  "Dallas Stars": "댈러스 스타스",
  "Minnesota Wild": "미네소타 와일드",
  "Nashville Predators": "내슈빌 프레데터스",
  "St. Louis Blues": "세인트루이스 블루스",
  "St Louis Blues": "세인트루이스 블루스",
  "Utah Hockey Club": "유타 하키 클럽",
  "Utah Mammoth": "유타 매머스",
  "Winnipeg Jets": "위니펙 제츠",
  "Anaheim Ducks": "애너하임 덕스",
  "Calgary Flames": "캘거리 플레임스",
  "Edmonton Oilers": "에드먼턴 오일러스",
  "Los Angeles Kings": "로스앤젤레스 킹스",
  "San Jose Sharks": "새너제이 샤크스",
  "Seattle Kraken": "시애틀 크라켄",
  "Vancouver Canucks": "밴쿠버 커넉스",
  "Vegas Golden Knights": "베가스 골든나이츠",

  // Premier League
  Arsenal: "아스널",
  "Aston Villa": "애스턴 빌라",
  Bournemouth: "본머스",
  Brentford: "브렌트포드",
  Brighton: "브라이튼",
  "Brighton & Hove Albion": "브라이튼",
  Burnley: "번리",
  Chelsea: "첼시",
  "Crystal Palace": "크리스탈 팰리스",
  Everton: "에버턴",
  Fulham: "풀럼",
  Leeds: "리즈 유나이티드",
  "Leeds United": "리즈 유나이티드",
  Leicester: "레스터 시티",
  "Leicester City": "레스터 시티",
  Liverpool: "리버풀",
  Luton: "루턴 타운",
  "Luton Town": "루턴 타운",
  "Manchester City": "맨체스터 시티",
  "Man City": "맨체스터 시티",
  "Manchester United": "맨체스터 유나이티드",
  "Manchester Utd": "맨체스터 유나이티드",
  "Man United": "맨체스터 유나이티드",
  Newcastle: "뉴캐슬 유나이티드",
  "Newcastle United": "뉴캐슬 유나이티드",
  "Nottingham Forest": "노팅엄 포레스트",
  "Sheffield Utd": "셰필드 유나이티드",
  "Sheffield United": "셰필드 유나이티드",
  Southampton: "사우샘프턴",
  Sunderland: "선덜랜드",
  Tottenham: "토트넘 홋스퍼",
  "West Ham": "웨스트햄 유나이티드",
  "West Ham United": "웨스트햄 유나이티드",
  Wolves: "울버햄튼 원더러스",
  Wolverhampton: "울버햄튼 원더러스",
  Ipswich: "입스위치 타운",
  "Ipswich Town": "입스위치 타운",

  // La Liga
  "Real Madrid": "레알 마드리드",
  Barcelona: "바르셀로나",
  "Atletico Madrid": "아틀레티코 마드리드",
  "Atlético Madrid": "아틀레티코 마드리드",
  Sevilla: "세비야",
  "Real Betis": "레알 베티스",
  "Real Sociedad": "레알 소시에다드",
  Villarreal: "비야레알",
  "Athletic Club": "아틀레틱 빌바오",
  "Athletic Bilbao": "아틀레틱 빌바오",
  Valencia: "발렌시아",
  "Celta Vigo": "셀타 비고",
  Osasuna: "오사수나",
  Girona: "지로나",
  Getafe: "헤타페",
  Mallorca: "마요르카",
  "Rayo Vallecano": "라요 바예카노",
  Espanyol: "에스파뇰",
  "Las Palmas": "라스팔마스",
  Alaves: "알라베스",
  "Deportivo Alaves": "알라베스",
  Leganes: "레가네스",
  Valladolid: "바야돌리드",
  "Real Valladolid": "바야돌리드",
  Elche: "엘체",
  Levante: "레반테",

  // Serie A
  Juventus: "유벤투스",
  Inter: "인터 밀란",
  "Internazionale Milano": "인터 밀란",
  "AC Milan": "AC 밀란",
  Milan: "AC 밀란",
  Napoli: "나폴리",
  "AS Roma": "AS 로마",
  Roma: "AS 로마",
  Lazio: "라치오",
  Atalanta: "아탈란타",
  Fiorentina: "피오렌티나",
  Bologna: "볼로냐",
  Torino: "토리노",
  Udinese: "우디네세",
  Sassuolo: "사수올로",
  Genoa: "제노아",
  Cagliari: "칼리아리",
  Verona: "베로나",
  "Hellas Verona": "베로나",
  Empoli: "엠폴리",
  Lecce: "레체",
  Parma: "파르마",
  Como: "코모",
  Venezia: "베네치아",
  Monza: "몬차",
  Cremonese: "크레모네세",
  Pisa: "피사",

  // Bundesliga
  "Bayern Munich": "바이에른 뮌헨",
  "Bayern München": "바이에른 뮌헨",
  "Borussia Dortmund": "보루시아 도르트문트",
  "RB Leipzig": "RB 라이프치히",
  "Bayer Leverkusen": "바이어 레버쿠젠",
  "Union Berlin": "우니온 베를린",
  "Eintracht Frankfurt": "아인트라흐트 프랑크푸르트",
  Wolfsburg: "볼프스부르크",
  "VfL Wolfsburg": "볼프스부르크",
  "Borussia Monchengladbach": "보루시아 묀헨글라트바흐",
  "Borussia M'gladbach": "보루시아 묀헨글라트바흐",
  Freiburg: "프라이부르크",
  "SC Freiburg": "프라이부르크",
  Hoffenheim: "호펜하임",
  Mainz: "마인츠",
  "Mainz 05": "마인츠",
  "FC Koln": "FC 쾰른",
  "1. FC Koln": "FC 쾰른",
  "Werder Bremen": "베르더 브레멘",
  Augsburg: "아우크스부르크",
  Stuttgart: "슈투트가르트",
  "VfB Stuttgart": "슈투트가르트",
  Bochum: "보훔",
  "VfL Bochum": "보훔",
  Heidenheim: "하이덴하임",
  "St Pauli": "FC 상파울리",
  "FC St. Pauli": "FC 상파울리",
  "Hamburger SV": "함부르크 SV",

  // Ligue 1
  "Paris Saint Germain": "파리 생제르맹",
  "Paris Saint-Germain": "파리 생제르맹",
  PSG: "파리 생제르맹",
  Marseille: "올랭피크 마르세유",
  Monaco: "AS 모나코",
  "AS Monaco": "AS 모나코",
  Lyon: "올랭피크 리옹",
  "Olympique Lyonnais": "올랭피크 리옹",
  Lille: "릴 OSC",
  "LOSC Lille": "릴 OSC",
  Nice: "OGC 니스",
  "OGC Nice": "OGC 니스",
  Rennes: "스타드 렌",
  Lens: "RC 랑스",
  "RC Lens": "RC 랑스",
  Strasbourg: "스트라스부르",
  Toulouse: "툴루즈",
  Montpellier: "몽펠리에",
  Nantes: "FC 낭트",
  "FC Nantes": "FC 낭트",
  Reims: "스타드 랭스",
  Brest: "스타드 브레스투아",
  Auxerre: "AJ 오세르",
  "AJ Auxerre": "AJ 오세르",
  Angers: "SCO 앙제",
  "Le Havre": "르아브르",
  Metz: "FC 메스",
  "FC Metz": "FC 메스",
  "Paris FC": "파리 FC",

  // K League 1 & 2
  "Ulsan Hyundai": "울산 HD",
  "Ulsan HD": "울산 HD",
  "Jeonbuk Hyundai Motors": "전북 현대 모터스",
  "Jeonbuk Motors": "전북 현대 모터스",
  "Pohang Steelers": "포항 스틸러스",
  "FC Seoul": "FC 서울",
  "Gwangju FC": "광주 FC",
  "Daegu FC": "대구 FC",
  "Daejeon Citizen": "대전 하나 시티즌",
  "Daejeon Hana Citizen": "대전 하나 시티즌",
  "Gangwon FC": "강원 FC",
  "Suwon FC": "수원 FC",
  "Jeju United": "제주 SK FC",
  "Jeju SK": "제주 SK FC",
  "Gimcheon Sangmu": "김천 상무",
  "FC Anyang": "FC 안양",
  "Bucheon FC 1995": "부천 FC 1995",
  "Cheonan City": "천안 시티",
  "Hwaseong FC": "화성 FC",
  "Ansan Greeners": "안산 그리너스",
  "Seoul E-Land": "서울 이랜드",
  "Gyeongnam FC": "경남 FC",
  "Chungbuk Cheongju": "충북 청주",
  "Incheon United": "인천 유나이티드",
  "Busan IPark": "부산 아이파크",
  "Suwon Samsung Bluewings": "수원 삼성 블루윙즈",
  "Gimhae FC": "김해 FC",
  "Seongnam FC": "성남 FC",

  // J1 League
  "Kashima Antlers": "가시마 앤틀러스",
  "Kawasaki Frontale": "가와사키 프론탈레",
  "Urawa Red Diamonds": "우라와 레드다이아몬즈",
  "Urawa Reds": "우라와 레드다이아몬즈",
  "Yokohama F Marinos": "요코하마 F. 마리노스",
  "Yokohama F. Marinos": "요코하마 F. 마리노스",
  "Vissel Kobe": "비셀 고베",
  "Sanfrecce Hiroshima": "산프레체 히로시마",
  "Gamba Osaka": "감바 오사카",
  "Cerezo Osaka": "세레소 오사카",
  "FC Tokyo": "FC 도쿄",
  "Nagoya Grampus": "나고야 그램퍼스",
  "Avispa Fukuoka": "아비스파 후쿠오카",
  "Kyoto Sanga": "교토 상가",
  "Shonan Bellmare": "쇼난 벨마레",
  "Albirex Niigata": "알비레엑스 니가타",
  "Tokyo Verdy": "도쿄 베르디",
  "Machida Zelvia": "마치다 젤비아",
  "Fagiano Okayama": "파지아노 오카야마",
  "Kashiwa Reysol": "가시와 레이솔",
  "Consadole Sapporo": "콘사돌레 삿포로",
  "Jubilo Iwata": "주빌로 이와타",

  // --- 그리스 ---
  "AEK Athens FC": "AEK 아테네",
  "Aris Thessalonikis": "아리스 테살로니키",
  Atromitos: "아트로미토스",
  "Olympiakos Piraeus": "올림피아코스",

  // --- 네덜란드 ---
  "AZ Alkmaar": "AZ 알크마르",
  Excelsior: "엑셀시오르",
  "Fortuna Sittard": "포르투나 시타드",
  Heerenveen: "헤렌베인",
  "Jong Ajax": "용 아약스",
  "NAC Breda": "NAC 브레다",
  "NEC Nijmegen": "NEC 네이메헌",
  "PEC Zwolle": "PEC 즈볼레",
  "Sparta Rotterdam": "스파르타 로테르담",
  Utrecht: "위트레흐트",

  // --- 노르웨이 ---
  Bryne: "브리네",

  // --- 대한민국 (K3리그 등) ---
  "Busan I Park": "부산 아이파크",
  "Busan Transportation": "부산교통공사",
  "Changwon City": "창원시청",
  "Dangjin Citizen": "당진시민",
  "Gimcheon Sangmu FC": "김천 상무",
  "Gimhae City": "김해시청",
  "Jeju United FC": "제주 유나이티드",
  "Mokpo City": "목포시청",
  Pocheon: "포천시민",
  "Suwon Bluewings": "수원 삼성 블루윙즈",
  "Suwon City FC": "수원FC",
  "Ulsan Hyundai FC": "울산 HD",
  Yangpyeong: "양평FC",

  // --- 덴마크 ---
  "AB Copenhagen": "AB 코펜하겐",
  Hvidovre: "히비도우레",

  // --- 독일 ---
  "1. FC Nürnberg": "1.FC 뉘른베르크",
  "1899 Hoffenheim": "1899 호펜하임",
  "Arminia Bielefeld": "아르미니아 빌레펠트",
  "Energie Cottbus": "에네르기 코트부스",
  "Erzgebirge Aue": "에르츠게비르게 아우에",
  "FC Augsburg": "FC 아우크스부르크",
  "FC Saarbrücken": "FC 자르브뤼켄",
  "FC Viktoria Köln": "FC 빅토리아 쾰른",
  "Hannover 96": "하노버 96",
  "Hertha BSC": "헤르타 BSC",
  "Holstein Kiel": "홀슈타인 킬",
  "MSV Duisburg": "MSV 뒤스부르크",
  "SV Elversberg": "SV 엘버스베르크",
  "SV Wehen": "SV 베엔 비스바덴",
  "TSV 1860 München": "1860 뮌헨",

  // --- 러시아 ---
  "CSKA Moscow": "CSKA 모스크바",
  "FC Orenburg": "FC 오렌부르크",
  "FC Rostov": "FC 로스토프",
  Lokomotiv: "로코모티프 모스크바",
  Ural: "우랄",

  // --- 루마니아 ---
  "Dinamo Bucuresti": "디나모 부쿠레슈티",
  "Universitatea Cluj": "우니베르시타테아 클루지",
  "Uta Arad": "UTA 아라드",

  // --- 멕시코 ---
  "Club America": "클럽 아메리카",
  "Club Queretaro": "케레타로",
  "Club Tijuana": "티후아나",
  "FC Juarez": "FC 후아레스",
  "Guadalajara Chivas": "과달라하라 치바스",
  Leon: "레온",
  Monterrey: "몬테레이",
  "Tigres UANL": "티그레스 UANL",
  Toluca: "톨루카",

  // --- 미국 (NWSL) ---
  "North Carolina Courage W": "노스캐롤라이나 커리지",
  "San Diego Wave W": "샌디에이고 웨이브",
  "Seattle Reign FC W": "시애틀 레인",
  "Utah Royals W": "유타 로열스",

  // --- 벨기에 ---
  Antwerp: "안트베르펜",
  Charleroi: "샤를루아",
  "Club Brugge II": "클럽 브뤼헤 II",
  Genk: "헹크",
  "KV Mechelen": "KV 메헬런",
  "SK Beveren": "SK 베베런",
  "Zulte Waregem": "쥘터 바레험",

  // --- 벨라루스 ---
  "FC Gomel": "FC 고멜",

  // --- 불가리아 ---
  "Levski Sofia": "레프스키 소피아",
  Ludogorets: "루도고레츠",
  "Slavia Sofia": "슬라비아 소피아",
  "Spartak Varna": "스파르타크 바르나",

  // --- 브라질 ---
  "Atletico-MG": "아틀레티코 미네이루",
  Cruzeiro: "크루제이루",
  Flamengo: "플라멩구",
  Fluminense: "플루미넨시",
  Internacional: "인테르나시오나우",

  // --- 사우디아라비아 ---
  "Al Shabab": "알샤바브",
  "Al Taawon": "알타아운",
  "Al-Ahli Jeddah": "알아흘리",
  "Al-Ettifaq": "알이티하드 이티파크",
  "Al-Fateh": "알파테흐",

  // --- 세르비아 ---
  "OFK Beograd": "OFK 베오그라드",

  // --- 스위스 ---
  "FC Basel 1893": "FC 바젤",
  "FC Luzern": "FC 루체른",
  "FC Zurich": "FC 취리히",
  Lausanne: "로잔",

  // --- 스코틀랜드 ---
  Celtic: "셀틱",
  Dundee: "던디",
  "Dundee Utd": "던디 유나이티드",
  Dunfermline: "던펌린",
  "Hamilton Academical": "해밀턴 아카데미컬",
  Livingston: "리빙스턴",
  Morton: "모턴",
  Rangers: "레인저스",
  "Ross County": "로스 카운티",
  "ST Johnstone": "세인트 존스턴",
  "ST Mirren": "세인트 미렌",

  // --- 스페인 (하부리그) ---
  Albacete: "알바세테",
  Cadiz: "카디스",
  Oviedo: "오비에도",

  // --- 슬로바키아 ---
  "Dunajska Streda": "두나이스카 스트레다",
  "Slovan Bratislava": "슬로반 브라티슬라바",

  // --- 슬로베니아 ---
  Celje: "첼레",
  Koper: "코페르",
  Mura: "무라",

  // --- 아랍에미리트 ---
  "Al Ain": "알아인",
  "Shabab Al Ahli Dubai": "샤바브 알아흘리 두바이",

  // --- 아르헨티나 ---
  Atlanta: "아틀란타",
  "Atletico Tucuman": "아틀레티코 투쿠만",
  Independiente: "인데펜디엔테",
  "San Martin S.J.": "산마르틴 SJ",

  // --- 아일랜드 ---
  "Bray Wanderers": "브레이 원더러스",

  // --- 알바니아 ---
  Partizani: "파르티자니 티라나",

  // --- 이스라엘 ---
  "Maccabi Haifa": "마카비 하이파",

  // --- 이집트 ---
  "Pyramids FC": "피라미즈 FC",

  // --- 이탈리아 (세리에 B/C) ---
  Benevento: "베네벤토",
  Modena: "모데나",

  // --- 잉글랜드 (하부리그) ---
  "AFC Wimbledon": "AFC 윔블던",
  Barnet: "바넷",
  Barnsley: "반슬리",
  Barrow: "배로",
  Birmingham: "버밍엄 시티",
  Blackburn: "블랙번 로버스",
  Blackpool: "블랙풀",
  Bolton: "볼턴 원더러스",
  "Bristol City": "브리스톨 시티",
  "Bristol Rovers": "브리스톨 로버스",
  "Burton Albion": "버턴 알비온",
  "Cambridge United": "케임브리지 유나이티드",
  Cardiff: "카디프 시티",
  Carlisle: "칼라일 유나이티드",
  Charlton: "찰턴 애슬레틱",
  Cheltenham: "첼튼엄 타운",
  "Crawley Town": "크롤리 타운",
  Crewe: "크루 알렉산드라",
  Derby: "더비 카운티",
  Doncaster: "돈캐스터 로버스",
  "Fleetwood Town": "플리트우드 타운",
  Gillingham: "질링엄",
  Grimsby: "그림스비 타운",
  Hartlepool: "하틀풀 유나이티드",
  Huddersfield: "허더즈필드 타운",
  "Hull City": "헐 시티",
  "Leyton Orient": "레이턴 오리엔트",
  Lincoln: "링컨 시티",
  "Mansfield Town": "맨스필드 타운",
  Middlesbrough: "미들즈브러",
  Millwall: "밀월",
  "Milton Keynes Dons": "MK 돈스",
  "Newport County": "뉴포트 카운티",
  Northampton: "노샘프턴 타운",
  Norwich: "노리치 시티",
  "Notts County": "노츠 카운티",
  Oldham: "올덤 애슬레틱",
  "Oxford United": "옥스퍼드 유나이티드",
  Peterborough: "피터버러 유나이티드",
  Plymouth: "플리머스 아가일",
  Portsmouth: "포츠머스",
  Preston: "프레스턴 노스엔드",
  QPR: "퀸즈 파크 레인저스",
  Reading: "레딩",
  Rochdale: "로치데일",
  Rotherham: "로더럼 유나이티드",
  "Salford City": "샐퍼드 시티",
  Shrewsbury: "슈루즈베리 타운",
  Southend: "사우스엔드 유나이티드",
  Stevenage: "스티브니지",
  "Stockport County": "스톡포트 카운티",
  "Stoke City": "스토크 시티",
  Swansea: "스완지 시티",
  "Swindon Town": "스윈던 타운",
  Tranmere: "트란미어 로버스",
  Walsall: "월솔",
  Watford: "왓포드",
  Wigan: "위건 애슬레틱",
  Wrexham: "렉섬",
  Wycombe: "위컴 원더러스",
  York: "요크 시티",

  // --- 중국 ---
  "Beijing Guoan": "베이징 궈안",
  "Shandong Luneng": "산둥 타이산",
  "Shanghai Shenhua": "상하이 선화",
  "Tianjin Teda": "톈진 진먼후",
  "Wuhan Three Towns": "우한 산진",

  // --- 체코 ---
  "Bohemians 1905": "보헤미안스 1905",
  "Slavia Praha": "슬라비아 프라하",
  "Slovan Liberec": "슬로반 리베레츠",
  "Sparta Praha": "스파르타 프라하",

  // --- 칠레 ---
  Cobreloa: "코브레로아",
  Huachipato: "우아치파토",
  "Union Espanola": "우니온 에스파뇰라",

  // --- 카자흐스탄 ---
  "Kairat Almaty": "카이라트 알마티",

  // --- 카타르 ---
  "Al Sadd": "알사드",

  // --- 콜롬비아 ---
  "America de Cali": "아메리카 데 칼리",
  Bucaramanga: "부카라망가",
  Millonarios: "미요나리오스",
  "Santa Fe": "산타페",

  // --- 크로아티아 ---
  "Dinamo Zagreb": "디나모 자그레브",

  // --- 튀르키예 ---
  Antalyaspor: "안탈리아스포르",
  "Fenerbahçe": "페네르바흐체",
  Kasımpaşa: "카슴파샤",
  Kayserispor: "카이세리스포르",
  Konyaspor: "콘야스포르",
  Rizespor: "리제스포르",
  Samsunspor: "삼순스포르",

  // --- 포르투갈 ---
  Estoril: "이스토릴",
  Maritimo: "마리티무",
  "Rio Ave": "히우 아브",
  "Sporting CP": "스포르팅 CP",

  // --- 폴란드 ---
  "Legia Warszawa": "레기아 바르샤바",
  "Piast Gliwice": "피아스트 글리비체",

  // --- 프랑스 (리그 2) ---
  "Estac Troyes": "트루아",
  Grenoble: "그르노블",
  Laval: "라발",
  "Le Mans": "르망",
  Lorient: "로리앙",
  "Saint Etienne": "생테티엔",

  // --- 헝가리 ---
  "Fehérvár FC": "페헤르바르",
  "MTK Budapest": "MTK 부다페스트",
  "Puskas Academy": "푸슈카시 아카데미아",

  // --- 스페인 하부/친선(국제로 잡히는 항목 포함) ---
  "Arenas Getxo": "아레나스 게초",
  "Atlético Baleares": "아틀레티코 발레아레스",
  Castellón: "카스테욘",
  "Castellón II": "카스테욘 II",
  "Espanyol II": "에스파뇰 II",
  "Getafe II": "헤타페 II",
  Gimnastic: "짐나스틱 타라고나",
  Huesca: "우에스카",
  "Huesca II": "우에스카 II",
  Intercity: "인터시티",
  Manresa: "만레사",
  Numancia: "누만시아",
  "Rayo Majadahonda": "라요 마하다혼다",
  "Real Madrid III": "레알 마드리드 III",
  "UD Logroñés": "UD 로그로녜스",
  "Unionistas II": "우니오니스타스 II",
  Zaragoza: "사라고사",

  // --- 그리스 ---
  Kalamata: "칼라마타",

  // --- 대한민국 ---
  Yeoju: "여주FC",

  // --- 독일 ---
  "Eintracht Trier": "아인트라흐트 트리어",

  // --- 라트비아 ---
  "BFC Daugavpils": "BFC 다우가프필스",
  "Super Nova": "수퍼노바",

  // --- 러시아 ---
  Akhmat: "아흐마트 그로즈니",

  // --- 루마니아 ---
  "ASA Targu Mures": "ASA 트르구무레슈",
  Concordia: "콘코르디아 키아잣나",
  "FC Politehnica Timisoara": "폴리테흐니카 티미쇼아라",

  // --- 멕시코 ---
  "Atlante FC": "아틀란테",
  "Cruz Azul Hidalgo": "크루스 아술 이달고",

  // --- 몬테네그로 ---
  Sutjeska: "수티예스카",

  // --- 미국(NWSL) ---
  "Boston Legacy W": "보스턴 레거시",
  "Kansas City W": "캔자스시티 커런트",

  // --- 베네수엘라 ---
  "Deportivo La Guaira": "데포르티보 라구아이라",
  "Deportivo Tachira FC": "데포르티보 타치라",
  "Metropolitanos FC": "메트로폴리타노스",
  "Monagas SC": "모나가스",
  "Portuguesa FC": "포르투게사",
  "Zamora FC": "사모라",

  // --- 벨기에 ---
  "Beerschot VA": "베이르스호트 VA",
  "K. Lierse S.K.": "리르서 SK",
  "Seraing United": "세랭 유나이티드",

  // --- 벨라루스 ---
  Neman: "네만 흐로드나",

  // --- 보스니아 ---
  "Siroki Brijeg": "시로키 브리예그",

  // --- 볼리비아 ---
  Aurora: "아우로라",
  "Independiente Petrolero": "인데펜디엔테 페트롤레로",
  "Oriente Petrolero": "오리엔테 페트롤레로",
  "Real Potosí": "레알 포토시",

  // --- 브라질 ---
  Remo: "헤무",

  // --- 사우디아라비아 ---
  Abha: "아브하",

  // --- 세르비아 ---
  "Radnicki 1923": "라드니치키 1923",
  "Radnicki NIS": "라드니치키 니시",

  // --- 스웨덴 ---
  Halmstad: "할름스타드",
  Lund: "룬드",
  Rosengård: "로센고드",
  Trelleborg: "트렐레보리",

  // --- 스코틀랜드 ---
  "Airdrie United": "에어드리 유나이티드",
  "Alloa Athletic": "알로아 애슬레틱",
  "Annan Athletic": "아난 애슬레틱",
  Arbroath: "아브로스",
  "Ayr Utd": "에어 유나이티드",
  Clyde: "클라이드",
  "Cove Rangers": "코브 레인저스",
  Dumbarton: "덤바턴",
  "East Fife": "이스트 파이프",
  "Elgin City": "엘긴 시티",
  "Forfar Athletic": "포퍼 애슬레틱",
  "Kelty Hearts": "켈티 하츠",
  Montrose: "몬트로즈",
  Peterhead: "피터헤드",
  "Queen of the South": "퀸 오브 더 사우스",
  "Queen's Park": "퀸즈 파크",
  "Raith Rovers": "레이스 로버스",
  Stenhousemuir: "스텐하우스뮤어",
  "Stirling Albion": "스털링 알비온",
  Stranraer: "스트랜레어",

  // --- 스페인 ---
  Eldense: "엘덴세",

  // --- 슬로바키아 ---
  "FK Košice": "FK 코시체",
  Ružomberok: "루좀베로크",
  Skalica: "스칼리차",

  // --- 아랍에미리트 ---
  Ajman: "아지만",
  "Hatta SC": "하타",
  Khorfakkan: "코르파칸",

  // --- 아르메니아 ---
  "FC Urartu": "우라르투",
  Shirak: "시라크",

  // --- 아르헨티나 ---
  Almagro: "알마그로",
  "Almirante Brown": "알미란테 브라운",
  "Colon Santa Fe": "콜론 산타페",
  "Gimnasia L.P.": "히무나시아 라플라타",
  "Instituto Cordoba": "인스티투토 코르도바",
  "Los Andes": "로스 안데스",
  "Nueva Chicago": "누에바 시카고",
  Patronato: "파트로나토",

  // --- 아이슬란드 ---
  Fylkir: "필키르",
  Grindavik: "그린다비크",
  "Throttur Reykjavik": "트로투르 레이캬비크",

  // --- 아일랜드 ---
  "Longford Town": "롱퍼드 타운",

  // --- 아제르바이잔 ---
  Qabala: "가발라",
  Qarabag: "카라바흐",
  "Sabah FA": "사바흐",

  // --- 알바니아 ---
  Laci: "라치",
  "Teuta Durrës": "테우타 두러스",

  // --- 에스토니아 ---
  Kuressaare: "쿠레사레",

  // --- 에콰도르 ---
  "Deportivo Cuenca": "데포르티보 쿠엥카",
  "Independiente del Valle": "인데펜디엔테 델 바예",
  "Mushuc Runa SC": "무슈크 루나",
  "Universidad Catolica": "우니베르시다드 카톨리카",

  // --- 오스트리아 ---
  "Austria Lustenau": "아우스트리아 루스테나우",
  "SCR Altach": "SCR 알타흐",
  "Sturm Graz": "슈투름 그라츠",
  "Sturm Graz II": "슈투름 그라츠 II",
  "TSV Hartberg": "TSV 하르트베르크",

  // --- 온두라스 ---
  "CD Motagua": "모타과",

  // --- 우루과이 ---
  "Defensor Sporting": "데펜소르 스포르팅",
  Penarol: "페냐롤",

  // --- 이라크 ---
  Duhok: "두호크",

  // --- 이스라엘 ---
  "Maccabi Petah Tikva": "마카비 페타티크바",

  // --- 이탈리아 ---
  Arezzo: "아레초",
  Avellino: "아벨리노",
  Mantova: "만토바",
  Sudtirol: "쥐트티롤",
  "Virtus Entella": "비르투스 엔텔라",

  // --- 일본 ---
  "Fujieda MYFC": "후지에다 MYFC",
  Imabari: "FC 이마바리",
  Iwaki: "이와키 FC",
  Kashima: "가시마 앤틀러스",
  "Mito Hollyhock": "미토 홀리호크",
  "Montedio Yamagata": "몬테디오 야마가타",
  "Oita Trinita": "오이타 트리니타",
  "Omiya Ardija": "오미야 아르디자",
  "Sagan Tosu": "사간 도스",
  "Shimizu S-pulse": "시미즈 에스펄스",
  "Tokushima Vortis": "도쿠시마 보르티스",
  "Vegalta Sendai": "베갈타 센다이",
  "Ventforet Kofu": "벤포레 고후",
  "Yokohama FC": "요코하마 FC",

  // --- 잉글랜드 ---
  "Accrington ST": "애크링턴 스탠리",
  "Aldershot Town": "알더숏 타운",
  Altrincham: "알트린챔",
  "Boreham Wood": "보어햄 우드",
  "Boston United": "보스턴 유나이티드",
  Bromley: "브롬리",
  Chesterfield: "체스터필드",
  Colchester: "콜체스터 유나이티드",
  Eastleigh: "이스트레이",
  "Exeter City": "엑서터 시티",
  "Forest Green": "포레스트 그린",
  Gateshead: "게이츠헤드",
  "Harrogate Town": "해러게이트 타운",
  "Kidderminster Harriers": "키더민스터 해리어스",
  "Port Vale": "포트베일",
  Scunthorpe: "스컨소프",
  "Solihull Moors": "솔리헐 무어스",
  "Sutton Utd": "서턴 유나이티드",
  Woking: "워킹",
  "Yeovil Town": "예오빌 타운",

  // --- 중국 ---
  "Shandong Taishan II": "산둥 타이산 II",

  // --- 체코 ---
  "Mlada Boleslav": "믈라다 볼레슬라프",
  Slovácko: "슬로바츠코",
  Zlin: "즐린",

  // --- 칠레 ---
  "Deportes Copiapo": "데포르테스 코피아포",
  "Deportes Iquique": "데포르테스 이키케",
  Magallanes: "마가야네스",
  "Union La Calera": "우니온 라 칼레라",

  // --- 카자흐스탄 ---
  Okzhetpes: "옥제트페스",

  // --- 카타르 ---
  "Al Ahli Doha": "알아흘리 도하",
  "Al-Duhail SC": "알두하일",

  // --- 캐나다 ---
  "Atlético Ottawa": "아틀레티코 오타와",
  "Cavalry FC": "캐벌리 FC",
  "Pacific FC": "퍼시픽 FC",
  "Vancouver FC": "밴쿠버 FC",

  // --- 코스타리카 ---
  "CS Cartagines": "카르타히네스",
  "Puntarenas FC": "푼타레나스",

  // --- 콜롬비아 ---
  "Deportes Tolima": "데포르테스 톨리마",
  "Deportivo Pereira": "데포르티보 페레이라",

  // --- 크로아티아 ---
  "NK Varazdin": "NK 바라주딘",

  // --- 파나마 ---
  "CD Arabe Unido": "아라베 우니도",

  // --- 페루 ---
  "Sport Huancayo": "스포르트 우앙카요",

  // --- 포르투갈 ---
  "Academico Viseu": "아카데미쿠 비제우",
  Alverca: "알베르카",
  Leixoes: "레이셰스",
  Torreense: "토레엔세",
  Vizela: "비젤라",

  // --- 폴란드 ---
  "Korona Kielce": "코로나 키엘체",
  "Odra Opole": "오드라 오폴레",
  "Polonia Bytom": "폴로니아 비톰",
  "Widzew Łódź": "비제프 우치",

  // --- 프랑스 ---
  Rodez: "로데즈",

  // --- 핀란드 ---
  "AC Oulu": "AC 오울루",
  "HIFK Helsinki": "HIFK 헬싱키",
  Honka: "홍카",
  Ilves: "일베스",
  "Tampere United": "탐페레 유나이티드",

  // --- 헝가리 ---
  "Diosgyori VTK": "디오시죄리 VTK",
  Nyiregyhaza: "니레지하자",
  Vasas: "바사스",
  Ajka: "아이카",
  BVSC: "BVSC",
  "Kecskeméti TE": "케치케메티 TE",

  // --- 스페인/국제(친선) ---
  "Atlètic Lleida": "아틀레틱 예이다",
  "Atlético Tordesillas": "아틀레티코 토르데시야스",

  // --- 그리스 ---
  "Iraklis 1908": "이라클리스 1908",

  // --- 노르웨이 ---
  "Sandnes ULF": "산네스 울프",

  // --- 대한민국 ---

  // --- 러시아 ---
  Fakel: "파켈 보로네시",
  "Shinnik Yaroslavl": "쉬닉 야로슬라블",

  // --- 루마니아 ---
  "FC Bacau": "FC 바커우",

  // --- 몬테네그로 ---
  "Mladost DG": "믈라도스트 DG",

  // --- 베네수엘라 ---
  UCV: "UCV",

  // --- 벨기에 ---
  Dender: "덴데르",

  // --- 벨라루스 ---
  Belshina: "벨시나 보브루이스크",

  // --- 보스니아 ---
  "Radnik Bijeljina": "라드니크 비옐리나",
  "Sloga Doboj": "슬로가 도보이",
  Velež: "벨레주 모스타르",

  // --- 사우디아라비아 ---
  "Al Kholood": "알콜루드",

  // --- 세르비아 ---
  Zemun: "제문",

  // --- 스웨덴 ---

  // --- 스코틀랜드 ---
  "Edinburgh City": "에든버러 시티",
  Spartans: "스파르탄스",

  // --- 슬로바키아 ---
  "Dukla Banská Bystrica": "두클라 반스카비스트리차",

  // --- 아랍에미리트 ---
  "Al-Dhafra": "알다프라",

  // --- 아르헨티나 ---
  Agropecuario: "아그로페쿠아리오",
  "Chaco For Ever": "차코 포르 에베르",
  Colegiales: "콜레히알레스",
  "Gimnasia Y Tiro": "히무나시아 이 티로",
  "San Miguel": "산미겔",

  // --- 아이슬란드 ---
  Völsungur: "뵐숭구르",

  // --- 아제르바이잔 ---
  Kapaz: "카파스",
  Zira: "지라",

  // --- 에콰도르 ---
  "Guayaquil City FC": "과야킬 시티",
  "Manta FC": "만타",
  "Tecnico Universitario": "테크니코 우니베르시타리오",

  // --- 온두라스 ---
  Juticalpa: "후티칼파",

  // --- 우루과이 ---
  "Cerro Largo": "세로 라르고",
  "Deportivo Maldonado": "데포르티보 말도나도",
  Juventud: "후벤투드",

  // --- 웨일스 ---
  "Ammanford AFC": "아만포드",

  // --- 이라크 ---
  "Al Talaba": "알탈라바",

  // --- 이스라엘 ---
  "Hapoel Petah Tikva": "하포엘 페타티크바",
  "Ironi Kiryat Shmona": "이로니 키리아트시모나",

  // --- 이집트 ---
  "AL Masry": "알마스리",
  "El Geish": "엘게이시",
  "Smouha SC": "스무하",

  // --- 이탈리아 ---
  Carrarese: "카라레세",

  // --- 일본 ---
  "Blaublitz Akita": "블라우블리츠 아키타",
  "Tochigi City": "도치기 시티",

  // --- 잉글랜드 ---
  Tamworth: "탐워스",
  Wealdstone: "웰드스톤",

  // --- 조지아 ---
  Rustavi: "루스타비",
  "Torpedo Kutaisi": "토르페도 쿠타이시",

  // --- 중국 ---
  "Changchun Xidu": "창춘 시두",
  "Dalian Huayi": "다롄 화이",
  "Guangzhou E-Power": "광저우 이리",
  "Hangzhou Greentown": "항저우 그린타운",
  "Qingdao Red Lions": "칭다오 레드라이언즈",
  "Shanghai Second": "상하이 하이강",
  "Shandong Taishan": "산둥 타이산",
  "Suzhou Dongwu": "쑤저우 둥우",

  // --- 체코 ---

  // --- 칠레 ---
  "Deportes Santa Cruz": "데포르테스 산타크루스",

  // --- 카타르 ---
  "Al-Sailiya": "알사일리야",

  // --- 캐나다 ---
  Forge: "포지 FC",
  "HFX Wanderers FC": "핼리팩스 원더러스",

  // --- 콜롬비아 ---
  "Águilas Doradas": "아길라스 도라다스",

  // --- 크로아티아 ---
  "HNK Gorica": "HNK 고리차",
  "NK Slaven Belupo": "슬라벤 벨루포",

  // --- 튀르키예 ---
  "Bodrum FK": "보드룸 FK",

  // --- 파라과이 ---
  "Sportivo Ameliano": "스포르티보 아멜리아노",

  // --- 페루 ---

  // --- 포르투갈 ---
  "União de Leiria": "우니앙 드 레이리아",

  // --- 폴란드 ---
  "Polonia Warszawa": "폴로니아 바르샤바",
  "Slask Wroclaw": "실롱스크 브로츠와프",

  // --- 프랑스 ---
  "Stade Brestois 29": "스타드 브레스투아",

  // --- 핀란드 ---
  Atlantis: "아틀란티스",

  // --- 스페인/국제(친선) ---
  Barbastro: "바르바스트로",
  Cieza: "시에사",
  Guijuelo: "기후엘로",
  Laredo: "라레도",
  Santomera: "산토메라",
  Thailand: "태국",
  Vietnam: "베트남",

  // --- 대한민국 ---
  "Gyeongju HNP": "경주 한수원",
  "Gyeongju W": "경주시청",

  // --- 독일 ---

  // --- 라트비아 ---
  "FS Jelgava": "FS 옐가바",

  // --- 러시아 ---

  // --- 루마니아 ---
  "Corvinul Hunedoara": "코르비눌 후네도아라",

  // --- 몬테네그로 ---
  Jezero: "예제로",

  // --- 베네수엘라 ---
  "Estudiantes de Merida FC": "에스투디안테스 데 메리다",

  // --- 벨라루스 ---
  Naftan: "나프탄 노보폴로츠크",
  "Slavia Mozyr": "슬라비아 모지리",

  // --- 볼리비아 ---
  "Nacional Potosí": "나시오날 포토시",

  // --- 사우디아라비아 ---
  "Al Khaleej Saihat": "알칼리지",

  // --- 세르비아 ---
  Macva: "마치바 슈프차",

  // --- 스웨덴 ---
  "AFC Malmo": "AFC 말뫼",

  // --- 스위스 ---
  "SC Kriens": "SC 크리엔스",

  // --- 스페인 ---
  "AD Ceuta FC": "AD 세우타",
  "Real Sociedad II": "레알 소시에다드 II",

  // --- 슬로바키아 ---
  "Zemplín Michalovce": "제믈린 미할로프체",

  // --- 아르헨티나 ---
  "Gimnasia Jujuy": "히무나시아 후후이",

  // --- 아제르바이잔 ---
  "Safa Baku": "사파 바쿠",

  // --- 알바니아 ---
  "AF Elbasani": "AF 엘바산",

  // --- 에콰도르 ---
  "Leones del Norte": "레오네스 델 노르테",

  // --- 엘살바도르 ---
  "Municipal Limeño": "무니시팔 리메뇨",

  // --- 오스트리아 ---
  "Rapid Wien II": "라피트 빈 II",

  // --- 온두라스 ---

  // --- 우루과이 ---
  "Central Espanol": "센트랄 에스파뇰",

  // --- 이라크 ---
  Newroz: "네브로즈",

  // --- 이스라엘 ---
  "Hapoel Ramat Gan": "하포엘 라마트간",

  // --- 이집트 ---
  Petrojet: "페트로젯",

  // --- 일본 ---
  "Kataller Toyama": "카타레 도야마",

  // --- 잉글랜드 ---
  Worthing: "워딩",

  // --- 조지아 ---
  Dila: "딜라 고리",
  Gagra: "가그라",

  // --- 중국 ---
  "Chengdu Better City": "청두 룽청",
  "Shaanxi Union": "산시 창안",
  "Sichuan Jiuniu": "쓰촨 지우뉴",

  // --- 체코 ---

  // --- 칠레 ---
  "San Marcos de Arica": "산마르코스 데 아리카",

  // --- 카자흐스탄 ---
  Irtysh: "이르티시",

  // --- 콜롬비아 ---
  "Alianza Valledupar": "알리안사 바예두파르",

  // --- 튀르키예 ---
  "Iğdır FK": "이으드르",

  // --- 파나마 ---
  "Union Cocle": "우니온 코클레",

  // --- 페로 제도 ---
  B71: "B71",
  TB: "TB",

  // --- 포르투갈 ---
  Amarante: "아마란치",

  // --- 폴란드 ---
  "Motor Lublin": "모토르 루블린",
  Podbeskidzie: "포드베스키지에",
};

export function toKoreanTeamName(name: string, overrides?: Record<string, string>): string {
  if (overrides?.[name]) return overrides[name];

  const direct = TEAM_NAME_KO[name];
  if (direct) return direct;

  const trimmed = name.trim();
  const caseInsensitive = Object.keys(TEAM_NAME_KO).find((key) => key.toLowerCase() === trimmed.toLowerCase());
  if (caseInsensitive) return TEAM_NAME_KO[caseInsensitive];

  return name;
}
