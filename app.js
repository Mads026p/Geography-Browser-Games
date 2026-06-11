const allowedCountryNames = new Set([
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "DR Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Republic of the Congo",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Antarctica",
  "Greenland",
  "Kosovo",
  "Western Sahara",
]);

const allowedCountryKeys = new Set([...allowedCountryNames].map(rawCountryKey));

const countrySource = [
  ...(window.COUNTRY_GAME_DATA || []),
  {
    name: "Antarctica",
    officialName: "Antarctica",
    iso2: "AQ",
    iso3: "ATA",
    capital: "South Pole",
    lat: -90,
    lon: 0,
    countryLat: -82,
    countryLon: 0,
    region: "Antarctica",
    population: "No permanent population",
    populationNumber: 0,
    areaKm2: 14000000,
    density: 0,
    clue: "The southernmost continent.",
    slug: "antarctica",
  },
];

const countries = countrySource
  .filter((country) => country.name && country.capital && Number.isFinite(country.lat) && Number.isFinite(country.lon))
  .filter((country) => allowedCountryKeys.has(rawCountryKey(country.name)))
  .map((country) => ({
    ...country,
    ...(country.name === "Western Sahara" ? { lat: 27.15, lon: -13.2 } : {}),
    flag: localIsoFlagPath(country) || country.flag || countryFlagsUrl(country),
  }));

const stage = document.querySelector(".stage");

const countryAliases = new Map([
  ["united states of america", "united states"],
  ["united states", "united states"],
  ["russian federation", "russia"],
  ["republic of korea", "south korea"],
  ["korea south", "south korea"],
  ["democratic people s republic of korea", "north korea"],
  ["korea north", "north korea"],
  ["czech republic", "czechia"],
  ["democratic republic of the congo", "dr congo"],
  ["republic of the congo", "congo"],
  ["congo kinshasa", "dr congo"],
  ["congo brazzaville", "congo"],
  ["dominican rep", "dominican republic"],
  ["w sahara", "western sahara"],
  ["kosovo", "kosovo"],
  ["ivory coast", "cote d ivoire"],
  ["swaziland", "eswatini"],
  ["east timor", "timor leste"],
  ["burma", "myanmar"],
]);

const gameCountryByKey = new Map(countries.flatMap((country) => countryMatchKeys(country).map((key) => [key, country])));
const gameCountryByIso = new Map(countries.map((country) => [country.iso3, country]).filter(([iso]) => iso));
const worldMap = buildWorldMap(window.CUSTOM_COUNTRIES_GEOJSON || window.WORLD_COUNTRIES_GEOJSON);
const continentColors = {
  Africa: "#58a86f",
  Asia: "#49a99a",
  Europe: "#d0a85a",
  "North America": "#6ea8ff",
  "South America": "#8fbd5c",
  Oceania: "#ff9b72",
  Antarctica: "#d7e8ef",
};

const triviaExtras = {
  landmarks: [
    ["France", "Eiffel Tower"],
    ["India", "Taj Mahal"],
    ["China", "Great Wall"],
    ["Italy", "Colosseum"],
    ["Brazil", "Christ the Redeemer"],
    ["Egypt", "Pyramids of Giza"],
    ["Peru", "Machu Picchu"],
    ["Jordan", "Petra"],
    ["Cambodia", "Angkor Wat"],
    ["Greece", "Parthenon"],
    ["United Kingdom", "Stonehenge"],
    ["United States", "Statue of Liberty"],
  ],
  dishes: [
    ["Japan", "sushi"],
    ["Italy", "pizza"],
    ["Mexico", "tacos"],
    ["Spain", "paella"],
    ["Thailand", "pad thai"],
    ["Vietnam", "pho"],
    ["India", "biryani"],
    ["Brazil", "feijoada"],
    ["Turkey", "kebab"],
    ["Morocco", "tagine"],
    ["South Korea", "kimchi"],
    ["Indonesia", "nasi goreng"],
  ],
  cities: [
    ["Turkey", "Istanbul"],
    ["Australia", "Sydney"],
    ["United States", "New York City"],
    ["Brazil", "Rio de Janeiro"],
    ["United Arab Emirates", "Dubai"],
    ["Canada", "Toronto"],
    ["South Africa", "Cape Town"],
    ["India", "Mumbai"],
    ["China", "Shanghai"],
    ["Morocco", "Casablanca"],
    ["Nigeria", "Lagos"],
    ["Switzerland", "Zurich"],
  ],
  timezones: [
    ["United Kingdom", "UTC+0 in winter"],
    ["Denmark", "UTC+1 in winter"],
    ["United States", "UTC-5 to UTC-10"],
    ["India", "UTC+5:30"],
    ["China", "UTC+8"],
    ["Japan", "UTC+9"],
    ["Australia", "UTC+8 to UTC+10"],
    ["Brazil", "UTC-2 to UTC-5"],
    ["South Africa", "UTC+2"],
    ["United Arab Emirates", "UTC+4"],
    ["Argentina", "UTC-3"],
    ["New Zealand", "UTC+12"],
  ],
  carBrands: [
    ["Germany", "Volkswagen"],
    ["Japan", "Toyota"],
    ["United States", "Tesla"],
    ["Italy", "Ferrari"],
    ["South Korea", "Hyundai"],
    ["France", "Renault"],
    ["Sweden", "Volvo"],
    ["United Kingdom", "Rolls-Royce"],
    ["Czechia", "Skoda"],
    ["India", "Tata Motors"],
    ["China", "BYD"],
    ["Romania", "Dacia"],
  ],
  companies: [
    ["Denmark", "LEGO"],
    ["United States", "Apple"],
    ["South Korea", "Samsung"],
    ["Japan", "Nintendo"],
    ["Germany", "Siemens"],
    ["Switzerland", "Nestle"],
    ["Finland", "Nokia"],
    ["Sweden", "IKEA"],
    ["Netherlands", "ASML"],
    ["France", "LVMH"],
    ["China", "Alibaba"],
    ["India", "Infosys"],
  ],
  climates: [
    ["Egypt", "hot desert climate"],
    ["Brazil", "tropical rainforest climate in the Amazon"],
    ["Canada", "subarctic climate across much of the north"],
    ["Norway", "subarctic and oceanic climates"],
    ["Indonesia", "tropical rainforest climate"],
    ["Mongolia", "cold semi-arid steppe climate"],
    ["Spain", "Mediterranean climate"],
    ["Russia", "humid continental and subarctic climates"],
    ["Kenya", "tropical savanna climate"],
    ["Chile", "one of the world's driest desert climates"],
  ],
  tourism: [
    ["France", "one of the world's most visited countries"],
    ["Spain", "a top global beach and city tourism destination"],
    ["Thailand", "a major Southeast Asian tourism hub"],
    ["Mexico", "famous for Cancun and ancient ruins tourism"],
    ["Greece", "famous for island and ancient heritage tourism"],
    ["Turkey", "a major crossroads tourism destination"],
    ["Italy", "a top destination for art, food, and Roman history"],
    ["United Arab Emirates", "famous for luxury tourism in Dubai"],
    ["Egypt", "famous for pyramid and Nile tourism"],
    ["Japan", "known for city, temple, and cherry blossom tourism"],
  ],
  independence: [
    ["United States", "1776"],
    ["India", "1947"],
    ["Brazil", "1822"],
    ["Mexico", "1810"],
    ["Indonesia", "1945"],
    ["Finland", "1917"],
    ["Norway", "1905"],
    ["Ghana", "1957"],
    ["Kenya", "1963"],
    ["Algeria", "1962"],
    ["Ukraine", "1991"],
    ["South Sudan", "2011"],
  ],
  landscapes: [
    ["Egypt", "Nile River"],
    ["Brazil", "Amazon River"],
    ["United States", "Grand Canyon"],
    ["Norway", "Geirangerfjord"],
    ["Chile", "Atacama Desert"],
    ["Nepal", "Mount Everest"],
    ["Australia", "Great Barrier Reef"],
    ["Argentina", "Patagonia"],
    ["South Africa", "Cape of Good Hope"],
    ["Turkey", "Anatolian Peninsula"],
    ["India", "Ganges River"],
    ["Iceland", "Vatnajokull glacier"],
  ],
  mountains: [
    ["Japan", "Mount Fuji"],
    ["Tanzania", "Mount Kilimanjaro"],
    ["Switzerland", "the Matterhorn"],
    ["Argentina", "Aconcagua"],
    ["United States", "Denali"],
    ["Russia", "Mount Elbrus"],
    ["Indonesia", "Mount Bromo"],
    ["New Zealand", "Aoraki / Mount Cook"],
  ],
  rivers: [
    ["Egypt", "the Nile"],
    ["Brazil", "the Amazon"],
    ["China", "the Yangtze"],
    ["India", "the Ganges"],
    ["United States", "the Mississippi"],
    ["Germany", "the Rhine"],
    ["DR Congo", "the Congo River"],
    ["Vietnam", "the Mekong"],
  ],
  nationalParks: [
    ["United States", "Yellowstone National Park"],
    ["Tanzania", "Serengeti National Park"],
    ["Canada", "Banff National Park"],
    ["Croatia", "Plitvice Lakes National Park"],
    ["South Africa", "Kruger National Park"],
    ["Chile", "Torres del Paine National Park"],
    ["Australia", "Kakadu National Park"],
    ["Nepal", "Sagarmatha National Park"],
  ],
};

const canvas = document.querySelector("#globe");
const ctx = canvas.getContext("2d");
const nightCanvas = document.createElement("canvas");
const nightCtx = nightCanvas.getContext("2d");
const timezoneCanvas = document.createElement("canvas");
const timezoneCtx = timezoneCanvas.getContext("2d");
const globeZone = document.querySelector(".globe-zone");
const modeButtons = document.querySelectorAll(".mode-card");
const modeContent = document.querySelector("#mode-content");
const challengeTitle = document.querySelector("#challenge-title");
const modeKicker = document.querySelector("#mode-kicker");
const feedback = document.querySelector("#feedback");
const scoreEl = document.querySelector("#score");
const streakEl = document.querySelector("#streak");
const bestEl = document.querySelector("#best");
const hoverLabel = document.querySelector("#hover-label");
const targetDistance = document.querySelector("#target-distance");
const globeHud = document.querySelector(".globe-hud");
const waterInfoPopup = document.querySelector("#water-info-popup");

const languageChallenges = [
  { language: "Spanish", family: "Romance", region: "Europe and the Americas", continent: "Europe", sentence: "El mundo esta lleno de lugares sorprendentes." },
  { language: "French", family: "Romance", region: "Europe, Africa and Canada", continent: "Europe", sentence: "Le monde est rempli de lieux surprenants." },
  { language: "German", family: "Germanic", region: "Central Europe", continent: "Europe", sentence: "Die Welt ist voller erstaunlicher Orte." },
  { language: "Danish", family: "Germanic", region: "Northern Europe", continent: "Europe", sentence: "Verden er fuld af overraskende steder." },
  { language: "Swedish", family: "Germanic", region: "Northern Europe", continent: "Europe", sentence: "Varlden ar full av fantastiska platser." },
  { language: "Italian", family: "Romance", region: "Southern Europe", continent: "Europe", sentence: "Il mondo e pieno di luoghi sorprendenti." },
  { language: "Portuguese", family: "Romance", region: "Europe and South America", continent: "South America", sentence: "O mundo esta cheio de lugares surpreendentes." },
  { language: "Dutch", family: "Germanic", region: "Western Europe", continent: "Europe", sentence: "De wereld zit vol verrassende plekken." },
  { language: "Polish", family: "Slavic", region: "Central Europe", continent: "Europe", sentence: "Swiat jest pelen niezwyklych miejsc." },
  { language: "Czech", family: "Slavic", region: "Central Europe", continent: "Europe", sentence: "Svet je plny uzasnych mist." },
  { language: "Finnish", family: "Uralic", region: "Northern Europe", continent: "Europe", sentence: "Maailma on taynna ihmeellisia paikkoja." },
  { language: "Hungarian", family: "Uralic", region: "Central Europe", continent: "Europe", sentence: "A vilag tele van csodalatos helyekkel." },
  { language: "Greek", family: "Hellenic", region: "Southern Europe", continent: "Europe", sentence: "O kosmos einai gematos ekpliktika meri." },
  { language: "Romanian", family: "Romance", region: "Eastern Europe", continent: "Europe", sentence: "Lumea este plina de locuri uimitoare." },
  { language: "Turkish", family: "Turkic", region: "Anatolia", continent: "Asia", sentence: "Dunya sasirtici yerlerle doludur." },
  { language: "Indonesian", family: "Austronesian", region: "Southeast Asia", continent: "Asia", sentence: "Dunia penuh dengan tempat-tempat menakjubkan." },
  { language: "Vietnamese", family: "Austroasiatic", region: "Southeast Asia", continent: "Asia", sentence: "The gioi co rat nhieu noi tuyet voi." },
  { language: "Japanese", family: "Japonic", region: "East Asia", continent: "Asia", sentence: "Sekai wa odoroki no basho de afurete imasu." },
  { language: "Korean", family: "Koreanic", region: "East Asia", continent: "Asia", sentence: "Sesangeun nollaun gosdeullo gadeukhamnida." },
  { language: "Hindi", family: "Indo-Aryan", region: "South Asia", continent: "Asia", sentence: "Duniya adbhut jagahon se bhari hui hai." },
  { language: "Arabic", family: "Semitic", region: "Middle East and North Africa", continent: "Asia", sentence: "Al-alam مليء bil-amakin al-mudhila." },
  { language: "Persian", family: "Iranian", region: "Western Asia", continent: "Asia", sentence: "Jahan por az makan-haye shegeft-angiz ast." },
  { language: "Thai", family: "Kra-Dai", region: "Southeast Asia", continent: "Asia", sentence: "Lok tem pai duai sathanthi thi na pralat chai." },
  { language: "Swahili", family: "Bantu", region: "East Africa", continent: "Africa", sentence: "Dunia imejaa maeneo ya kushangaza." },
  { language: "Afrikaans", family: "Germanic", region: "Southern Africa", continent: "Africa", sentence: "Die wereld is vol wonderlike plekke." },
  { language: "Amharic", family: "Semitic", region: "East Africa", continent: "Africa", sentence: "Alem betam yemigeremu botawoch temtoal." },
  { language: "Yoruba", family: "Volta-Niger", region: "West Africa", continent: "Africa", sentence: "Aye kun fun awon ibi iyanu." },
  { language: "Zulu", family: "Bantu", region: "Southern Africa", continent: "Africa", sentence: "Umhlaba ugcwele izindawo ezimangalisayo." },
  { language: "Quechua", family: "Quechuan", region: "Andean South America", continent: "South America", sentence: "Kay pacha sumaq kitikunawan hunt'a kashan." },
  { language: "Guarani", family: "Tupian", region: "South America", continent: "South America", sentence: "Yvy henyhe tenda pora ha hechapyrava rehe." },
  { language: "Haitian Creole", family: "French Creole", region: "Caribbean", continent: "North America", sentence: "Mond lan plen ak kote etonan." },
  { language: "Navajo", family: "Athabaskan", region: "North America", continent: "North America", sentence: "Nahasdzáán nidaalnishgo bee ahoot'i'." },
  { language: "Maori", family: "Austronesian", region: "New Zealand", continent: "Oceania", sentence: "Ki tonu te ao i nga wahi whakamiharo." },
  { language: "Samoan", family: "Austronesian", region: "Polynesia", continent: "Oceania", sentence: "Ua tumu le lalolagi i nofoaga ofoofogia." },
];

const landmarkData = [
  ["Eiffel Tower", 48.8584, 2.2945, "Paris, France", "Eiffel_Tower,_Paris_5_August_2014.jpg", "Built for the 1889 World's Fair, it was once criticized by many prominent Parisian artists."],
  ["Great Pyramid of Giza", 29.9792, 31.1342, "Giza, Egypt", "Kheops-Pyramid.jpg", "The oldest of the Seven Wonders of the Ancient World is also the only one still largely intact."],
  ["Statue of Liberty", 40.6892, -74.0445, "New York, United States", "Statue_of_Liberty_7.jpg", "France gifted the copper statue to the United States in the nineteenth century."],
  ["Machu Picchu", -13.1631, -72.545, "Peru", "Machu_Picchu,_Peru.jpg", "This fifteenth-century Inca citadel sits about 2,430 meters above sea level."],
  ["Sydney Opera House", -33.8568, 151.2153, "Sydney, Australia", "Sydney_Opera_House_Sails.jpg", "Its roof is formed from sections of the same enormous imaginary sphere."],
  ["Taj Mahal", 27.1751, 78.0421, "Agra, India", "Taj_Mahal,_Agra,_India_edit3.jpg", "The marble mausoleum was commissioned by Mughal emperor Shah Jahan."],
  ["Christ the Redeemer", -22.9519, -43.2105, "Rio de Janeiro, Brazil", "Cristo_Redentor_-_Rio_de_Janeiro,_Brasil.jpg", "The Art Deco statue stands on the summit of Corcovado mountain."],
  ["Mount Everest", 27.9881, 86.925, "Nepal-China border", "Mount_Everest_as_seen_from_Drukair2_PLW_edit.jpg", "Earth's highest point above sea level rises along the Nepal-China border."],
  ["Grand Canyon", 36.1069, -112.1129, "Arizona, United States", "Grand_Canyon_view_from_Pima_Point_2010.jpg", "The Colorado River exposed rock layers spanning nearly two billion years."],
  ["Angkor Wat", 13.4125, 103.867, "Cambodia", "Angkor_Wat.jpg", "Originally a Hindu temple, it gradually became an important Buddhist site."],
  ["Petra", 30.3285, 35.4444, "Jordan", "The_Treasury,_Petra,_Jordan.jpg", "The Nabataean city is famous for monumental buildings carved into rose-colored rock."],
  ["Burj Khalifa", 25.1972, 55.2744, "Dubai, United Arab Emirates", "Burj_Khalifa.jpg", "At 828 meters, it has been the world's tallest building since 2010."],
  ["Colosseum", 41.8902, 12.4922, "Rome, Italy", "Colosseum_in_Rome,_Italy_-_April_2007.jpg", "The Roman amphitheater could accommodate tens of thousands of spectators."],
  ["Great Wall of China", 40.4319, 116.5704, "China", "The_Great_Wall_of_China_at_Jinshanling-edit.jpg", "The wall is a network of fortifications built and rebuilt by several Chinese dynasties."],
  ["Moai of Rapa Nui", -27.125, -109.277, "Easter Island, Chile", "Moai_Rano_raraku.jpg", "Hundreds of monumental figures were carved by the Rapa Nui people from volcanic stone."],
  ["Chichen Itza", 20.6843, -88.5678, "Yucatan, Mexico", "Chichen_Itza_3.jpg", "El Castillo's stairways and terraces reflect Maya astronomical and calendrical knowledge."],
  ["Sagrada Familia", 41.4036, 2.1744, "Barcelona, Spain", "Sagrada_Familia_01.jpg", "Antoni Gaudi's basilica has been under construction since 1882."],
  ["Table Mountain", -33.9628, 18.4098, "Cape Town, South Africa", "Table_Mountain_DanieVDM.jpg", "Its flat summit overlooks Cape Town and supports unusually rich plant diversity."],
  ["Golden Gate Bridge", 37.8199, -122.4783, "San Francisco, United States", "Golden_Gate_Bridge_as_seen_from_Battery_East.jpg", "The suspension bridge spans the Golden Gate strait between San Francisco and Marin County."],
  ["CN Tower", 43.6426, -79.3871, "Toronto, Canada", "CN_Tower_2018.jpg", "The communications tower was the world's tallest free-standing structure for more than three decades."],
  ["Teotihuacan", 19.6925, -98.8438, "Mexico", "Teotihuacan,_Pyramid_of_the_Sun.jpg", "The ancient city contains the Pyramid of the Sun and the Avenue of the Dead."],
  ["Panama Canal", 9.08, -79.68, "Panama", "Panama_Canal_Gatun_Locks.jpg", "The canal connects the Atlantic and Pacific oceans through a system of locks and artificial lakes."],
  ["Brandenburg Gate", 52.5163, 13.3777, "Berlin, Germany", "Brandenburger_Tor_abends.jpg", "The eighteenth-century gate became a symbol of German division and reunification."],
  ["Acropolis of Athens", 37.9715, 23.7267, "Athens, Greece", "The_Parthenon_in_Athens.jpg", "The hilltop complex includes the Parthenon and other monuments of classical Athens."],
  ["Stonehenge", 51.1789, -1.8262, "Wiltshire, United Kingdom", "Stonehenge2007_07_30.jpg", "The prehistoric stone circle was constructed in several stages over many centuries."],
  ["Neuschwanstein Castle", 47.5576, 10.7498, "Bavaria, Germany", "Schloss_Neuschwanstein_2013.jpg", "King Ludwig II's nineteenth-century castle inspired later fairy-tale architecture."],
  ["Mount Fuji", 35.3606, 138.7274, "Japan", "Mt._Fuji_from_Mt._Ninoto.jpg", "Japan's highest mountain is an active stratovolcano and a major cultural symbol."],
  ["Forbidden City", 39.9163, 116.3972, "Beijing, China", "Forbidden_City_Beijing_Shenwumen_Gate.JPG", "The vast palace complex served as the imperial center of China for nearly five centuries."],
  ["Marina Bay Sands", 1.2834, 103.8607, "Singapore", "Marina_Bay_Sands_in_the_evening_-_20101120.jpg", "Three towers support a rooftop sky park overlooking Singapore's Marina Bay."],
  ["Borobudur", -7.6079, 110.2038, "Central Java, Indonesia", "Borobudur-Nothwest-view.jpg", "The ninth-century Buddhist monument is formed from stacked platforms covered with relief panels and stupas."],
  ["Ha Long Bay", 20.9101, 107.1839, "Vietnam", "Ha_Long_Bay_in_2019.jpg", "Thousands of limestone islands and pillars rise from the Gulf of Tonkin."],
  ["Serengeti National Park", -2.3333, 34.8333, "Tanzania", "Serengeti_Landscape.jpg", "The ecosystem is famous for its immense seasonal migration of wildebeest and zebra."],
  ["Victoria Falls", -17.9243, 25.8572, "Zambia-Zimbabwe border", "Victoria_Falls_2012.jpg", "The Zambezi River plunges across one of the world's widest continuous curtains of falling water."],
  ["Lalibela", 12.0317, 39.0476, "Ethiopia", "Bete_Giyorgis_03.jpg", "Its medieval churches were carved downward into volcanic rock."],
  ["Hassan II Mosque", 33.6084, -7.6326, "Casablanca, Morocco", "Hassan_II_Mosque_Casablanca.jpg", "The mosque's minaret rises above the Atlantic shoreline of Casablanca."],
  ["Uluru", -25.3444, 131.0369, "Northern Territory, Australia", "Uluru_Australia.jpg", "The sandstone monolith is sacred to the Anangu people and changes color dramatically with the light."],
  ["Milford Sound", -44.6716, 167.9256, "New Zealand", "Milford_Sound_02.jpg", "Steep glacially carved cliffs rise directly from the fjord in Fiordland."],
  ["Great Barrier Reef", -18.2871, 147.6992, "Australia", "Great_Barrier_Reef,_Australia.jpg", "The world's largest coral reef system stretches along Queensland's coast."],
  ["Torres del Paine", -51.0, -73.0, "Chile", "Torres_del_Paine_y_cuernos_del_Paine,_montaje.jpg", "Granite towers, glaciers, lakes, and steppe define this Patagonian national park."],
  ["Iguazu Falls", -25.6953, -54.4367, "Argentina-Brazil border", "Iguazu_Décembre_2007_-_Panorama_7.jpg", "Hundreds of cascades form a broad waterfall system on the Iguazu River."],
  ["Salar de Uyuni", -20.1338, -67.4891, "Bolivia", "Salar_de_Uyuni,_Bolivia.jpg", "The world's largest salt flat becomes a vast natural mirror during the wet season."],
  ["Galapagos Islands", -0.9538, -90.9656, "Ecuador", "Galapagos-satellite-2002.jpg", "The volcanic archipelago helped inspire Charles Darwin's ideas about evolution."],
  ["Geographic South Pole", -90, 0, "Antarctica", "Ceremonial_South_Pole.jpg", "The geographic pole marks Earth's southern rotational axis and is reached by every line of longitude."],
];

const offlineUsdRates = {
  EUR: 1.08, GBP: 1.27, DKK: 0.145, SEK: 0.095, NOK: 0.094, CHF: 1.11, PLN: 0.25, CZK: 0.043,
  HUF: 0.00275, RON: 0.217, BGN: 0.552, ISK: 0.0072, TRY: 0.031, RUB: 0.011, UAH: 0.025,
  CAD: 0.73, MXN: 0.059, BRL: 0.20, ARS: 0.0011, CLP: 0.00105, COP: 0.00025, PEN: 0.27,
  CNY: 0.138, JPY: 0.0067, KRW: 0.00074, INR: 0.012, PKR: 0.0036, BDT: 0.0085, IDR: 0.000061,
  MYR: 0.212, THB: 0.028, VND: 0.000039, PHP: 0.017, SGD: 0.74, AUD: 0.66, NZD: 0.61,
  ZAR: 0.055, EGP: 0.020, MAD: 0.10, AED: 0.2723, SAR: 0.2667, ILS: 0.27, JOD: 1.41,
  KWD: 3.25, QAR: 0.2747, NGN: 0.00065, KES: 0.0077, GHS: 0.064, ETB: 0.008,
  XOF: 0.00165, XAF: 0.00165, XCD: 0.37, USD: 1,
};

const FLIGHT_DEFAULT_SPEEDS = Object.freeze({ slow: 50_000, base: 250_000, boost: 750_000 });

const state = {
  mode: "free",
  target: countries[0],
  options: [],
  distancePair: [countries[0], countries[1]],
  freeSelections: [],
  compareLines: false,
  showNight: false,
  fullNight: false,
  showElevation: false,
  suppressNextClick: false,
  gameScores: Object.fromEntries(
    ["free", "hunt", "distance", "flags", "trivia", "outline", "viewfinder", "airports", "language", "traverse", "conquest", "puzzle"].map((mode) => [
      mode,
      { score: 0, streak: 0, best: Number(localStorage.getItem(`geosphere-best-${mode}`) || 0) },
    ]),
  ),
  yaw: -0.7,
  pitch: 0.18,
  roll: 0,
  zoom: 1,
  hover: null,
  selected: null,
  outlineSuggestions: [],
  outlineDeck: [],
  cursorGeo: null,
  showEquator: false,
  showGreenwich: false,
  showTimezones: false,
  showAirports: false,
  showAllCapitals: false,
  showCountryNames: false,
  showWaterBodies: false,
  showLandmarks: false,
  freeOptionsOpen: false,
  freeOptionsPinned: false,
  languageOptionsOpen: false,
  languageOptionsPinned: false,
  languageContinents: ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"],
  northUp: localStorage.getItem("geosphere-north-up") !== "false",
  markers: JSON.parse(localStorage.getItem("geosphere-markers") || "[]"),
  activeLandmark: null,
  timezoneBoundaries: null,
  timezoneGrid: null,
  timezoneLoading: false,
  dragging: false,
  answered: false,
  correctAnswer: "",
  huntHints: 0,
  huntWrong: 0,
  stats: {
    flags: { correct: 0, total: 0 },
    trivia: { correct: 0, total: 0 },
    outline: { correct: 0, total: 0 },
    language: { correct: 0, total: 0 },
    airports: { correct: 0, total: 0 },
  },
  bestDistanceGuess: null,
  triviaDeck: [],
  triviaTypeQueue: [],
  lastTriviaType: "",
  autoNext: localStorage.getItem("geosphere-auto-next") === "true",
  autoNextTimer: null,
  flagHard: false,
  flagReveal: 0,
  flagSuggestionIndex: -1,
  flagCovers: [],
  distanceHistory: [],
  viewHints: 0,
  viewCountries: [],
  viewShowBorders: false,
  viewShowCapitals: false,
  viewAltitude: 2_800,
  viewNextAltitude: 2_800,
  viewCorrectCountry: null,
  viewWrongCountry: null,
  viewGuessCorrect: null,
  viewFocusGuess: false,
  viewHardStart: localStorage.getItem("geosphere-view-hard") === "true",
  viewHardInitialized: false,
  viewFrameCorners: [],
  viewFrameOutline: false,
  viewInitialRoll: 0,
  languageHint: 0,
  airportPair: [],
  borderGraph: null,
  traverse: {
    start: null,
    target: null,
    route: [],
    invalid: 0,
    hints: 0,
    suggestions: [],
    suggestionIndex: -1,
    hintCountry: null,
    gaveUp: false,
    totalHints: 0,
    showPlayerLines: true,
    shortestShown: false,
  },
  conquest: null,
  puzzle: null,
  globeFrame: null,
  renderDirty: true,
  flight: {
    active: false,
    lat: 51.16,
    lon: 10.45,
    heading: 90,
    currentSpeed: FLIGHT_DEFAULT_SPEEDS.base,
    speeds: { ...FLIGHT_DEFAULT_SPEEDS },
    turn: 0,
    boost: false,
    slow: false,
    viewAngle: 45,
    altitude: 120,
    totalDistance: 0,
    lastFrame: 0,
    exitView: null,
    cameraBlend: 0,
    chaseZoom: 1.2,
    position: null,
    tangent: null,
    paused: false,
    trail: [],
    showTrail: false,
    optionsOpen: false,
    optionsPinned: false,
    pauseView: null,
    spectatorNorthUp: false,
  },
  orientationTarget: null,
  freeMatrix: null,
  visibleWaterLabels: [],
};

function init() {
  bindEvents();
  resetGlobeView();
  newRound("free");
  resizeCanvas();
  startGlobeLoop();
}

function bindEvents() {
  const autoNext = document.querySelector("#auto-next");
  autoNext.checked = state.autoNext;
  autoNext.addEventListener("change", () => {
    state.autoNext = autoNext.checked;
    localStorage.setItem("geosphere-auto-next", String(state.autoNext));
  });
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("click", requestGlobeRender);
  document.addEventListener("change", requestGlobeRender);
  window.addEventListener("keydown", requestGlobeRender);
  window.addEventListener("keydown", (event) => {
    const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
    if (event.key === "Escape" && state.mode === "free") clearFreeroamSelections();
    if (!typing && event.key.toLowerCase() === "r" && usesGlobe(state.mode) && !state.flight.active) resetGlobeView();
    if (!typing && event.key.toLowerCase() === "c" && state.mode === "free" && state.freeSelections.length >= 2) clearFreeroamSelections();
    if (!typing && ["free", "airports"].includes(state.mode) && state.flight.active) {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") state.flight.turn = -1;
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") state.flight.turn = 1;
      if (event.key.toLowerCase() === "w") state.flight.boost = true;
      if (event.key.toLowerCase() === "s") state.flight.slow = true;
      if (event.key.toLowerCase() === "p" && state.mode === "airports" && !event.repeat) toggleFlightPause();
    }
    if (!typing && event.key.toLowerCase() === "n" && !["free", "conquest", "puzzle"].includes(state.mode)) newRound(state.mode);
    if (!typing && event.key === "Enter" && state.answered) {
      const continueButton = modeContent.querySelector("#continue-round");
      if (continueButton) continueButton.click();
    }
  });
  window.addEventListener("keyup", (event) => {
    if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key)) state.flight.turn = 0;
    if (event.key.toLowerCase() === "w") state.flight.boost = false;
    if (event.key.toLowerCase() === "s") state.flight.slow = false;
  });
  document.querySelector("#next-round").addEventListener("click", () => newRound(state.mode));
  document.querySelector("#reset-view").addEventListener("click", () => {
    if (!state.flight.active) resetGlobeView();
  });
  bindLineToggle("#toggle-equator", "showEquator");
  bindLineToggle("#toggle-greenwich", "showGreenwich");

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => newRound(button.dataset.mode));
  });

  let dragging = false;
  let rolling = false;
  let grabbedGeo = null;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener("pointerdown", (event) => {
    closeFreeroamOptions();
    hideWaterInfo();
    if (state.mode === "viewfinder" || (state.flight.active && !state.flight.paused)) return;
    if (event.button === 1 && !state.northUp) {
      event.preventDefault();
      rolling = true;
      dragging = false;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    if (event.button !== 0) return;
    dragging = true;
    state.dragging = true;
    state.hover = null;
    lastX = event.clientX;
    lastY = event.clientY;
    const metrics = globeMetrics();
    grabbedGeo = screenToLatLon(event.offsetX, event.offsetY, metrics.cx, metrics.cy, metrics.radius);
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (rolling) {
      const dx = event.clientX - lastX;
      state.freeMatrix = orthonormalizeMatrix3(
        multiplyMatrix3(rotationMatrixZ(dx * 0.008), state.freeMatrix || cameraMatrixForEuler(state.yaw, state.pitch, state.roll)),
      );
      lastX = event.clientX;
    } else if (dragging) {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.hypot(dx, dy) > 1) state.suppressNextClick = true;
      if (!state.northUp) {
        const metrics = globeMetrics();
        state.orientationTarget = null;
        if (!state.freeMatrix) state.freeMatrix = cameraMatrixForEuler(state.yaw, state.pitch, state.roll);
        const horizontal = rotationMatrixY((dx / Math.max(1, metrics.radius)) * 1.35);
        const vertical = rotationMatrixX((dy / Math.max(1, metrics.radius)) * 1.35);
        state.freeMatrix = orthonormalizeMatrix3(multiplyMatrix3(vertical, multiplyMatrix3(horizontal, state.freeMatrix)));
      } else if (grabbedGeo) {
        rotateGlobeAnchor(grabbedGeo, event.offsetX, event.offsetY);
        if (state.orientationTarget) {
          state.orientationTarget.yaw = state.yaw;
          state.orientationTarget.pitch = state.pitch;
        }
      }
      lastX = event.clientX;
      lastY = event.clientY;
    }
    const metrics = globeMetrics();
    state.cursorGeo = screenToLatLon(event.offsetX, event.offsetY, metrics.cx, metrics.cy, metrics.radius);
    state.hover =
      dragging || state.mode === "viewfinder" || (state.mode === "traverse" && !state.answered)
        ? null
        : countryAt(event.offsetX, event.offsetY);
    hoverLabel.textContent = formatHoverText();
    requestGlobeRender();
  });

  canvas.addEventListener("pointerup", (event) => {
    dragging = false;
    rolling = false;
    state.dragging = false;
    grabbedGeo = null;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("click", (event) => {
    if (state.mode === "viewfinder") return;
    closeFreeroamOptions();
    const water = state.mode === "free" ? waterLabelAt(event.offsetX, event.offsetY) : null;
    if (water) {
      showWaterInfo(water, event.offsetX, event.offsetY);
      return;
    }
    hideWaterInfo();
    const mapMarker = mapMarkerAt(event.offsetX, event.offsetY);
    if (mapMarker) {
      if (mapMarker.kind === "landmark") {
        state.activeLandmark = mapMarker;
        showMapInfo(
          `<strong>${mapMarker.name}</strong><span>${mapMarker.place}</span><span id="landmark-info">${mapMarker.info || ""}</span><img class="landmark-preview" id="landmark-preview" src="${mapMarker.image}" alt="${mapMarker.name}">`,
          event.offsetX,
          event.offsetY,
        );
        hydrateLandmarkDetails(mapMarker);
      } else if (mapMarker.kind === "airport") {
        showMapInfo(`<strong>${mapMarker.code}</strong><span>${mapMarker.fullName}</span>`, event.offsetX, event.offsetY);
      } else if (mapMarker.kind === "user") {
        const name = window.prompt("Rename marker, or leave blank to delete it", mapMarker.name);
        if (name === null) return;
        if (!name.trim()) state.markers = state.markers.filter((marker) => marker.id !== mapMarker.id);
        else mapMarker.name = name.trim();
        saveMarkers();
        renderFreeroamPanel();
      }
      return;
    }
    if (state.dragging || state.suppressNextClick) {
      state.suppressNextClick = false;
      return;
    }
    const country = countryAt(event.offsetX, event.offsetY);
    if (!country) {
      if (state.mode === "free") clearFreeroamSelections();
      if (state.mode === "airports") state.selected = null;
      return;
    }
    const gameCountry = country.gameCountry || country;
    if (state.mode === "traverse") return;
    if (state.mode === "conquest") {
      handleConquestCountryClick(gameCountry);
      return;
    }
    if (state.mode === "free") selectFreeroamCountry(gameCountry, event.ctrlKey || event.metaKey);
    if (state.mode === "airports") state.selected = sameCountry(state.selected, gameCountry) ? null : gameCountry;
    if (state.mode === "hunt") checkHunt(country);
  });

  canvas.addEventListener("contextmenu", (event) => {
    if (state.mode !== "free" || state.flight.active) return;
    event.preventDefault();
    const metrics = globeMetrics();
    const point = screenToLatLon(event.offsetX, event.offsetY, metrics.cx, metrics.cy, metrics.radius);
    if (!point) return;
    const name = window.prompt("Marker name", `Marker ${state.markers.length + 1}`);
    if (!name) return;
    state.markers.push({ id: crypto.randomUUID?.() || String(Date.now()), name, lat: point.lat, lon: point.lon });
    saveMarkers();
    renderFreeroamPanel();
  });
  canvas.addEventListener("auxclick", (event) => {
    if (event.button === 1) event.preventDefault();
  });

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      closeFreeroamOptions();
      if (["free", "airports"].includes(state.mode) && state.flight.active && !state.flight.paused) {
        state.flight.chaseZoom = clamp(state.flight.chaseZoom * Math.exp(-event.deltaY * 0.0015), 0.3, 5.5);
      } else if (state.mode === "viewfinder") {
        return;
      } else {
        state.zoom = clamp(state.zoom * Math.exp(-event.deltaY * 0.0018), 0.72, 32);
      }
      requestGlobeRender();
    },
    { passive: false },
  );
}

function bindLineToggle(selector, stateKey) {
  const button = document.querySelector(selector);
  button.classList.toggle("active", state[stateKey]);
  button.setAttribute("aria-pressed", String(state[stateKey]));
  button.addEventListener("click", () => {
    state[stateKey] = !state[stateKey];
    button.classList.toggle("active", state[stateKey]);
    button.setAttribute("aria-pressed", String(state[stateKey]));
  });
}

function closeFreeroamOptions() {
  if (state.mode === "free" && !state.freeOptionsPinned) {
    state.freeOptionsOpen = false;
    const menu = modeContent.querySelector("#freeroam-options");
    if (menu) menu.open = false;
  }
  if (["free", "airports"].includes(state.mode) && !state.flight.optionsPinned) {
    state.flight.optionsOpen = false;
    const menu = modeContent.querySelector("#flight-options");
    if (menu) menu.open = false;
  }
}

function transitionToNorthUp() {
  const metrics = globeMetrics();
  const center = screenToLatLon(metrics.cx, metrics.cy, metrics.cx, metrics.cy, metrics.radius);
  if (!center) {
    state.northUp = true;
    state.freeMatrix = null;
    return;
  }
  const northPoint = destinationPoint(center.lat, center.lon, 0, 0.5);
  const northCamera = cameraPoint(northPoint.lat, northPoint.lon);
  state.yaw = -toRad(center.lon);
  state.pitch = toRad(center.lat);
  state.roll = Math.atan2(-northCamera.x, northCamera.y);
  state.northUp = true;
  state.freeMatrix = null;
  state.orientationTarget = { yaw: state.yaw, pitch: state.pitch, roll: 0 };
}

function newRound(mode) {
  clearTimeout(state.autoNextTimer);
  hideWaterInfo();
  const previousMode = state.mode;
  if (previousMode !== mode) resetModeSession(previousMode);
  state.mode = mode;
  globeHud.hidden = false;
  stage.dataset.mode = mode;
  state.answered = false;
  state.selected = null;
  state.correctAnswer = "";
  state.visibleMapMarkers = [];
  modeContent.innerHTML = "";
  if (mode === "flags" && previousMode !== "flags") state.flagHard = false;
  hoverLabel.textContent = mode === "viewfinder" ? "Borderless view" : "Drag to rotate, wheel to zoom";
  modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  document.querySelector("#reset-view").textContent = mode === "distance" ? "Reset view (r)" : "Reset Globe (r)";
  document.querySelector("#reset-view").disabled = false;
  feedback.className = "feedback";
  feedback.textContent = "Pick an answer to begin.";
  if (usesGlobe(mode) && previousMode !== mode) resetGlobeView();
  if (mode === "distance") setCoordinateLines(false, false);

  if (mode === "hunt") setupHunt();
  if (mode === "free") setupFreeroam();
  if (mode === "flags") setupFlags();
  if (mode === "distance") setupDistance();
  if (mode === "trivia") setupTrivia();
  if (mode === "outline") setupOutline();
  if (mode === "viewfinder") setupViewfinder();
  if (mode === "airports") setupAirports();
  if (mode === "language") setupLanguage();
  if (mode === "traverse") setupTraverse();
  if (mode === "conquest") setupConquest();
  if (mode === "puzzle") setupContinentPuzzle();
  document.querySelector("#auto-next-control").hidden = ["free", "conquest", "puzzle"].includes(mode);
  document.querySelector("#next-round").hidden = ["free", "conquest", "puzzle"].includes(mode);
  if (usesGlobe(mode)) startGlobeLoop();
  else stopGlobeLoop();
  updateScore();
  requestAnimationFrame(() => {
    modeContent.querySelector("#outline-guess, #view-guess, #traverse-guess, #flag-guess, #distance-guess")?.focus();
  });
}

function startGlobeLoop() {
  if (!usesGlobe(state.mode) || state.globeFrame !== null) return;
  state.renderDirty = true;
  state.globeFrame = requestAnimationFrame(draw);
}

function requestGlobeRender() {
  if (!usesGlobe(state.mode)) return;
  state.renderDirty = true;
  if (state.globeFrame === null) state.globeFrame = requestAnimationFrame(draw);
}

function stopGlobeLoop() {
  if (state.globeFrame !== null) cancelAnimationFrame(state.globeFrame);
  state.globeFrame = null;
}

function resetModeSession(mode) {
  const score = state.gameScores[mode];
  if (score) {
    score.score = 0;
    score.streak = 0;
  }
  if (state.stats[mode]) {
    state.stats[mode].correct = 0;
    state.stats[mode].total = 0;
  }
  if (mode === "distance") state.bestDistanceGuess = null;
  if (mode === "trivia") state.triviaDeck = [];
  if (mode === "trivia") state.triviaTypeQueue = [];
  if (mode === "trivia") state.lastTriviaType = "";
  if (mode === "distance") state.distanceHistory = [];
  if (mode === "viewfinder") {
    state.viewAltitude = 2_800;
    state.viewNextAltitude = 2_800;
    state.viewHardInitialized = false;
  }
  if (mode === "free" || mode === "airports") {
    state.flight.active = false;
    state.flight.turn = 0;
    state.flight.boost = false;
    state.flight.slow = false;
    state.flight.paused = false;
    state.flight.trail = [];
    state.flight.cameraBlend = 0;
    window.planeRenderer?.setVisible(false);
  }
}

function usesGlobe(mode) {
  return !["flags", "trivia", "outline", "language", "puzzle"].includes(mode);
}

function rotateGlobeAnchor(anchor, x, y) {
  const { cx, cy, radius } = globeMetrics();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = screenToLatLon(x, y, cx, cy, radius);
    if (!current) return;
    let lonError = current.lon - anchor.lon;
    while (lonError > 180) lonError -= 360;
    while (lonError < -180) lonError += 360;
    state.yaw += toRad(lonError);
    state.pitch += toRad(anchor.lat - current.lat);
    if (state.northUp) state.pitch = clamp(state.pitch, -Math.PI / 2, Math.PI / 2);
    else normalizeFreeGlobeOrientation();
  }
}

function normalizeFreeGlobeOrientation() {
  if (state.pitch > Math.PI / 2) {
    state.pitch = Math.PI - state.pitch;
    state.yaw += Math.PI;
    state.roll += Math.PI;
  } else if (state.pitch < -Math.PI / 2) {
    state.pitch = -Math.PI - state.pitch;
    state.yaw += Math.PI;
    state.roll += Math.PI;
  }
  state.roll = normalizeAngle(state.roll);
}

function resetGlobeView() {
  if (state.mode === "free") {
    state.compareLines = false;
    state.showNight = false;
    state.fullNight = false;
    state.showElevation = false;
    state.showTimezones = false;
    state.showAirports = false;
    state.showAllCapitals = false;
    state.showCountryNames = false;
    state.showWaterBodies = false;
    state.showLandmarks = false;
    state.freeOptionsOpen = false;
    state.freeOptionsPinned = false;
    state.flight.optionsOpen = false;
    state.flight.optionsPinned = false;
    hideWaterInfo();
    renderFreeroamPanel();
  }
  state.roll = 0;
  state.flight.cameraBlend = 0;
  state.flight.boost = false;
  if (state.mode === "distance" && state.distancePair?.length === 2) {
    const [a, b] = state.distancePair;
    const midpoint = greatCirclePoints(a.lat, a.lon, b.lat, b.lon, 2)[1];
    focusLatLon(midpoint, distanceStartZoom(distanceKm(a, b)));
  } else {
    focusLatLon({ lat: 51.16, lon: 10.45 }, 1);
  }
  setCoordinateLines(false, false);
}

function setCoordinateLines(equator, greenwich) {
  state.showEquator = equator;
  state.showGreenwich = greenwich;
  [["#toggle-equator", equator], ["#toggle-greenwich", greenwich]].forEach(([selector, active]) => {
    const button = document.querySelector(selector);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setupFreeroam() {
  modeKicker.textContent = "Freeroam";
  challengeTitle.textContent = "Explore the globe";
  targetDistance.textContent = `${countries.length} countries`;
  state.freeSelections = [];
  state.selected = null;
  renderFreeroamPanel();
  feedback.textContent = "Click a country to inspect it. Hold Ctrl while clicking another country to compare.";
}

function setupHunt() {
  state.target = randomCountry();
  state.correctAnswer = state.target.name;
  state.huntHints = 0;
  state.huntWrong = 0;
  modeKicker.textContent = "Globe Hunt";
  challengeTitle.textContent = "Find the mystery country";
  modeContent.innerHTML = `
    <h3 class="panel-title">Find this country</h3>
    <div class="flag-display">${flagImage(state.target, `Flag of ${state.target.name}`)}</div>
    <div class="answer-grid">
      <button class="answer-button" id="hunt-hint">Give hint</button>
    </div>
    <p class="panel-note" id="hunt-hint-text">Click the country on the globe.</p>
    <p class="hint-count" id="hunt-hint-count">Hints used: 0/4</p>
  `;
  modeContent.querySelector("#hunt-hint").addEventListener("click", giveHuntHint);
  feedback.textContent = "Click the country on the globe.";
}

function giveHuntHint() {
  if (state.answered) return;
  if (state.huntHints >= 4) {
    giveUpHunt();
    return;
  }
  state.huntHints += 1;
  const text = modeContent.querySelector("#hunt-hint-text");
  modeContent.querySelector("#hunt-hint-count").textContent = `Hints used: ${state.huntHints}/4`;
  if (state.huntHints === 1) {
    text.textContent = `Its capital is ${state.target.capital}.`;
  } else if (state.huntHints === 2) {
    const center = averageCountryCenter((country) => broadRegion(country) === broadRegion(state.target));
    focusLatLon(center, 0.86);
    text.textContent = `Continent: ${broadRegion(state.target)}.`;
  } else if (state.huntHints === 3) {
    const center = averageCountryCenter((country) => country.region === state.target.region);
    focusLatLon(center, 3.45);
    text.textContent = `Region: ${state.target.region}.`;
  } else {
    text.textContent = `The country starts with "${state.target.name[0].toUpperCase()}".`;
    modeContent.querySelector("#hunt-hint").textContent = "Give up";
  }
}

function giveUpHunt() {
  state.answered = true;
  award(0, false);
  focusCountry(state.target);
  modeContent.querySelector("#hunt-hint").disabled = true;
  showContinueButton();
  const answer = document.createElement("p");
  answer.className = "hunt-answer-reveal";
  answer.textContent = `The answer was ${state.target.name}.`;
  modeContent.querySelector("#continue-round").insertAdjacentElement("afterend", answer);
  setFeedback("Round ended.", false);
}

function setupOutline() {
  const candidates = worldMap.filter(
    (feature) => feature.gameCountry && feature.gameCountry.iso2 && Number(feature.gameCountry.areaKm2 || 0) >= 1_000,
  );
  if (!state.outlineDeck.length) state.outlineDeck = shuffle([...candidates]);
  state.target = state.outlineDeck.pop();
  state.correctAnswer = state.target.gameCountry.name;
  const rotation = Math.round(Math.random() * 360);
  state.outlineRotation = rotation;
  state.outlineHintLevel = 0;
  state.outlineSuggestionIndex = -1;
  modeKicker.textContent = "Outline Twist";
  challengeTitle.textContent = "Which country is this outline?";
  modeContent.innerHTML = `
    <h3 class="panel-title">Rotated outline</h3>
    <div class="outline-display">
      <canvas id="outline-canvas" width="900" height="600" aria-label="Rotated country outline"></canvas>
      <div class="outline-compass" id="outline-compass" hidden><strong>N</strong><span></span></div>
    </div>
    <div class="answer-grid compact-actions">
      <button class="answer-button" id="outline-hint">Hint</button>
    </div>
    <p class="panel-note" id="outline-hint-text"></p>
    <p class="hint-count" id="outline-hint-count">Hints used: 0/3</p>
    <p class="answer-stat" id="mode-answer-stat">${formatModeStat("outline")}</p>
    <div class="search-answer">
      <input id="outline-guess" autocomplete="off" placeholder="Type a country name">
      <div class="suggestion-list" id="outline-suggestions"></div>
    </div>
  `;
  drawOutlineChallenge(state.target, rotation, state.outlineHintLevel);
  const input = modeContent.querySelector("#outline-guess");
  modeContent.querySelector("#outline-hint").addEventListener("click", showOutlineHint);
  input.addEventListener("input", () => renderOutlineSuggestions(input.value));
  input.addEventListener("keydown", (event) => {
    if (state.answered && event.key === "Enter") return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveOutlineSuggestion(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter") {
      const active = modeContent.querySelector(".suggestion-button.active");
      submitOutlineGuess(active?.dataset.country || input.value);
    }
  });
  requestAnimationFrame(() => input.focus());
}

function setupViewfinder() {
  const landlocked = new Set([
    "Afghanistan", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Bhutan", "Bolivia", "Botswana",
    "Burkina Faso", "Burundi", "Central African Republic", "Chad", "Czechia", "Eswatini", "Ethiopia", "Hungary",
    "Kazakhstan", "Kyrgyzstan", "Laos", "Lesotho", "Liechtenstein", "Luxembourg", "Malawi", "Mali", "Moldova",
    "Mongolia", "Nepal", "Niger", "North Macedonia", "Paraguay", "Rwanda", "San Marino", "Serbia", "Slovakia",
    "South Sudan", "Switzerland", "Tajikistan", "Turkmenistan", "Uganda", "Uzbekistan", "Vatican City", "Zambia", "Zimbabwe",
  ]);
  const candidates = countries.filter((country) => Number(country.areaKm2 || 0) >= 40_000 && !landlocked.has(country.name));
  state.target = randomFrom(candidates);
  state.correctAnswer = state.target.name;
  state.viewHints = 0;
  state.viewShowBorders = false;
  state.viewShowCapitals = false;
  state.viewCorrectCountry = null;
  state.viewWrongCountry = null;
  state.viewGuessCorrect = null;
  state.viewFocusGuess = false;
  state.viewFrameOutline = false;
  state.northUp = true;
  state.freeMatrix = null;
  state.roll = toRad(Math.random() * 320 - 160);
  state.viewInitialRoll = state.roll;
  const feature = worldMap.find((item) => sameCountry(item, state.target));
  const ring = feature?.polygons[0]?.[0] || [];
  const coast = ring.length ? randomFrom(ring) : [getCenterLon(state.target), getCenterLat(state.target)];
  const center = {
    lat: getCenterLat(state.target) * 0.42 + coast[1] * 0.58,
    lon: normalizeLon(getCenterLon(state.target) * 0.42 + coast[0] * 0.58),
  };
  state.viewCenter = center;
  if (state.viewHardStart && !state.viewHardInitialized) {
    state.viewNextAltitude = Math.min(state.viewNextAltitude, 850);
    state.viewHardInitialized = true;
  }
  state.viewAltitude = clamp(Math.round(state.viewNextAltitude), 400, 3_000);
  ensureTerrainMeshes(state.viewAltitude <= 1_600);
  focusLatLon(center, 6371 / state.viewAltitude);
  state.roll = toRad(Math.random() * 320 - 160);
  state.viewCountries = worldMap
    .filter((feature) => featureVisibleInViewfinder(feature))
    .map((feature) => feature.gameCountry)
    .filter(Boolean);
  if (!state.viewCountries.some((country) => sameCountry(country, state.target))) state.viewCountries.push(state.target);
  state.viewFrameCorners = captureViewfinderFrame();
  modeKicker.textContent = "Viewfinder";
  challengeTitle.textContent = "Recognize this borderless view";
  targetDistance.textContent = `Altitude: ${state.viewAltitude.toLocaleString()} km`;
  modeContent.innerHTML = `
    <h3 class="panel-title">What part of the world is this?</h3>
    <button class="answer-button" id="view-hint">Hint</button>
    <p class="panel-note" id="view-hint-text">Name a country visible in the globe frame.</p>
    <p class="hint-count" id="view-hint-count">Hints used: 0/3</p>
    <label class="check-control view-hard-toggle">
      <input type="checkbox" id="view-hard-start" ${state.viewHardStart ? "checked" : ""}>
      <span>Start in hard mode</span>
    </label>
    <div class="search-answer">
      <input id="view-guess" autocomplete="off" placeholder="Type a country name">
      <div class="suggestion-list" id="view-suggestions"></div>
    </div>
  `;
  const input = modeContent.querySelector("#view-guess");
  input.addEventListener("input", () => renderViewSuggestions(input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      state.viewSuggestionIndex = moveCountrySuggestion(
        "#view-suggestions",
        state.viewSuggestionIndex ?? -1,
        event.key === "ArrowDown" ? 1 : -1,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      submitViewGuess(countryFromInput(input.value, "#view-suggestions")?.name || input.value);
    }
  });
  modeContent.querySelector("#view-hint").addEventListener("click", showViewHint);
  modeContent.querySelector("#view-hard-start").addEventListener("change", (event) => {
    state.viewHardStart = event.target.checked;
    if (state.viewHardStart) {
      state.viewNextAltitude = Math.min(state.viewNextAltitude, 850);
      state.viewHardInitialized = true;
    }
    localStorage.setItem("geosphere-view-hard", String(state.viewHardStart));
  });
}

function renderViewSuggestions(value) {
  const list = modeContent.querySelector("#view-suggestions");
  const query = rawCountryKey(value);
  if (!query) {
    list.innerHTML = "";
    return;
  }
  const matches = countrySuggestions(query);
  state.viewSuggestionIndex = -1;
  list.innerHTML = matches
    .map((country) => `<button class="suggestion-button" data-country="${escapeAttribute(country.name)}">${country.name}</button>`)
    .join("");
  list.querySelectorAll("[data-country]").forEach((button) =>
    button.addEventListener("click", () => submitViewGuess(button.dataset.country)),
  );
}

function submitViewGuess(value) {
  if (state.answered) return;
  const guessed = countryFromInput(value, "#view-suggestions");
  if (!guessed) {
    setFeedback("Choose a country from the matching list.", false);
    return;
  }
  const correct = guessed && state.viewCountries.some((country) => sameCountry(country, guessed));
  modeContent.querySelector("#view-guess")?.blur();
  const playedAltitude = state.viewAltitude;
  award(correct ? [100, 75, 50, 25][state.viewHints] : 0, Boolean(correct));
  const streak = state.gameScores.viewfinder.streak;
  const altitudeChange = correct ? -(140 + Math.min(180, streak * 18)) : 190;
  state.viewNextAltitude = clamp(state.viewAltitude + altitudeChange, 400, 3_000);
  state.answered = true;
  if (correct) {
    state.viewCorrectCountry = guessed;
    state.viewGuessCorrect = true;
  } else {
    state.viewWrongCountry = guessed || null;
    state.viewGuessCorrect = false;
    revealViewfinderFrame();
  }
  setFeedback(
    correct
      ? `Correct: ${guessed.name} is visible. Altitude: ${playedAltitude.toLocaleString()} km.`
      : `Not in this frame. The centered country was ${state.target.name}. Altitude: ${playedAltitude.toLocaleString()} km.`,
    Boolean(correct),
  );
  showContinueButton();
  if (!correct && guessed) addViewfinderFocusButton();
}

function showViewHint() {
  if (state.answered) return;
  if (state.viewHints >= 3) {
    state.answered = true;
    state.viewNextAltitude = clamp(state.viewAltitude + 240, 400, 3_000);
    revealViewfinderFrame();
    setFeedback(`The centered country was ${state.target.name}.`, false);
    showContinueButton(false);
    return;
  }
  state.viewHints += 1;
  const text = modeContent.querySelector("#view-hint-text");
  if (state.viewHints === 1) {
    const shrink = 1 / Math.max(1, Math.abs(Math.cos(state.roll)) + Math.abs(Math.sin(state.roll)));
    state.zoom *= shrink;
    state.viewAltitude = clamp(Math.round(6371 / state.zoom), 400, 5_000);
    state.roll = 0;
    text.textContent = "North is now up.";
  } else if (state.viewHints === 2) {
    state.viewShowCapitals = true;
    text.textContent = "Visible capitals are now labeled.";
  } else {
    state.viewShowBorders = true;
    text.textContent = "Country borders are now visible.";
    modeContent.querySelector("#view-hint").textContent = "Give up";
  }
  modeContent.querySelector("#view-hint-count").textContent = `Hints used: ${state.viewHints}/3`;
}

function addViewfinderFocusButton() {
  if (!state.viewWrongCountry || modeContent.querySelector("#view-focus-wrong")) return;
  const button = document.createElement("button");
  button.id = "view-focus-wrong";
  button.className = "answer-button";
  button.textContent = "Go to the guessed country";
  button.addEventListener("click", () => {
    state.viewFocusGuess = !state.viewFocusGuess;
    if (state.viewFocusGuess) {
      focusCountry(state.viewWrongCountry);
      button.textContent = "Go back to viewframe";
    } else {
      state.northUp = true;
      state.freeMatrix = null;
      focusLatLon(state.viewCenter || state.target, 6371 / 5_000);
      state.roll = 0;
      button.textContent = "Go to the guessed country";
    }
  });
  modeContent.appendChild(button);
}

function featureVisibleInViewfinder(feature) {
  const rect = canvas.getBoundingClientRect();
  const { cx, cy, radius } = globeMetrics();
  return feature.renderTriangles.some((triangle) => {
    const clipped = clipRingToVisible(triangle.map(cameraVector));
    if (clipped.length < 3) return false;
    const points = clipped.map((point) => projectCameraPoint(point, cx, cy, radius));
    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    return maxX >= 0 && minX <= rect.width && maxY >= 0 && minY <= rect.height;
  });
}

function captureViewfinderFrame() {
  const { width, height, cx, cy, radius } = globeMetrics();
  return [
    [2, 2],
    [width - 2, 2],
    [width - 2, height - 2],
    [2, height - 2],
  ].map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.hypot(dx, dy);
    const scale = distance > radius * 0.96 ? (radius * 0.96) / distance : 1;
    return screenToLatLon(cx + dx * scale, cy + dy * scale, cx, cy, radius);
  }).filter(Boolean);
}

function revealViewfinderFrame() {
  state.viewFrameOutline = true;
  state.viewShowBorders = true;
  state.northUp = true;
  focusLatLon(state.viewCenter || state.target, 6371 / 5_000);
  state.roll = 0;
  requestGlobeRender();
}

function setupAirports() {
  const eligible = countries.filter((country) => Number.isFinite(country.lat) && Number.isFinite(country.lon));
  state.airportPair = shuffle([...eligible]).slice(0, 2);
  const [start, destination] = state.airportPair;
  const startAirport = airportForCountry(start);
  const destinationAirport = airportForCountry(destination);
  state.target = destination;
  state.flight.active = true;
  state.flight.lat = startAirport.lat;
  state.flight.lon = startAirport.lon;
  const targetBearing = initialBearing(startAirport.lat, startAirport.lon, destinationAirport.lat, destinationAirport.lon);
  state.flight.heading = normalizeHeading(targetBearing + 55 + Math.random() * 250);
  state.flight.totalDistance = 0;
  state.flight.currentSpeed = state.flight.speeds.base;
  state.flight.lastFrame = performance.now();
  state.flight.cameraBlend = 1;
  state.flight.paused = false;
  state.flight.trail = [{ lat: startAirport.lat, lon: startAirport.lon }];
  initializeFlightCourse();
  updateFlightCamera(true);
  modeKicker.textContent = "Airport Run";
  challengeTitle.textContent = `Fly to ${destinationAirport.iata}`;
  modeContent.innerHTML = `
    <h3 class="panel-title">${startAirport.iata} to ${destinationAirport.iata}</h3>
    <div class="facts-box">
      ${flagImage(destination, `${destination.name} flag`)}
      <div>
        <strong>Target airport</strong>
        <span>${destinationAirport.name}, ${destinationAirport.city}, ${destination.name}</span>
        <span>Arrive within 50 km to complete the route.</span>
      </div>
    </div>
    ${flightControlsHtml()}
    <button class="answer-button" id="give-up-airport">Find new flight</button>
  `;
  bindFlightPanelControls();
  modeContent.querySelector("#give-up-airport").addEventListener("click", () => {
    state.flight.active = false;
    window.planeRenderer?.setVisible(false);
    newRound("airports");
  });
}

function airportForCountry(country) {
  return window.AIRPORT_DATA?.[country.iso2] || {
    name: `${country.capital} Airport`,
    city: country.capital,
    country: country.name,
    iata: country.iso2,
    lat: country.lat,
    lon: country.lon,
  };
}

function setupLanguage() {
  const allContinents = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];
  const enabled = new Set(state.languageContinents);
  const eligible = languageChallenges.filter((item) => enabled.has(item.continent));
  const pool = eligible.length ? eligible : languageChallenges;
  const challenge = randomFrom(pool);
  state.target = challenge;
  state.correctAnswer = challenge.language;
  state.languageHint = 0;
  modeKicker.textContent = "Guess Language";
  challengeTitle.textContent = "Which language is this?";
  const options = shuffle([
    challenge.language,
    ...shuffle(pool.filter((item) => item.language !== challenge.language))
      .slice(0, 4)
      .map((item) => item.language),
  ]);
  modeContent.innerHTML = `
    <h3 class="panel-title">Translated sentence</h3>
    <div class="language-sentence">${challenge.sentence}</div>
    <div class="answer-grid">${options.map((option) => `<button class="answer-button" data-answer="${option}">${option}</button>`).join("")}</div>
    <button class="answer-button" id="language-hint">Hint</button>
    <p class="panel-note" id="language-hint-text"></p>
    <p class="hint-count" id="language-hint-count">Hints used: 0/2</p>
    <details class="options-menu language-filter-menu" id="language-options" ${state.languageOptionsOpen ? "open" : ""}>
      <summary><span>Language filters</span><label class="option-pin" title="Keep this menu open"><input type="checkbox" id="pin-language-options" ${state.languageOptionsPinned ? "checked" : ""}><span aria-hidden="true">📌</span></label></summary>
      <div class="options-menu-content">
        <label class="check-control"><input type="checkbox" id="language-all" ${state.languageContinents.length === allContinents.length ? "checked" : ""}><span>Include every language</span></label>
        ${allContinents.map((continent) => `<label class="check-control"><input type="checkbox" data-language-continent="${continent}" ${enabled.has(continent) ? "checked" : ""}><span>${continent}</span></label>`).join("")}
      </div>
    </details>
  `;
  modeContent.querySelectorAll("[data-answer]").forEach((button) =>
    button.addEventListener("click", () => {
      if (state.answered) return;
      const correct = button.dataset.answer === challenge.language;
      state.answered = true;
      state.stats.language.total += 1;
      if (correct) state.stats.language.correct += 1;
      award(correct ? 1 : 0, correct);
      setFeedback(correct ? `Correct: ${challenge.language}. +1 point.` : `It was ${challenge.language}.`, correct);
      showContinueButton();
    }),
  );
  modeContent.querySelector("#language-hint").addEventListener("click", () => {
    if (state.answered) return;
    state.languageHint += 1;
    const text = state.languageHint === 1 ? `Language family: ${challenge.family}.` : `Main region: ${challenge.region}.`;
    modeContent.querySelector("#language-hint-text").textContent = text;
    modeContent.querySelector("#language-hint-count").textContent = `Hints used: ${Math.min(2, state.languageHint)}/2`;
    if (state.languageHint >= 2) modeContent.querySelector("#language-hint").disabled = true;
  });
  modeContent.querySelector("#language-options")?.addEventListener("toggle", (event) => {
    state.languageOptionsOpen = event.target.open;
  });
  modeContent.querySelector("#pin-language-options")?.closest("label")?.addEventListener("click", (event) => event.stopPropagation());
  modeContent.querySelector("#pin-language-options")?.addEventListener("change", (event) => {
    state.languageOptionsPinned = event.target.checked;
  });
  modeContent.querySelector("#language-all")?.addEventListener("change", (event) => {
    if (!event.target.checked) {
      event.target.checked = state.languageContinents.length === allContinents.length;
      return;
    }
    state.languageContinents = [...allContinents];
    modeContent.querySelectorAll("[data-language-continent]").forEach((input) => {
      input.checked = true;
    });
  });
  modeContent.querySelectorAll("[data-language-continent]").forEach((input) => {
    input.addEventListener("change", () => {
      state.languageContinents = [...modeContent.querySelectorAll("[data-language-continent]:checked")]
        .map((item) => item.dataset.languageContinent);
      if (!state.languageContinents.length) {
        input.checked = true;
        state.languageContinents = [input.dataset.languageContinent];
      }
      modeContent.querySelector("#language-all").checked = state.languageContinents.length === allContinents.length;
    });
  });
}

function setupTraverse() {
  const graph = getBorderGraph();
  const connected = countries.filter((country) => (graph.get(country.name)?.size || 0) > 0);
  let start = randomFrom(connected);
  let target = randomFrom(connected);
  let shortest = shortestCountryRoute(start.name, target.name, graph);
  for (let attempt = 0; attempt < 80 && (!shortest || shortest.length < 4 || shortest.length > 10); attempt += 1) {
    start = randomFrom(connected);
    target = randomFrom(connected);
    shortest = shortestCountryRoute(start.name, target.name, graph);
  }
  state.traverse = {
    start,
    target,
    route: [start],
    invalid: 0,
    hints: 0,
    suggestions: [],
    suggestionIndex: -1,
    shortest: shortest || [start.name, target.name],
    hintCountry: null,
    gaveUp: false,
    totalHints: 0,
    showPlayerLines: true,
    shortestShown: false,
  };
  state.target = target;
  state.selected = start;
  modeKicker.textContent = "Country Traversing";
  challengeTitle.textContent = `${start.name} to ${target.name}`;
  targetDistance.textContent = "Borders and special crossings";
  const midpoint = greatCirclePoints(getCenterLat(start), getCenterLon(start), getCenterLat(target), getCenterLon(target), 2)[1];
  focusLatLon(midpoint, 1.15);
  globeHud.hidden = true;
  renderTraversePanel();
}

function setupConquest() {
  const graph = getBorderGraph();
  const playable = countries.filter((country) => (graph.get(country.name)?.size || 0) > 0 && country.name !== "Antarctica");
  const starts = shuffle([...playable]).filter((country, index, list) =>
    list.slice(0, index).every((other) => distanceKm(country, other) > 1_500),
  ).slice(0, 4);
  const factions = [
    { id: "player", name: "Player", color: "#49d6c8" },
    { id: "ai1", name: "Crimson AI", color: "#ff6f61" },
    { id: "ai2", name: "Gold AI", color: "#e8bd52" },
    { id: "ai3", name: "Violet AI", color: "#a98cff" },
  ];
  const territories = new Map(playable.map((country) => [
    country.name,
    {
      owner: "neutral",
      soldiers: Math.max(2, Math.round(2 + Math.log10(Math.max(1, country.populationNumber || 1_000_000)))),
      income: Math.max(1, Math.round(
        Math.log10(Math.max(10, country.populationNumber || 1_000_000)) +
        Math.log10(Math.max(10, country.areaKm2 || 10_000)) - 8,
      )),
    },
  ]));
  starts.forEach((country, index) => {
    territories.set(country.name, { ...territories.get(country.name), owner: factions[index].id, soldiers: 12 });
  });
  state.conquest = {
    factions,
    territories,
    selected: starts[0],
    reinforcements: 5,
    turn: 1,
    phase: "reinforce",
    log: [`You begin in ${starts[0].name}.`],
  };
  state.selected = starts[0];
  modeKicker.textContent = "Globe Conquest";
  challengeTitle.textContent = "Expand across the world";
  targetDistance.textContent = "Turn 1";
  focusCountry(starts[0]);
  renderConquestPanel();
}

function conquestTerritory(country) {
  return state.conquest?.territories.get(country?.name);
}

function handleConquestCountryClick(country) {
  const game = state.conquest;
  const territory = conquestTerritory(country);
  if (!game || !territory || state.answered) return;
  const selectedTerritory = conquestTerritory(game.selected);
  if (territory.owner === "player") {
    game.selected = country;
    state.selected = country;
    renderConquestPanel();
    return;
  }
  if (
    game.phase === "attack" &&
    selectedTerritory?.owner === "player" &&
    getBorderGraph().get(game.selected.name)?.has(country.name)
  ) {
    resolveConquestAttack(game.selected, country, "player");
  } else {
    game.log.unshift(`${country.name} is not a valid target from ${game.selected?.name || "the selected territory"}.`);
    renderConquestPanel();
  }
}

function renderConquestPanel() {
  const game = state.conquest;
  if (!game) return;
  const selected = game.selected;
  const territory = conquestTerritory(selected);
  const faction = game.factions.find((item) => item.id === territory?.owner);
  const owned = [...game.territories.values()].filter((item) => item.owner === "player").length;
  modeContent.innerHTML = `
    <h3 class="panel-title">Turn ${game.turn}: ${game.phase === "reinforce" ? "Reinforce" : "Attack"}</h3>
    <div class="facts-box conquest-facts">
      ${selected ? flagImage(selected, `Flag of ${selected.name}`) : ""}
      <div>
        <strong>${selected?.name || "Select a territory"}</strong>
        <span>Owner: ${faction?.name || "Neutral"}</span>
        <span>Soldiers: ${territory?.soldiers ?? 0}</span>
        <span>Income value: ${territory?.income ?? 0}</span>
        <span>Neighbors: ${[...(getBorderGraph().get(selected?.name) || [])].join(", ") || "None"}</span>
      </div>
    </div>
    <p class="answer-stat">Owned: ${owned} | Reinforcements: ${game.reinforcements}</p>
    <div class="answer-grid conquest-actions">
      <button class="answer-button" id="conquest-reinforce" ${game.phase !== "reinforce" || territory?.owner !== "player" || game.reinforcements <= 0 ? "disabled" : ""}>Add soldier</button>
      <button class="answer-button" id="conquest-phase">${game.phase === "reinforce" ? "Begin attacks" : "End turn"}</button>
    </div>
    <p class="panel-note">${game.phase === "attack" ? "Select one of your territories, then click an adjacent territory to attack." : "Select an owned territory and distribute reinforcements."}</p>
    <div class="conquest-log">${game.log.slice(0, 6).map((entry) => `<p>${entry}</p>`).join("")}</div>
  `;
  modeContent.querySelector("#conquest-reinforce")?.addEventListener("click", () => {
    if (game.reinforcements <= 0 || territory.owner !== "player") return;
    territory.soldiers += 1;
    game.reinforcements -= 1;
    renderConquestPanel();
    requestGlobeRender();
  });
  modeContent.querySelector("#conquest-phase").addEventListener("click", () => {
    if (game.phase === "reinforce") {
      game.phase = "attack";
      renderConquestPanel();
    } else {
      runConquestAiTurns();
    }
  });
}

function resolveConquestAttack(fromCountry, toCountry, attackerOwner) {
  const game = state.conquest;
  const from = conquestTerritory(fromCountry);
  const to = conquestTerritory(toCountry);
  if (!from || !to || from.owner !== attackerOwner || from.soldiers < 2) return false;
  const committed = Math.max(1, Math.floor(from.soldiers * 0.65));
  const attackRoll = committed * (0.82 + Math.random() * 0.38);
  const defenseBonus = 1 + Math.min(0.22, Math.log10(Math.max(1, toCountry.areaKm2 || 1)) * 0.025);
  const defenseRoll = to.soldiers * defenseBonus * (0.84 + Math.random() * 0.34);
  from.soldiers -= committed;
  if (attackRoll > defenseRoll) {
    const survivors = Math.max(1, Math.round(committed - defenseRoll * 0.45));
    to.owner = attackerOwner;
    to.soldiers = survivors;
    game.log.unshift(`${fromCountry.name} conquered ${toCountry.name} with ${survivors} soldiers remaining.`);
  } else {
    to.soldiers = Math.max(1, Math.round(to.soldiers - committed * 0.42));
    game.log.unshift(`${fromCountry.name}'s attack on ${toCountry.name} failed.`);
  }
  if (attackerOwner === "player") {
    game.selected = fromCountry;
    state.selected = fromCountry;
    renderConquestPanel();
  }
  requestGlobeRender();
  return true;
}

function runConquestAiTurns() {
  const game = state.conquest;
  game.factions.filter((faction) => faction.id !== "player").forEach((faction) => {
    const owned = countries.filter((country) => conquestTerritory(country)?.owner === faction.id);
    owned.forEach((country) => {
      conquestTerritory(country).soldiers += conquestTerritory(country).income;
    });
    const attackers = shuffle(owned).filter((country) => conquestTerritory(country).soldiers >= 5);
    for (const attacker of attackers.slice(0, 3)) {
      const targets = [...(getBorderGraph().get(attacker.name) || [])]
        .map((name) => countries.find((country) => country.name === name))
        .filter((country) => country && conquestTerritory(country)?.owner !== faction.id)
        .sort((a, b) => conquestTerritory(a).soldiers - conquestTerritory(b).soldiers);
      if (targets[0] && conquestTerritory(attacker).soldiers > conquestTerritory(targets[0]).soldiers * 1.15) {
        resolveConquestAttack(attacker, targets[0], faction.id);
      }
    }
  });
  const playerOwned = countries.filter((country) => conquestTerritory(country)?.owner === "player");
  playerOwned.forEach((country) => {
    conquestTerritory(country).soldiers += conquestTerritory(country).income;
  });
  game.turn += 1;
  game.phase = "reinforce";
  game.reinforcements = Math.max(3, Math.floor(playerOwned.length / 3) + 2);
  targetDistance.textContent = `Turn ${game.turn}`;
  renderConquestPanel();
  requestGlobeRender();
}

function setupContinentPuzzle() {
  modeKicker.textContent = "Continent Puzzle";
  challengeTitle.textContent = "Build a continent";
  targetDistance.textContent = "";
  state.puzzle = null;
  const continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"];
  modeContent.innerHTML = `
    <h3 class="panel-title">Choose a continent</h3>
    <div class="continent-choice-grid">
      ${continents.map((continent) => `<button class="answer-button" data-continent="${continent}">${continent}</button>`).join("")}
    </div>
    <p class="panel-note">Drag each country shape into its geographic position. Correct placements snap into place.</p>
  `;
  modeContent.querySelectorAll("[data-continent]").forEach((button) => {
    button.addEventListener("click", () => startContinentPuzzle(button.dataset.continent));
  });
}

function startContinentPuzzle(continent) {
  const features = worldMap.filter((feature) =>
    feature.continent === continent &&
    feature.gameCountry &&
    Number(feature.gameCountry.areaKm2 || 0) >= 500,
  );
  const points = features.flatMap((feature) => feature.polygons.flatMap((polygon) => polygon[0] || []));
  const bounds = {
    minLon: Math.min(...points.map((point) => point[0])),
    maxLon: Math.max(...points.map((point) => point[0])),
    minLat: Math.min(...points.map((point) => point[1])),
    maxLat: Math.max(...points.map((point) => point[1])),
  };
  state.puzzle = {
    continent,
    features,
    bounds,
    remaining: shuffle([...features]),
    available: [],
    placed: new Set(),
    attempts: 0,
  };
  refillPuzzleChoices();
  renderContinentPuzzle();
}

function refillPuzzleChoices() {
  const game = state.puzzle;
  while (game.available.length < 3 && game.remaining.length) game.available.push(game.remaining.pop());
}

function renderContinentPuzzle() {
  const game = state.puzzle;
  if (!game) return;
  const completed = game.placed.size === game.features.length;
  modeContent.innerHTML = `
    <div class="puzzle-heading">
      <h3 class="panel-title">${game.continent}</h3>
      <button class="mini-button" id="change-puzzle-continent">Change continent</button>
    </div>
    <div class="continent-puzzle-board" id="continent-puzzle-board">
      <svg viewBox="0 0 1000 700" role="img" aria-label="${game.continent} country placement board">
        <g class="continent-silhouette">${game.features.map((feature) => `<path d="${puzzleFeaturePath(feature, game.bounds)}"></path>`).join("")}</g>
        <g class="puzzle-placed">${game.features
          .filter((feature) => game.placed.has(feature.gameCountry.name))
          .map((feature) => `<path d="${puzzleFeaturePath(feature, game.bounds)}"></path>`)
          .join("")}</g>
      </svg>
    </div>
    <div class="puzzle-piece-tray">
      ${game.available.map((feature) => `
        <div class="puzzle-piece" draggable="true" data-country="${escapeAttribute(feature.gameCountry.name)}">
          <svg viewBox="0 0 180 120" aria-hidden="true"><path d="${puzzleMiniPath(feature)}"></path></svg>
          <strong>${feature.gameCountry.name}</strong>
        </div>
      `).join("")}
    </div>
    <p class="answer-stat">${game.placed.size}/${game.features.length} placed | Attempts: ${game.attempts}</p>
    ${completed ? `<p class="puzzle-complete">Continent complete.</p><button class="continue-button" id="puzzle-again">Choose another continent</button>` : ""}
  `;
  modeContent.querySelector("#change-puzzle-continent")?.addEventListener("click", setupContinentPuzzle);
  modeContent.querySelector("#puzzle-again")?.addEventListener("click", setupContinentPuzzle);
  const board = modeContent.querySelector("#continent-puzzle-board");
  modeContent.querySelectorAll(".puzzle-piece").forEach((piece) => {
    piece.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", piece.dataset.country);
      event.dataTransfer.effectAllowed = "move";
    });
  });
  board.addEventListener("dragover", (event) => event.preventDefault());
  board.addEventListener("drop", (event) => {
    event.preventDefault();
    const countryName = event.dataTransfer.getData("text/plain");
    const feature = game.available.find((item) => item.gameCountry.name === countryName);
    if (!feature) return;
    const rect = board.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const y = ((event.clientY - rect.top) / rect.height) * 700;
    const target = puzzleCountryCenter(feature, game.bounds);
    const tolerance = clamp(28 + Math.sqrt(Number(feature.gameCountry.areaKm2 || 0)) * 0.055, 34, 105);
    game.attempts += 1;
    if (Math.hypot(x - target.x, y - target.y) <= tolerance) {
      game.placed.add(countryName);
      game.available = game.available.filter((item) => item !== feature);
      refillPuzzleChoices();
      setFeedback(`${countryName} snapped into place.`, true);
    } else {
      setFeedback(`${countryName} belongs elsewhere in ${game.continent}.`, false);
    }
    renderContinentPuzzle();
  });
}

function puzzleProject(lon, lat, bounds, width = 1000, height = 700, padding = 34) {
  const spanLon = Math.max(1, bounds.maxLon - bounds.minLon);
  const spanLat = Math.max(1, bounds.maxLat - bounds.minLat);
  const scale = Math.min((width - padding * 2) / spanLon, (height - padding * 2) / spanLat);
  const mapWidth = spanLon * scale;
  const mapHeight = spanLat * scale;
  return {
    x: (width - mapWidth) / 2 + (lon - bounds.minLon) * scale,
    y: (height - mapHeight) / 2 + (bounds.maxLat - lat) * scale,
  };
}

function puzzleFeaturePath(feature, bounds) {
  return feature.polygons.map((polygon) => polygon.map((ring) =>
    ring.map(([lon, lat], index) => {
      const point = puzzleProject(lon, lat, bounds);
      return `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    }).join(" ") + " Z",
  ).join(" ")).join(" ");
}

function puzzleMiniPath(feature) {
  const points = feature.polygons.flatMap((polygon) => polygon[0] || []);
  const bounds = {
    minLon: Math.min(...points.map((point) => point[0])),
    maxLon: Math.max(...points.map((point) => point[0])),
    minLat: Math.min(...points.map((point) => point[1])),
    maxLat: Math.max(...points.map((point) => point[1])),
  };
  return feature.polygons.map((polygon) => polygon.map((ring) =>
    ring.map(([lon, lat], index) => {
      const point = puzzleProject(lon, lat, bounds, 180, 120, 8);
      return `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    }).join(" ") + " Z",
  ).join(" ")).join(" ");
}

function puzzleCountryCenter(feature, bounds) {
  return puzzleProject(getCenterLon(feature), getCenterLat(feature), bounds);
}

function renderTraversePanel() {
  const game = state.traverse;
  const current = game.route[game.route.length - 1];
  modeContent.innerHTML = `
    <h3 class="panel-title">Build a land route</h3>
    <div class="traverse-endpoints">
      <div>${flagImage(game.start, `Flag of ${game.start.name}`)}<strong>${game.start.name}</strong><span>Start</span></div>
      <span>to</span>
      <div>${flagImage(game.target, `Flag of ${game.target.name}`)}<strong>${game.target.name}</strong><span>Target</span></div>
    </div>
    <div class="route-chain">${game.route.map((country) => `<span>${country.name}</span>`).join("<b>›</b>")}</div>
    <p class="panel-note">Latest country: <strong>${current.name}</strong>. Enter a country bordering any country already in your route.</p>
    <div class="search-answer">
      <input id="traverse-guess" autocomplete="off" placeholder="Neighboring country" ${state.answered ? "disabled" : ""}>
      <div class="suggestion-list" id="traverse-suggestions"></div>
    </div>
    <div class="answer-grid compact-actions traverse-actions">
      <button class="answer-button" id="traverse-hint" ${state.answered ? "disabled" : ""}>${game.hints >= 3 ? "Give up" : `Hint (${game.hints}/3)`}</button>
    </div>
    ${game.hints >= 2 && game.hintCountry ? `<div class="traverse-hint-flag">${flagImage(game.hintCountry, "Flag hint")}${game.hints >= 3 ? `<strong>Starts with “${game.hintCountry.name[0].toUpperCase()}”</strong>` : ""}</div>` : ""}
    <label class="check-control traverse-line-toggle"><input type="checkbox" id="traverse-lines" ${game.showPlayerLines ? "checked" : ""}><span>Show route line</span></label>
    <p class="answer-stat">Steps: ${Math.max(0, game.route.length - 1)} | Invalid guesses: ${game.invalid} | Hints: ${game.totalHints}</p>
  `;
  const input = modeContent.querySelector("#traverse-guess");
  input.addEventListener("input", () => renderTraverseSuggestions(input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveTraverseSuggestion(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const active = modeContent.querySelector("#traverse-suggestions .suggestion-button.active");
      submitTraverseGuess(active?.dataset.country || input.value);
    }
  });
  modeContent.querySelector("#traverse-hint").addEventListener("click", giveTraverseHint);
  modeContent.querySelector("#traverse-lines").addEventListener("change", (event) => {
    game.showPlayerLines = event.target.checked;
    requestGlobeRender();
  });
  if (!state.answered) requestAnimationFrame(() => input.focus());
}

function renderTraverseSuggestions(value) {
  const list = modeContent.querySelector("#traverse-suggestions");
  const query = rawCountryKey(value);
  if (!query) {
    list.innerHTML = "";
    return;
  }
  const matches = countrySuggestions(query);
  state.traverse.suggestions = matches;
  state.traverse.suggestionIndex = -1;
  list.innerHTML = matches.map((country) => `<button class="suggestion-button" data-country="${escapeAttribute(country.name)}">${country.name}</button>`).join("");
  list.querySelectorAll("[data-country]").forEach((button) =>
    button.addEventListener("click", () => submitTraverseGuess(button.dataset.country)),
  );
}

function moveTraverseSuggestion(direction) {
  state.traverse.suggestionIndex = moveCountrySuggestion(
    "#traverse-suggestions",
    state.traverse.suggestionIndex,
    direction,
  );
}

function submitTraverseGuess(value) {
  if (state.answered) return;
  const guessed = countryFromInput(value, "#traverse-suggestions");
  const game = state.traverse;
  if (!guessed) {
    setFeedback("Choose a country from the list.", false);
    return;
  }
  if (game.route.some((country) => sameCountry(country, guessed))) {
    game.invalid += 1;
    setFeedback(`${guessed.name} is already in your route.`, false);
    renderTraversePanel();
    return;
  }
  const graph = getBorderGraph();
  const connectsToRoute = game.route.some((country) => graph.get(country.name)?.has(guessed.name));
  if (!connectsToRoute) {
    game.invalid += 1;
    setFeedback(`${guessed.name} does not border any country already in your route.`, false);
    renderTraversePanel();
    return;
  }
  game.route.push(guessed);
  game.hints = 0;
  game.hintCountry = null;
  state.selected = guessed;
  const reachesTarget = sameCountry(guessed, game.target) || graph.get(guessed.name)?.has(game.target.name);
  if (reachesTarget) {
    state.answered = true;
    globeHud.hidden = false;
    const playerSteps = game.route.length - 1;
    const shortestSteps = Math.max(1, game.shortest.length - 2);
    const extraSteps = Math.max(0, playerSteps - shortestSteps);
    const points = Math.max(0, 100 - extraSteps * 10 - game.invalid * 6 - game.totalHints * 8);
    award(points, true);
    renderTraversePanel();
    setFeedback(
      `Route complete in ${playerSteps} steps. Shortest: ${shortestSteps}. Penalties: ${extraSteps * 10} path, ${game.invalid * 6} incorrect, ${game.totalHints * 8} hints. +${points} points.`,
      true,
    );
    showContinueButton(false);
    addTraverseShortestButton();
    return;
  }
  renderTraversePanel();
  setFeedback(`${guessed.name} accepted. Continue from there.`, true);
}

function giveTraverseHint() {
  if (state.answered) return;
  if (state.traverse.hints >= 3) {
    giveUpTraverse();
    return;
  }
  const path = state.traverse.route
    .map((country) => shortestCountryRoute(country.name, state.traverse.target.name, getBorderGraph()))
    .filter(Boolean)
    .sort((a, b) => a.length - b.length)[0];
  const routeNames = new Set(state.traverse.route.map((country) => country.name));
  const hintName = path?.find((name) => !routeNames.has(name));
  state.traverse.hints += 1;
  state.traverse.totalHints += 1;
  if (hintName) {
    state.traverse.hintCountry = countries.find((country) => country.name === hintName) || null;
    setFeedback(
      state.traverse.hints === 1
        ? "A valid neighboring country is pulsing on the globe."
        : state.traverse.hints === 2
          ? "The flag of a valid next country is shown."
          : `Its name starts with “${hintName[0].toUpperCase()}”.`,
      true,
    );
  }
  renderTraversePanel();
}

function giveUpTraverse() {
  if (state.answered) return;
  const proposed = state.traverse.hintCountry;
  if (!proposed) return;
  state.traverse.gaveUp = true;
  submitTraverseGuess(proposed.name);
}

function addTraverseShortestButton() {
  if (modeContent.querySelector("#traverse-show-shortest")) return;
  const wrapper = document.createElement("div");
  wrapper.className = "traverse-shortest-controls";
  const button = document.createElement("button");
  button.id = "traverse-show-shortest";
  button.className = "answer-button";
  const route = document.createElement("div");
  route.className = "route-chain shortest-route-chain";
  route.innerHTML = state.traverse.shortest.map((name) => `<span>${name}</span>`).join("<b>›</b>");
  const update = () => {
    button.textContent = state.traverse.shortestShown ? "Hide shortest path" : "Show shortest path";
    route.hidden = !state.traverse.shortestShown;
  };
  button.addEventListener("click", () => {
    state.traverse.shortestShown = !state.traverse.shortestShown;
    update();
    requestGlobeRender();
  });
  update();
  wrapper.append(button, route);
  modeContent.appendChild(wrapper);
}

function getBorderGraph() {
  if (state.borderGraph) return state.borderGraph;
  const graph = new Map(countries.map((country) => [country.name, new Set()]));
  const coordinateOwners = new Map();
  worldMap.forEach((feature) => {
    if (!feature.gameCountry) return;
    feature.polygons.forEach((polygon) => polygon[0]?.forEach(([lon, lat]) => {
      const key = `${lon.toFixed(2)},${lat.toFixed(2)}`;
      if (!coordinateOwners.has(key)) coordinateOwners.set(key, new Set());
      coordinateOwners.get(key).add(feature.gameCountry.name);
    }));
  });
  coordinateOwners.forEach((owners) => {
    if (owners.size < 2) return;
    const names = [...owners];
    names.forEach((a) => names.forEach((b) => {
      if (a !== b && graph.has(a) && graph.has(b)) graph.get(a).add(b);
    }));
  });
  const manualBorders = [
    ["Denmark", "Germany"],
    ["Russia", "North Korea"], ["Russia", "Georgia"], ["China", "Afghanistan"],
    ["Botswana", "Zambia"], ["Saudi Arabia", "Qatar"], ["Malaysia", "Brunei"],
    ["Spain", "Morocco"], ["Indonesia", "Australia"], ["Papua New Guinea", "Australia"], ["United States", "Russia"],
  ];
  manualBorders.forEach(([a, b]) => {
    graph.get(a)?.add(b);
    graph.get(b)?.add(a);
  });
  [["France", "Brazil"], ["France", "Suriname"]].forEach(([a, b]) => {
    graph.get(a)?.delete(b);
    graph.get(b)?.delete(a);
  });
  state.borderGraph = graph;
  return graph;
}

function shortestCountryRoute(start, target, graph) {
  if (start === target) return [start];
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    for (const next of graph.get(path[path.length - 1]) || []) {
      if (visited.has(next)) continue;
      const candidate = [...path, next];
      if (next === target) return candidate;
      visited.add(next);
      queue.push(candidate);
    }
  }
  return null;
}

function initialBearing(lat1, lon1, lat2, lon2) {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const delta = toRad(normalizeLon(lon2 - lon1));
  return normalizeHeading(radToDeg(Math.atan2(
    Math.sin(delta) * Math.cos(phi2),
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(delta),
  )));
}

function selectFreeroamCountry(country, compare) {
  if (compare) {
    const existing = state.freeSelections.findIndex((item) => sameCountry(item, country));
    if (existing >= 0) state.freeSelections.splice(existing, 1);
    else state.freeSelections.push(country);
    if (state.freeSelections.length > 4) state.freeSelections.shift();
  } else {
    state.freeSelections =
      state.freeSelections.length === 1 && sameCountry(state.freeSelections[0], country) ? [] : [country];
  }
  state.selected = state.freeSelections[state.freeSelections.length - 1] || null;
  renderFreeroamPanel();
}

function clearFreeroamSelections() {
  state.freeSelections = [];
  state.selected = null;
  renderFreeroamPanel();
  feedback.textContent = "Click a country to inspect it. Hold Ctrl while clicking another country to compare.";
}

function renderFreeroamPanel() {
  const selections = state.freeSelections;
  const comparing = selections.length >= 2;
  stage.dataset.comparing = String(comparing);
  const [primary] = selections;
  const comparisons = [];
  for (let i = 0; i < selections.length - 1; i += 1) {
    for (let j = i + 1; j < selections.length; j += 1) {
      const a = selections[i];
      const b = selections[j];
      const km = Math.round(distanceKm(a, b));
      comparisons.push({ a, b, km, flight: estimateFlightTime(km) });
    }
  }

  modeContent.innerHTML = `
    <h3 class="panel-title">${comparing ? "Country comparison" : "Country facts"}</h3>
    ${
      !comparing
        ? `<div class="facts-box">
      ${
        primary
          ? `${flagImage(primary, `Flag of ${primary.name}`)}
        <div>
          <strong>${primary.name}</strong>
          <span>Capital: ${primary.capital}</span>
          <span>Region: ${primary.region}</span>
          <span>Population: ${primary.population}</span>
          <span>Area: ${Number(primary.areaKm2 || 0).toLocaleString()} km<sup>2</sup></span>
          <span>Density: ${primary.density ? `${primary.density} people/km<sup>2</sup>` : "Unknown"}</span>
          <span>Local time: ${localTimeForCountry(primary)}</span>
          <span class="currency-fact">Currency: ${currencyForCountry(primary)}
            ${
              currencyCodeForCountry(primary)
                ? `<button class="info-button" id="currency-info" aria-label="Show USD exchange rate" data-tip="${currencyRateText(primary)}">i</button>`
                : ""
            }
          </span>
          <span>GDP: ${formatGdp(primary.gdpMd)}</span>
          <span>GDP per capita: ${formatMoney(primary.gdpPerCapita)}</span>
        </div>`
          : `<div><strong>No country selected</strong><span>Click a country to inspect it.</span></div>`
      }
    </div>`
        : ""
    }
    ${
      selections.length >= 2
        ? `<div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead><tr><th>Stat</th>${selections.map((country) => `<th>${country.name}</th>`).join("")}</tr></thead>
            <tbody>
              ${comparisonTableRow("Flag", selections.map((country) => flagImage(country, `Flag of ${country.name}`)))}
              ${comparisonTableRow("Capital", selections.map((country) => country.capital))}
              ${comparisonTableRow("Population", selections.map((country) => country.population))}
              ${comparisonTableRow("Area", selections.map((country) => `${Number(country.areaKm2 || 0).toLocaleString()} km<sup>2</sup>`))}
              ${comparisonTableRow("Density", selections.map((country) => country.density ? `${country.density}/km<sup>2</sup>` : "Unknown"))}
              ${comparisonTableRow("Currency", selections.map(currencyForCountry))}
              ${comparisonTableRow("GDP", selections.map((country) => formatGdp(country.gdpMd)))}
              ${comparisonTableRow("GDP/capita", selections.map((country) => formatMoney(country.gdpPerCapita)))}
            </tbody>
          </table>
        </div>`
        : ""
    }
    <div class="answer-grid">
      ${primary ? `<button class="answer-button" id="go-to-country">Go to ${primary.name}</button>` : ""}
      <button class="answer-button" id="toggle-flight">${state.flight.active ? "Stop flight simulator" : "Start flight simulator"}</button>
      ${state.flight.active ? flightControlsHtml() : ""}
      ${
        state.flight.active
          ? `<p class="panel-note plane-credit">Aircraft: <a href="https://sketchfab.com/3d-models/medium-haul-plane-low-poly-226d0f39a9154db9922fcbdd56efe0f5" target="_blank" rel="noreferrer">“Medium haul plane (low poly)” by reeledzin</a>, CC BY 4.0.</p>`
          : ""
      }
      <details class="options-menu" id="freeroam-options" ${state.freeOptionsOpen ? "open" : ""}>
        <summary><span>Map options</span><label class="option-pin" title="Keep this menu open"><input type="checkbox" id="pin-freeroam-options" ${state.freeOptionsPinned ? "checked" : ""}><span aria-hidden="true">📌</span></label></summary>
        <div class="options-menu-content">
          <label class="check-control"><input type="checkbox" id="toggle-compare-lines" ${state.compareLines ? "checked" : ""}><span>Show path between capitals</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-night" ${state.showNight ? "checked" : ""}><span>Show night time</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-full-night" ${state.fullNight ? "checked" : ""}><span>Full night and city lights</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-elevation" ${state.showElevation ? "checked" : ""}><span>Elevation colors</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-airports" ${state.showAirports ? "checked" : ""}><span>Show airports</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-capitals" ${state.showAllCapitals ? "checked" : ""}><span>Show all capitals</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-country-names" ${state.showCountryNames ? "checked" : ""}><span>Show all country names</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-water-bodies" ${state.showWaterBodies ? "checked" : ""}><span>Show names of lakes and water bodies</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-landmarks" ${state.showLandmarks ? "checked" : ""}><span>Show famous landmarks</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-north-up" ${state.northUp ? "checked" : ""}><span>North always up</span></label>
          <label class="check-control"><input type="checkbox" id="toggle-timezones" ${state.showTimezones ? "checked" : ""}><span>Show time zones</span></label>
          ${state.markers.length ? `<button class="answer-button" id="delete-markers">Delete all markers</button>` : ""}
        </div>
      </details>
      ${selections.length >= 2 ? `<button class="answer-button" id="clear-compare">Close comparison (c)</button>` : ""}
    </div>
    ${
      comparisons.length
        ? ""
        : `<p class="panel-note">Ctrl-click another country to compare distances and flight time.</p>`
    }
  `;
  modeContent.querySelector("#go-to-country")?.addEventListener("click", () => focusCountry(primary));
  modeContent.querySelector("#toggle-flight").addEventListener("click", toggleFlight);
  bindFlightPanelControls();
  modeContent.querySelector("#freeroam-options")?.addEventListener("toggle", (event) => {
    state.freeOptionsOpen = event.target.open;
  });
  modeContent.querySelector("#pin-freeroam-options")?.closest("label")?.addEventListener("click", (event) => event.stopPropagation());
  modeContent.querySelector("#pin-freeroam-options")?.addEventListener("change", (event) => {
    state.freeOptionsPinned = event.target.checked;
  });
  modeContent.querySelector("#toggle-compare-lines").addEventListener("change", (event) => {
    state.compareLines = event.target.checked;
  });
  modeContent.querySelector("#toggle-night").addEventListener("change", (event) => {
    state.showNight = event.target.checked;
  });
  modeContent.querySelector("#toggle-full-night").addEventListener("change", (event) => {
    state.fullNight = event.target.checked;
    if (state.fullNight) state.showNight = false;
    renderFreeroamPanel();
  });
  modeContent.querySelector("#toggle-elevation").addEventListener("change", (event) => {
    state.showElevation = event.target.checked;
    if (state.showElevation) ensureTerrainMeshes(true);
  });
  modeContent.querySelector("#toggle-timezones").addEventListener("change", (event) => {
    state.showTimezones = event.target.checked;
    if (state.showTimezones) loadTimezoneBoundaries();
  });
  modeContent.querySelector("#toggle-airports")?.addEventListener("change", (event) => {
    state.showAirports = event.target.checked;
  });
  modeContent.querySelector("#toggle-capitals")?.addEventListener("change", (event) => {
    state.showAllCapitals = event.target.checked;
  });
  modeContent.querySelector("#toggle-country-names")?.addEventListener("change", (event) => {
    state.showCountryNames = event.target.checked;
  });
  modeContent.querySelector("#toggle-water-bodies")?.addEventListener("change", (event) => {
    state.showWaterBodies = event.target.checked;
  });
  modeContent.querySelector("#toggle-landmarks")?.addEventListener("change", (event) => {
    state.showLandmarks = event.target.checked;
  });
  modeContent.querySelector("#toggle-north-up")?.addEventListener("change", (event) => {
    const enabling = event.target.checked;
    if (enabling) {
      transitionToNorthUp();
    } else {
      state.northUp = false;
      state.orientationTarget = null;
      state.freeMatrix = cameraMatrixForEuler(state.yaw, state.pitch, state.roll);
    }
    localStorage.setItem("geosphere-north-up", String(state.northUp));
  });
  modeContent.querySelector("#delete-markers")?.addEventListener("click", () => {
    state.markers = [];
    saveMarkers();
    renderFreeroamPanel();
  });
  modeContent.querySelector("#clear-compare")?.addEventListener("click", clearFreeroamSelections);
}

function comparisonTableRow(label, values) {
  return `<tr><th>${label}</th>${values.map((value) => `<td>${value}</td>`).join("")}</tr>`;
}

function currencyRateText(country) {
  const code = currencyCodeForCountry(country);
  const rate = offlineUsdRates[code];
  return Number.isFinite(rate) ? `Offline reference: 1 ${code} = ${rate.toFixed(rate < 0.01 ? 5 : 3)} USD` : "Offline rate unavailable";
}

function flightControlsHtml() {
  return `
    <label class="check-control"><input type="checkbox" id="flight-show-trail" ${state.flight.showTrail ? "checked" : ""}><span>Show flight path</span></label>
    <details class="options-menu flight-options-menu" id="flight-options" ${state.flight.optionsOpen ? "open" : ""}>
      <summary><span>Flight settings</span><label class="option-pin" title="Keep this menu open"><input type="checkbox" id="pin-flight-options" ${state.flight.optionsPinned ? "checked" : ""}><span aria-hidden="true">📌</span></label></summary>
      <div class="options-menu-content">
        <label class="check-control">
          <span>Camera angle</span>
          <select id="flight-angle">
            ${[5, 15, 45, 90].map((angle) => `<option value="${angle}" ${state.flight.viewAngle === angle ? "selected" : ""}>${angle} degrees</option>`).join("")}
          </select>
        </label>
        <label class="check-control flight-number-control">
          <span>Altitude above surface</span>
          <input id="flight-altitude" type="number" min="0" max="3000" step="10" value="${state.flight.altitude}">
          <span>km</span>
        </label>
        <div class="flight-speed-settings">
          <label><span>Brake speed</span><input id="flight-slow-speed" type="number" min="500" max="5000000" step="5000" value="${state.flight.speeds.slow}"><small>km/h</small></label>
          <label><span>Base speed</span><input id="flight-base-speed" type="number" min="500" max="5000000" step="5000" value="${state.flight.speeds.base}"><small>km/h</small></label>
          <label><span>Boost speed</span><input id="flight-boost-speed" type="number" min="500" max="5000000" step="5000" value="${state.flight.speeds.boost}"><small>km/h</small></label>
        </div>
      </div>
    </details>
    <div class="flight-stats">
      <span id="flight-speed">Speed: ${Math.round(state.flight.currentSpeed).toLocaleString()} km/h</span>
      <span id="flight-total">Total flown: ${Math.round(state.flight.totalDistance).toLocaleString()} km</span>
    </div>
    ${
      state.mode === "airports"
        ? `<label class="check-control airport-spectator-toggle"><input type="checkbox" id="flight-north-up" ${state.flight.spectatorNorthUp ? "checked" : ""}><span>North always up spectating globe</span></label>`
        : ""
    }
    ${state.mode === "airports" ? `<button class="answer-button" id="toggle-flight-pause">${state.flight.paused ? "Resume flight (p)" : "Pause flight (p)"}</button>` : ""}
    <p class="panel-note">A/D or arrows steer. Hold W to boost and S to brake. Wheel adjusts camera distance.</p>
  `;
}

function bindFlightPanelControls() {
  modeContent.querySelector("#flight-options")?.addEventListener("toggle", (event) => {
    state.flight.optionsOpen = event.target.open;
  });
  modeContent.querySelector("#pin-flight-options")?.closest("label")?.addEventListener("click", (event) => event.stopPropagation());
  modeContent.querySelector("#pin-flight-options")?.addEventListener("change", (event) => {
    state.flight.optionsPinned = event.target.checked;
  });
  modeContent.querySelector("#flight-angle")?.addEventListener("change", (event) => {
    state.flight.viewAngle = Number(event.target.value);
    updateFlightCamera(true);
  });
  modeContent.querySelector("#flight-altitude")?.addEventListener("change", (event) => {
    state.flight.altitude = clamp(Number(event.target.value) || 0, 0, 3_000);
    event.target.value = state.flight.altitude;
    updateFlightCamera(true);
  });
  [
    ["#flight-slow-speed", "slow"],
    ["#flight-base-speed", "base"],
    ["#flight-boost-speed", "boost"],
  ].forEach(([selector, key]) => {
    modeContent.querySelector(selector)?.addEventListener("change", (event) => {
      state.flight.speeds[key] = clamp(Math.round(Number(event.target.value) || FLIGHT_DEFAULT_SPEEDS[key]), 500, 5_000_000);
      normalizeFlightSpeeds(key);
      syncFlightSpeedInputs();
    });
  });
  modeContent.querySelector("#flight-show-trail")?.addEventListener("change", (event) => {
    state.flight.showTrail = event.target.checked;
    requestGlobeRender();
  });
  modeContent.querySelector("#flight-north-up")?.addEventListener("change", (event) => {
    const enabling = event.target.checked;
    state.flight.spectatorNorthUp = enabling;
    if (state.flight.paused) {
      if (enabling) {
        transitionToNorthUp();
      } else {
        state.northUp = false;
        state.orientationTarget = null;
        state.freeMatrix = cameraMatrixForEuler(state.yaw, state.pitch, state.roll);
      }
    } else {
      updateFlightCamera(false);
    }
  });
  modeContent.querySelector("#toggle-flight-pause")?.addEventListener("click", toggleFlightPause);
}

function normalizeFlightSpeeds(changedKey) {
  const speeds = state.flight.speeds;
  const gap = 500;
  if (changedKey === "slow") {
    speeds.slow = Math.min(speeds.slow, speeds.base - gap);
  } else if (changedKey === "base") {
    speeds.base = clamp(speeds.base, speeds.slow + gap, speeds.boost - gap);
  } else {
    speeds.boost = Math.max(speeds.boost, speeds.base + gap);
  }
  speeds.slow = clamp(speeds.slow, 500, 4_999_000);
  speeds.base = clamp(speeds.base, speeds.slow + gap, 4_999_500);
  speeds.boost = clamp(speeds.boost, speeds.base + gap, 5_000_000);
}

function syncFlightSpeedInputs() {
  [["#flight-slow-speed", "slow"], ["#flight-base-speed", "base"], ["#flight-boost-speed", "boost"]].forEach(([selector, key]) => {
    const input = modeContent.querySelector(selector);
    if (input) input.value = state.flight.speeds[key];
  });
}

function toggleFlightPause() {
  if (state.mode !== "airports" || !state.flight.active) return;
  state.flight.paused = !state.flight.paused;
  state.flight.turn = 0;
  state.flight.boost = false;
  state.flight.slow = false;
  state.flight.lastFrame = performance.now();
  if (state.flight.paused) {
    state.flight.pauseView = { yaw: state.yaw, pitch: state.pitch, roll: state.roll, zoom: state.zoom };
    state.flight.cameraBlend = 0;
    state.northUp = state.flight.spectatorNorthUp;
    state.freeMatrix = state.northUp ? null : cameraMatrixForEuler(state.yaw, state.pitch, state.roll);
    feedback.textContent = "Flight paused. Rotate and inspect the globe, then resume when ready.";
  } else {
    state.flight.cameraBlend = 0;
    feedback.textContent = "Flight resumed. Returning to the chase camera.";
  }
  const button = modeContent.querySelector("#toggle-flight-pause");
  if (button) button.textContent = state.flight.paused ? "Resume flight (p)" : "Pause flight (p)";
}

function saveMarkers() {
  localStorage.setItem("geosphere-markers", JSON.stringify(state.markers));
}

async function hydrateLandmarkDetails(marker) {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(marker.name)}`);
    if (!response.ok) return;
    const data = await response.json();
    const image = waterInfoPopup.querySelector("#landmark-preview");
    const info = waterInfoPopup.querySelector("#landmark-info");
    if (image && data.thumbnail?.source) image.src = data.thumbnail.source;
    if (info && !marker.info && data.extract) info.textContent = data.extract;
  } catch {
    // The bundled Commons image remains available when Wikipedia cannot be reached.
  }
}

function toggleFlight() {
  const starting = !state.flight.active;
  let startPoint = null;
  if (starting) {
    const metrics = globeMetrics();
    startPoint = screenToLatLon(metrics.cx, metrics.cy, metrics.cx, metrics.cy, metrics.radius);
  }
  state.flight.active = starting;
  if (starting) {
    state.flight.lat = startPoint?.lat ?? 51.16;
    state.flight.lon = startPoint?.lon ?? 10.45;
    state.flight.heading = 90;
    state.flight.turn = 0;
    state.flight.boost = false;
    state.flight.slow = false;
    state.flight.currentSpeed = state.flight.speeds.base;
    state.flight.totalDistance = 0;
    state.flight.lastFrame = performance.now();
    state.flight.cameraBlend = 0;
    state.flight.chaseZoom = 1.45;
    state.flight.paused = false;
    state.flight.trail = [{ lat: state.flight.lat, lon: state.flight.lon }];
    initializeFlightCourse();
    updateFlightCamera(true);
    feedback.textContent = "Flight active. Steer with Left/Right or A/D, hold W to boost, S to brake, and use the wheel to adjust the chase camera.";
  } else {
    const exitPoint = { lat: state.flight.lat, lon: state.flight.lon };
    state.flight.turn = 0;
    state.flight.boost = false;
    state.flight.slow = false;
    state.flight.paused = false;
    state.flight.trail = [];
    state.flight.cameraBlend = 0;
    state.flight.position = null;
    state.flight.tangent = null;
    window.planeRenderer?.setVisible(false);
    focusLatLon(exitPoint, 1.2);
    feedback.textContent = "Flight simulator stopped.";
  }
  renderFreeroamPanel();
}

function updateFlight() {
  const flight = state.flight;
  if (flight.paused) {
    flight.lastFrame = performance.now();
    return;
  }
  if (!flight.position || !flight.tangent) initializeFlightCourse();
  const now = performance.now();
  const elapsedHours = clamp((now - (flight.lastFrame || now)) / 3600000, 0, 0.002);
  flight.lastFrame = now;
  const elapsedSeconds = elapsedHours * 3600;
  const turnRadians = toRad(flight.turn * 24 * elapsedSeconds);
  if (turnRadians) flight.tangent = rotateAroundAxis(flight.tangent, flight.position, turnRadians);
  flight.tangent = normalizeTangent(flight.tangent, flight.position);
  const targetSpeed = flight.boost ? flight.speeds.boost : flight.slow ? flight.speeds.slow : flight.speeds.base;
  flight.currentSpeed += (targetSpeed - flight.currentSpeed) * clamp(elapsedSeconds * 2.6, 0, 1);
  const traveledKm = flight.currentSpeed * elapsedHours;
  flight.totalDistance += traveledKm;
  const step = traveledKm / (6371 + flight.altitude);
  const previousPosition = flight.position;
  const previousTangent = flight.tangent;
  flight.position = normalizeVector({
    x: previousPosition.x * Math.cos(step) + previousTangent.x * Math.sin(step),
    y: previousPosition.y * Math.cos(step) + previousTangent.y * Math.sin(step),
    z: previousPosition.z * Math.cos(step) + previousTangent.z * Math.sin(step),
  });
  flight.tangent = normalizeTangent(
    {
      x: previousTangent.x * Math.cos(step) - previousPosition.x * Math.sin(step),
      y: previousTangent.y * Math.cos(step) - previousPosition.y * Math.sin(step),
      z: previousTangent.z * Math.cos(step) - previousPosition.z * Math.sin(step),
    },
    flight.position,
  );
  const geo = vectorToLatLon(flight.position);
  flight.lat = geo.lat;
  flight.lon = geo.lon;
  flight.heading = tangentHeading(flight.position, flight.tangent);
  const lastTrailPoint = flight.trail[flight.trail.length - 1];
  if (!lastTrailPoint || distanceKm(lastTrailPoint, { lat: flight.lat, lon: flight.lon }) >= 20) {
    flight.trail.push({ lat: flight.lat, lon: flight.lon });
    if (flight.trail.length > 900) flight.trail.shift();
  }
  updateFlightCamera();
  const speedEl = modeContent.querySelector("#flight-speed");
  const totalEl = modeContent.querySelector("#flight-total");
  if (speedEl) speedEl.textContent = `Speed: ${Math.round(flight.currentSpeed).toLocaleString()} km/h`;
  if (totalEl) totalEl.textContent = `Total flown: ${Math.round(flight.totalDistance).toLocaleString()} km`;
  if (state.mode === "airports" && !state.answered && state.airportPair[1]) {
    const targetAirport = airportForCountry(state.airportPair[1]);
    const remaining = distanceKm({ lat: flight.lat, lon: flight.lon }, targetAirport);
    targetDistance.textContent = `${Math.round(remaining).toLocaleString()} km to ${targetAirport.iata}`;
    if (remaining <= 50) {
      state.answered = true;
      state.flight.active = false;
      state.stats.airports.total += 1;
      state.stats.airports.correct += 1;
      award(100, true);
      setFeedback(`Arrived at ${targetAirport.name}. +100 points.`, true);
      window.planeRenderer?.setVisible(false);
      showContinueButton();
    }
  }
}

function initializeFlightCourse() {
  const flight = state.flight;
  flight.position = latLonToVector(flight.lat, flight.lon);
  flight.tangent = headingTangent(flight.lat, flight.lon, flight.heading);
}

function updateFlightCamera(immediate = false) {
  const flight = state.flight;
  if (flight.paused) return;
  flight.cameraBlend = clamp(flight.cameraBlend + 0.025, 0, 1);
  const radial = flightVectorToProjectionBasis(flight.position);
  const forward = flightVectorToProjectionBasis(flight.tangent);
  const angle = toRad(clamp(flight.viewAngle, 5, 90));
  const viewNormal = normalizeVector({
    x: radial.x * Math.sin(angle) - forward.x * Math.cos(angle),
    y: radial.y * Math.sin(angle) - forward.y * Math.cos(angle),
    z: radial.z * Math.sin(angle) - forward.z * Math.cos(angle),
  });
  const forwardProjection = dotVector(forward, viewNormal);
  const screenUp = normalizeVector({
    x: forward.x - viewNormal.x * forwardProjection,
    y: forward.y - viewNormal.y * forwardProjection,
    z: forward.z - viewNormal.z * forwardProjection,
  });
  const screenRight = normalizeVector(crossVector(screenUp, viewNormal));
  state.northUp = false;
  state.freeMatrix = [
    screenRight.x, screenRight.y, screenRight.z,
    screenUp.x, screenUp.y, screenUp.z,
    viewNormal.x, viewNormal.y, viewNormal.z,
  ];
  const zoomFollow = immediate ? 1 : 0.18;
  state.zoom += (1.08 * flight.chaseZoom - state.zoom) * zoomFollow;
}

function flightVectorToProjectionBasis(vector) {
  return { x: vector.z, y: vector.y, z: vector.x };
}

function projectedFlightPosition() {
  const altitudeScale = (6371 + state.flight.altitude) / 6371;
  const point = state.freeMatrix
    ? applyMatrix3(state.freeMatrix, flightVectorToProjectionBasis(state.flight.position))
    : cameraPoint(state.flight.lat, state.flight.lon);
  return {
    x: point.x * altitudeScale,
    y: point.y * altitudeScale,
    z: point.z * altitudeScale,
  };
}

function drawFlightPlane(cx, cy, radius) {
  const planePoint = projectedFlightPosition();
  const surface = {
    ...projectCameraPoint(planePoint, cx, cy, radius),
    visible: planePoint.z >= 0,
  };
  if (!surface.visible) return;
  const plane = { x: surface.x, y: surface.y };
  const angle = -Math.PI / 2;
  const renderedModel = window.planeRenderer?.update({
    x: plane.x,
    y: plane.y,
    bank: state.flight.turn,
    boost: state.flight.boost,
    paused: state.flight.paused,
    zoom: state.flight.chaseZoom,
    viewAngle: state.flight.viewAngle,
  });
  if (renderedModel) return;
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(surface.x, surface.y, 18, 7, angle, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.translate(plane.x, plane.y);
  ctx.rotate(angle + Math.PI / 2);
  const bodyGradient = ctx.createLinearGradient(-17, 0, 17, 0);
  bodyGradient.addColorStop(0, "#82909d");
  bodyGradient.addColorStop(0.42, "#f7fbff");
  bodyGradient.addColorStop(0.62, "#d5e0e9");
  bodyGradient.addColorStop(1, "#73818e");
  ctx.fillStyle = bodyGradient;
  ctx.strokeStyle = "#07101a";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(0, -17);
  ctx.bezierCurveTo(3, -14, 4, -7, 5, -2);
  ctx.lineTo(17, 6);
  ctx.lineTo(17, 9);
  ctx.lineTo(5, 6);
  ctx.lineTo(4, 15);
  ctx.lineTo(9, 19);
  ctx.lineTo(8, 21);
  ctx.lineTo(0, 18);
  ctx.lineTo(-8, 21);
  ctx.lineTo(-9, 19);
  ctx.lineTo(-4, 15);
  ctx.lineTo(-5, 6);
  ctx.lineTo(-17, 9);
  ctx.lineTo(-17, 6);
  ctx.lineTo(-5, -2);
  ctx.bezierCurveTo(-4, -7, -3, -14, 0, -17);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#49d6c8";
  ctx.fillRect(-2.2, -11, 4.4, 2.2);
  ctx.restore();
}

function destinationPoint(lat, lon, heading, angularDegrees) {
  const distance = toRad(angularDegrees);
  const bearing = toRad(heading);
  const phi = toRad(lat);
  const lambda = toRad(lon);
  const nextLat = Math.asin(Math.sin(phi) * Math.cos(distance) + Math.cos(phi) * Math.sin(distance) * Math.cos(bearing));
  const nextLon =
    lambda +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance) * Math.cos(phi),
      Math.cos(distance) - Math.sin(phi) * Math.sin(nextLat),
    );
  return { lat: radToDeg(nextLat), lon: normalizeLon(radToDeg(nextLon)) };
}

function normalizeHeading(value) {
  return ((value % 360) + 360) % 360;
}

function headingTangent(lat, lon, heading) {
  const phi = toRad(lat);
  const lambda = toRad(lon);
  const bearing = toRad(heading);
  const north = {
    x: -Math.sin(phi) * Math.cos(lambda),
    y: Math.cos(phi),
    z: -Math.sin(phi) * Math.sin(lambda),
  };
  const east = { x: -Math.sin(lambda), y: 0, z: Math.cos(lambda) };
  return normalizeVector({
    x: north.x * Math.cos(bearing) + east.x * Math.sin(bearing),
    y: north.y * Math.cos(bearing) + east.y * Math.sin(bearing),
    z: north.z * Math.cos(bearing) + east.z * Math.sin(bearing),
  });
}

function tangentHeading(position, tangent) {
  const geo = vectorToLatLon(position);
  const north = headingTangent(geo.lat, geo.lon, 0);
  const east = headingTangent(geo.lat, geo.lon, 90);
  return normalizeHeading(radToDeg(Math.atan2(dotVector(tangent, east), dotVector(tangent, north))));
}

function normalizeTangent(tangent, position) {
  const radialAmount = dotVector(tangent, position);
  return normalizeVector({
    x: tangent.x - position.x * radialAmount,
    y: tangent.y - position.y * radialAmount,
    z: tangent.z - position.z * radialAmount,
  });
}

function rotateAroundAxis(vector, axis, angle) {
  const cross = crossVector(axis, vector);
  const alongAxis = dotVector(axis, vector) * (1 - Math.cos(angle));
  return normalizeVector({
    x: vector.x * Math.cos(angle) + cross.x * Math.sin(angle) + axis.x * alongAxis,
    y: vector.y * Math.cos(angle) + cross.y * Math.sin(angle) + axis.y * alongAxis,
    z: vector.z * Math.cos(angle) + cross.z * Math.sin(angle) + axis.z * alongAxis,
  });
}

function crossVector(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dotVector(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function normalizeAngle(value) {
  let angle = value;
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function lerpAngle(current, target, amount) {
  return current + normalizeAngle(target - current) * amount;
}

function drawOutlineChallenge(feature, rotationDegrees, hintLevel = 0) {
  const outlineCanvas = document.querySelector("#outline-canvas");
  if (!outlineCanvas) return;
  const outlineCtx = outlineCanvas.getContext("2d");
  const width = outlineCanvas.width;
  const height = outlineCanvas.height;
  outlineCtx.clearRect(0, 0, width, height);
  drawOutlineFallback(outlineCtx, feature, outlinePolygonsForFeature(feature), rotationDegrees, hintLevel, width, height);
}

function outlinePolygonsForFeature(feature) {
  const name = displayCountryName(feature);
  let polygons = feature.polygons;
  if (name === "France") polygons = polygons.filter((polygon) => getAverageCoordinate([polygon], 0) > -10);
  if (name === "Denmark") polygons = polygons.filter((polygon) => getAverageCoordinate([polygon], 1) < 60);
  if (name === "Netherlands") polygons = polygons.filter((polygon) => getAverageCoordinate([polygon], 0) > -10);
  if (name === "New Zealand") {
    polygons = polygons.filter((polygon) => polygonFillCenter(polygon[0] || []).lon > 160);
  }
  if (name === "United States") {
    polygons = polygons.filter((polygon) => {
      const center = polygonFillCenter(polygon[0] || []);
      return (center.lon < -50 && center.lon > -170 && center.lat > 18) || (center.lon > 170 && center.lat > 45);
    });
  }

  const weighted = polygons.map((polygon) => ({
    polygon,
    area: sphericalRingArea(polygon[0] || []),
    center: polygonFillCenter(polygon[0] || []),
  }));
  const largest = Math.max(0, ...weighted.map((item) => item.area));
  const capital = feature.gameCountry;
  const preserveDetail = Number(capital?.areaKm2 || 0) < 100_000;
  const kept = weighted.filter((item) => {
    const distance = distanceKm(item.center, capital);
    return (
      (item.area >= largest * (preserveDetail ? 0.00035 : 0.003) && (distance < 1_800 || item.area >= largest * 0.05)) ||
      (distance < (preserveDetail ? 1_200 : 850) && item.area >= largest * (preserveDetail ? 0.00008 : 0.00035))
    );
  });
  const referenceLon = circularMeanLongitude(kept.flatMap((item) => item.polygon[0] || []));
  return kept.map(({ polygon }) => polygon.map((ring) => unwrapOutlineRing(ring, referenceLon)));
}

function sphericalRingArea(ring) {
  if (ring.length < 3) return 0;
  const center = polygonFillCenter(ring);
  return ring.reduce((sum, point, index) => {
    if (!index) return sum;
    const a = distanceKm(center, { lat: ring[index - 1][1], lon: ring[index - 1][0] });
    const b = distanceKm(center, { lat: point[1], lon: point[0] });
    const c = distanceKm({ lat: ring[index - 1][1], lon: ring[index - 1][0] }, { lat: point[1], lon: point[0] });
    const semiperimeter = (a + b + c) / 2;
    return sum + Math.sqrt(Math.max(0, semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)));
  }, 0);
}

function circularMeanLongitude(points) {
  if (!points.length) return 0;
  const sum = points.reduce((total, [lon]) => ({
    x: total.x + Math.cos(toRad(lon)),
    y: total.y + Math.sin(toRad(lon)),
  }), { x: 0, y: 0 });
  return radToDeg(Math.atan2(sum.y, sum.x));
}

function unwrapOutlineRing(ring, referenceLon) {
  return ring.map(([lon, lat]) => {
    let unwrapped = lon;
    while (unwrapped - referenceLon > 180) unwrapped -= 360;
    while (unwrapped - referenceLon < -180) unwrapped += 360;
    return [unwrapped, lat];
  });
}

function drawCapitalMarker(outlineCtx, x, y, capital) {
  outlineCtx.beginPath();
  outlineCtx.arc(x, y, 7, 0, Math.PI * 2);
  outlineCtx.fillStyle = "#f0c75e";
  outlineCtx.fill();
  outlineCtx.strokeStyle = "#0f151d";
  outlineCtx.lineWidth = 3;
  outlineCtx.stroke();
  outlineCtx.font = "800 16px Inter, sans-serif";
  outlineCtx.fillStyle = "#f7f1d2";
  outlineCtx.strokeStyle = "rgba(15,21,29,0.9)";
  outlineCtx.lineWidth = 5;
  outlineCtx.strokeText(capital, x + 12, y - 10);
  outlineCtx.fillText(capital, x + 12, y - 10);
}

function drawOutlineFallback(outlineCtx, feature, polygons, rotationDegrees, hintLevel, width, height) {
  const points = polygons.flatMap((polygon) => polygon[0] || []);
  if (!points.length) return;
  const { centerLon, centerLat, angle, scale, offsetX, offsetY } = outlineLayout(points, rotationDegrees, width, height);

  outlineCtx.save();
  outlineCtx.translate(width / 2 - offsetX * scale, height / 2 - offsetY * scale);
  outlineCtx.rotate(angle);
  outlineCtx.beginPath();
  polygons.forEach((polygon) => {
    polygon.forEach((ring) => {
      ring.forEach(([lon, lat], index) => {
        const projected = outlineProjection(lon, lat, centerLon, centerLat);
        const x = projected.x * scale;
        const y = projected.y * scale;
        if (index === 0) outlineCtx.moveTo(x, y);
        else outlineCtx.lineTo(x, y);
      });
      outlineCtx.closePath();
    });
  });
  outlineCtx.fillStyle = "#49d6c8";
  outlineCtx.fill("evenodd");
  outlineCtx.lineWidth = Number(feature.gameCountry?.areaKm2 || 0) < 100_000 ? 1.35 : 2;
  outlineCtx.strokeStyle = "rgba(255,255,255,0.75)";
  outlineCtx.stroke();
  outlineCtx.restore();
  if (hintLevel >= 2) drawOutlineCapitalHint(outlineCtx, feature, polygons, rotationDegrees, width, height);
}

function drawOutlineCapitalHint(outlineCtx, feature, polygons, rotationDegrees, width, height) {
  const points = polygons.flatMap((polygon) => polygon[0] || []);
  const { centerLon, centerLat, angle, scale, offsetX, offsetY } = outlineLayout(points, rotationDegrees, width, height);
  let capitalLon = feature.gameCountry.lon;
  while (capitalLon - centerLon > 180) capitalLon -= 360;
  while (capitalLon - centerLon < -180) capitalLon += 360;
  const capitalPoint = outlineProjection(capitalLon, feature.gameCountry.lat, centerLon, centerLat);
  const x0 = capitalPoint.x;
  const y0 = capitalPoint.y;
  const x = width / 2 + (x0 * Math.cos(angle) - y0 * Math.sin(angle) - offsetX) * scale;
  const y = height / 2 + (x0 * Math.sin(angle) + y0 * Math.cos(angle) - offsetY) * scale;
  drawCapitalMarker(outlineCtx, x, y, feature.gameCountry.capital);
}

function outlineLayout(points, rotationDegrees, width, height) {
  const centerLon = circularMeanLongitude(points);
  const centerLat = points.reduce((sum, point) => sum + point[1], 0) / points.length;
  const angle = toRad(rotationDegrees);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const rotated = points.map(([lon, lat]) => {
    const { x, y } = outlineProjection(lon, lat, centerLon, centerLat);
    return [x * cosine - y * sine, x * sine + y * cosine];
  });
  const minX = Math.min(...rotated.map(([x]) => x));
  const maxX = Math.max(...rotated.map(([x]) => x));
  const minY = Math.min(...rotated.map(([, y]) => y));
  const maxY = Math.max(...rotated.map(([, y]) => y));
  const spanX = Math.max(0.001, maxX - minX);
  const spanY = Math.max(0.001, maxY - minY);
  return {
    centerLon,
    centerLat,
    angle,
    offsetX: (minX + maxX) / 2,
    offsetY: (minY + maxY) / 2,
    scale: Math.min((width * 0.78) / spanX, (height * 0.78) / spanY),
  };
}

function outlineProjection(lon, lat, centerLon, centerLat) {
  const phi = toRad(lat);
  const phi0 = toRad(centerLat);
  const deltaLon = toRad(normalizeLon(lon - centerLon));
  const denominator = Math.max(
    0.02,
    1 + Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLon),
  );
  const scale = Math.sqrt(2 / denominator);
  return {
    x: scale * Math.cos(phi) * Math.sin(deltaLon),
    y: -scale * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLon)),
  };
}

function showOutlineHint() {
  if (state.mode !== "outline" || state.answered) return;
  if (state.outlineHintLevel >= 3) {
    giveUpOutline();
    return;
  }
  state.outlineHintLevel = clamp((state.outlineHintLevel || 0) + 1, 1, 3);
  if (state.outlineHintLevel === 1) state.outlineRotation = 0;
  drawOutlineChallenge(state.target, state.outlineRotation, state.outlineHintLevel);
  modeContent.querySelector("#outline-compass").hidden = state.outlineHintLevel < 1;
  modeContent.querySelector("#outline-hint-count").textContent = `Hints used: ${state.outlineHintLevel}/3`;
  const hintText = modeContent.querySelector("#outline-hint-text");
  if (state.outlineHintLevel === 1) hintText.textContent = "North is now up.";
  if (state.outlineHintLevel === 2) hintText.textContent = `Capital location marked: ${state.target.gameCountry.capital}.`;
  if (state.outlineHintLevel === 3) {
    const country = state.target.gameCountry;
    hintText.textContent = `${country.region}.`;
    modeContent.querySelector("#outline-hint").textContent = "Give up";
  }
}

function giveUpOutline() {
  if (state.answered) return;
  state.answered = true;
  state.outlineRotation = 0;
  state.outlineHintLevel = 3;
  drawOutlineChallenge(state.target, 0, 3);
  modeContent.querySelector("#outline-compass").hidden = false;
  modeContent.querySelector("#outline-hint").textContent = `Answer: ${state.correctAnswer}`;
  modeContent.querySelector("#outline-hint").disabled = true;
  state.stats.outline.total += 1;
  award(0, false);
  updateModeStat("outline");
  setFeedback(`The answer was ${state.correctAnswer}.`, false);
  showContinueButton();
}

function renderOutlineSuggestions(value) {
  const list = modeContent.querySelector("#outline-suggestions");
  const query = rawCountryKey(value);
  if (!query) {
    list.innerHTML = "";
    return;
  }
  const matches = countrySuggestions(query);
  state.outlineSuggestions = matches;
  state.outlineSuggestionIndex = -1;
  list.innerHTML = matches
    .map((country) => `<button class="suggestion-button" data-country="${escapeAttribute(country.name)}">${country.name}</button>`)
    .join("");
  list.querySelectorAll("[data-country]").forEach((button) => {
    button.addEventListener("click", () => {
      modeContent.querySelector("#outline-guess").value = button.dataset.country;
      submitOutlineGuess(button.dataset.country);
    });
  });
}

function moveOutlineSuggestion(direction) {
  state.outlineSuggestionIndex = moveCountrySuggestion(
    "#outline-suggestions",
    state.outlineSuggestionIndex,
    direction,
  );
}

function submitOutlineGuess(value) {
  if (state.answered) return;
  const guess = rawCountryKey(countryFromInput(value, "#outline-suggestions")?.name || value);
  if (!guess) return;
  const correct = guess === rawCountryKey(state.correctAnswer);
  modeContent.querySelector("#outline-guess")?.blur();
  const points = correct ? [100, 75, 50, 25][state.outlineHintLevel] : 0;
  award(points, correct);
  state.stats.outline.total += 1;
  if (correct) state.stats.outline.correct += 1;
  updateModeStat("outline");
  setFeedback(correct ? `Correct: ${state.correctAnswer}. +${points} points.` : `Not quite. It was ${state.correctAnswer}.`, correct);
  state.answered = true;
  showContinueButton();
}

function setupFlags() {
  state.target = randomCountry();
  state.correctAnswer = state.target.name;
  state.options = makeOptions(state.target, 5);
  state.flagReveal = 0;
  state.flagCovers = shuffle(Array.from({ length: 12 }, (_, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    return {
      left: column * 22 + Math.round(Math.random() * 4),
      top: row * 27 + Math.round(Math.random() * 5),
      width: 27 + Math.round(Math.random() * 10),
      height: 29 + Math.round(Math.random() * 12),
    };
  })).slice(0, 9);
  modeKicker.textContent = "Flag Sprint";
  challengeTitle.textContent = "Flag Sprint";
  if (state.flagHard) {
    modeContent.innerHTML = `
      <h3 class="panel-title">Flag challenge</h3>
      <label class="check-control mode-toggle">
        <input type="checkbox" id="flag-hard" checked>
        <span>Hard mode</span>
      </label>
      <div class="flag-display hard-flag-display">
        ${flagImage(state.target, "Partially covered mystery flag")}
        <div class="flag-covers" id="flag-covers">${flagCoverHtml()}</div>
      </div>
      <p class="media-question">What country is this?</p>
      <p class="answer-stat" id="mode-answer-stat">${formatModeStat("flags")}</p>
      <button class="answer-button" id="flag-reveal">Reveal more</button>
      <div class="search-answer">
        <input id="flag-guess" autocomplete="off" placeholder="Type a country name">
        <div class="suggestion-list" id="flag-suggestions"></div>
      </div>
    `;
    bindFlagModeToggle();
    const input = modeContent.querySelector("#flag-guess");
    input.addEventListener("input", () => renderFlagSuggestions(input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveFlagSuggestion(event.key === "ArrowDown" ? 1 : -1);
        return;
      }
      if (event.key !== "Enter") return;
      event.preventDefault();
      const active = modeContent.querySelector("#flag-suggestions .suggestion-button.active");
      submitHardFlagGuess(active?.dataset.country || input.value);
    });
    modeContent.querySelector("#flag-reveal").addEventListener("click", revealFlag);
    return;
  }
  modeContent.innerHTML = `
    <h3 class="panel-title">Flag challenge</h3>
    <label class="check-control mode-toggle">
      <input type="checkbox" id="flag-hard">
      <span>Hard mode</span>
    </label>
    <div class="flag-display">${flagImage(state.target, "Mystery flag")}</div>
    <p class="media-question">What country is this?</p>
    <p class="answer-stat" id="mode-answer-stat">${formatModeStat("flags")}</p>
    <div class="answer-grid">
      ${state.options.map((country) => `<button class="answer-button" data-answer="${country.name}">${country.name}</button>`).join("")}
    </div>
  `;
  bindFlagModeToggle();
  modeContent.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => checkAnswer(button, button.dataset.answer === state.target.name));
  });
}

function bindFlagModeToggle() {
  modeContent.querySelector("#flag-hard").addEventListener("change", (event) => {
    state.flagHard = event.target.checked;
    localStorage.setItem("geosphere-flag-hard", String(state.flagHard));
    newRound("flags");
  });
}

function flagCoverHtml() {
  return state.flagCovers.map((cover, index) =>
    `<span class="flag-cover cover-${index}" style="left:${cover.left}%;top:${cover.top}%;width:${cover.width}%;height:${cover.height}%"></span>`,
  ).join("");
}

function revealFlag() {
  if (state.answered) return;
  if (state.flagReveal >= 3) {
    state.answered = true;
    state.stats.flags.total += 1;
    award(0, false);
    updateModeStat("flags");
    setFeedback(`The answer was ${state.correctAnswer}.`, false);
    showContinueButton();
    return;
  }
  state.flagReveal += 1;
  modeContent.querySelectorAll(".flag-cover").forEach((cover, index) => {
    cover.classList.toggle("revealed", index < state.flagReveal * 3);
  });
  if (state.flagReveal >= 3) modeContent.querySelector("#flag-reveal").textContent = "Give up";
}

function renderFlagSuggestions(value) {
  const list = modeContent.querySelector("#flag-suggestions");
  const query = rawCountryKey(value);
  if (!query) {
    list.innerHTML = "";
    return;
  }
  const matches = countrySuggestions(query);
  state.flagSuggestionIndex = -1;
  list.innerHTML = matches
    .map((country) => `<button class="suggestion-button" data-country="${escapeAttribute(country.name)}">${country.name}</button>`)
    .join("");
  list.querySelectorAll("[data-country]").forEach((button) => {
    button.addEventListener("click", () => submitHardFlagGuess(button.dataset.country));
  });
}

function moveFlagSuggestion(direction) {
  state.flagSuggestionIndex = moveCountrySuggestion("#flag-suggestions", state.flagSuggestionIndex, direction);
}

function submitHardFlagGuess(value) {
  if (state.answered) return;
  const correct = rawCountryKey(countryFromInput(value, "#flag-suggestions")?.name || value) === rawCountryKey(state.correctAnswer);
  modeContent.querySelector("#flag-guess")?.blur();
  award(correct ? 1 : 0, correct);
  state.stats.flags.total += 1;
  if (correct) state.stats.flags.correct += 1;
  updateModeStat("flags");
  setFeedback(correct ? `Correct: ${state.correctAnswer}. +1 point.` : `Not quite. It was ${state.correctAnswer}.`, correct);
  state.answered = true;
  showContinueButton();
}

function setupDistance() {
  setCoordinateLines(false, false);
  const pair = shuffle([...countries]).slice(0, 2);
  state.distancePair = pair;
  const realDistance = Math.round(distanceKm(pair[0], pair[1]));
  state.correctAnswer = `${realDistance}`;
  modeKicker.textContent = "Distance Duel";
  challengeTitle.textContent = "Guess the capital-to-capital distance";
  targetDistance.textContent = "Distance Duel";
  modeContent.innerHTML = `
    <h3 class="panel-title">Distance estimate</h3>
    <div class="distance-row">
      <div class="distance-country">
        ${flagImage(pair[0], `Flag of ${pair[0].name}`)}
        <strong>${pair[0].capital}</strong>
        <small>${pair[0].name}</small>
      </div>
      <span>to</span>
      <div class="distance-country">
        ${flagImage(pair[1], `Flag of ${pair[1].name}`)}
        <strong>${pair[1].capital}</strong>
        <small>${pair[1].name}</small>
      </div>
    </div>
    <div class="guess-line">
      <input id="distance-guess" inputmode="numeric" placeholder="Kilometers">
      <button class="mini-button" id="submit-distance">Check</button>
    </div>
    <div class="best-guess-box" id="best-distance-guess">Best guess: ${state.bestDistanceGuess ? `${state.bestDistanceGuess.guess.toLocaleString()} km (${state.bestDistanceGuess.error.toFixed(1)}% off)` : "None yet"}</div>
    <div id="distance-history">${distanceHistoryHtml()}</div>
  `;
  const midpoint = greatCirclePoints(pair[0].lat, pair[0].lon, pair[1].lat, pair[1].lon, 2)[1];
  focusLatLon(midpoint, distanceStartZoom(realDistance));
  const submit = () => {
    if (state.answered) return;
    const guess = Number(modeContent.querySelector("#distance-guess").value);
    if (!Number.isFinite(guess) || guess <= 0) {
      setFeedback("Type a distance in kilometers.", false);
      return;
    }
    const error = Math.abs(guess - realDistance);
    const percent = error / realDistance;
    const points = distanceScore(percent);
    state.distanceHistory.unshift({
      route: `${pair[0].capital}–${pair[1].capital}`,
      guess,
      trueDistance: realDistance,
      deviation: percent * 100,
      offKm: error,
      points,
    });
    state.distanceHistory = state.distanceHistory.slice(0, 5);
    modeContent.querySelector("#distance-history").innerHTML = distanceHistoryHtml();
    if (!state.bestDistanceGuess || percent * 100 < state.bestDistanceGuess.error) {
      state.bestDistanceGuess = { guess, error: percent * 100 };
    }
    modeContent.querySelector("#best-distance-guess").textContent =
      `Best guess: ${state.bestDistanceGuess.guess.toLocaleString()} km (${state.bestDistanceGuess.error.toFixed(1)}% off)`;
    award(points, points >= 50);
    setFeedback(
      `Actual distance: ${realDistance.toLocaleString()} km. Miss: ${(percent * 100).toFixed(1)}%. +${points} points.`,
      points >= 50,
    );
    state.answered = true;
    showContinueButton();
  };
  modeContent.querySelector("#submit-distance").addEventListener("click", submit);
  modeContent.querySelector("#distance-guess").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (state.answered) modeContent.querySelector("#continue-round")?.click();
    else submit();
  });
}

function distanceHistoryHtml() {
  if (!state.distanceHistory.length) return `<p class="panel-note">Previous rounds will appear here.</p>`;
  return `
    <div class="comparison-table-wrap distance-history">
      <table class="comparison-table">
        <thead><tr><th>Route</th><th>Guessed distance</th><th>Deviation</th><th>Points</th></tr></thead>
        <tbody>
          ${state.distanceHistory
            .map(
              (round) =>
                `<tr><td>${round.route}</td><td>${Math.round(round.guess).toLocaleString()} km<br><small>True distance: ${Math.round(round.trueDistance).toLocaleString()} km</small></td><td><strong>${Math.round(round.offKm).toLocaleString()} km</strong><br>(${round.deviation.toFixed(1)}% off)</td><td>${round.points}</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function setupTrivia() {
  const next = nextTriviaQuestion();
  state.target = next.country;
  const data = next.data;
  state.correctAnswer = data.answer;
  state.options = data.options;
  modeKicker.textContent = "Trivia Atlas";
  challengeTitle.textContent = "Trivia Atlas";
  modeContent.innerHTML = `
    <h3 class="panel-title">Trivia question</h3>
    ${triviaVisual(data, state.target)}
    <p class="media-question">${data.question}</p>
    <p class="answer-stat" id="mode-answer-stat">${formatModeStat("trivia")}</p>
    <div class="answer-grid">
      ${data.options.map((option) => `<button class="answer-button" data-answer="${option}">${option}</button>`).join("")}
    </div>
  `;
  modeContent.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => checkAnswer(button, button.dataset.answer === data.answer));
  });
  hydrateTriviaImage(data);
}

function nextTriviaQuestion() {
  const basicTypes = ["capital", "region", "population", "clue", "area", "currency", "gdp", "gdpPerCapita"];
  const themedTypes = ["landmark", "dish", "city", "timezone", "carBrand", "company", "climate", "tourism", "independence", "landscape", "mountain", "river", "nationalPark"];
  const availableTypes = [...basicTypes, ...themedTypes].filter((type) => type !== state.lastTriviaType);
  const type = randomFrom(availableTypes);
  state.lastTriviaType = type;
  if (themedTypes.includes(type)) {
    const data = themedTrivia(type);
    return { country: data.country, data };
  }
  const eligible = countries.filter((country) => {
    if (type === "currency") return Boolean(currencyCodeForCountry(country));
    if (type === "gdp" || type === "gdpPerCapita") return Boolean(country.gdpMd);
    return true;
  });
  const country = randomFrom(eligible);
  return { country, data: triviaData(country, type) };
}

function triviaData(country, type) {
  if (type === "capital") {
    return {
      question: `What is the capital of ${country.name}?`,
      answer: country.capital,
      options: shuffle([country.capital, ...shuffle(countries.filter((c) => c !== country)).slice(0, 4).map((c) => c.capital)]),
      visual: "flag",
    };
  }
  if (type === "region") {
    const regions = [...new Set(countries.map((c) => c.region))];
    return {
      question: `Which region is ${country.name} in?`,
      answer: country.region,
      options: shuffle([country.region, ...shuffle(regions.filter((region) => region !== country.region)).slice(0, 4)]),
      visual: "flag",
    };
  }
  if (type === "population") {
    return {
      question: `About how many people live in ${country.name}?`,
      answer: country.population,
      options: shuffle([country.population, ...shuffle(countries.filter((c) => c !== country)).slice(0, 4).map((c) => c.population)]),
      visual: "flag",
    };
  }
  if (type === "area") {
    return {
      question: `What is the approximate land area of ${country.name}?`,
      answer: `${Number(country.areaKm2 || 0).toLocaleString()} km²`,
      options: shuffle([
        `${Number(country.areaKm2 || 0).toLocaleString()} km²`,
        ...shuffle(countries.filter((c) => c !== country && c.areaKm2)).slice(0, 4).map((c) => `${Number(c.areaKm2).toLocaleString()} km²`),
      ]),
      visual: "flag",
    };
  }
  if (type === "currency") {
    const answer = currencyForCountry(country);
    const options = [...new Set([answer, ...shuffle(countries.filter((item) => item !== country)).map(currencyForCountry).filter((value) => value !== answer)])].slice(0, 5);
    return {
      question: `What currency is used in ${country.name}?`,
      answer,
      options: shuffle(options),
      visual: "image",
      visualTitle: country.name,
      visualLabel: "Currency",
      imageQuery: `${country.name} banknotes currency`,
    };
  }
  if (type === "gdp" || type === "gdpPerCapita") {
    const value = type === "gdp" ? formatGdp(country.gdpMd) : formatMoney(country.gdpPerCapita);
    const pool = countries.filter((item) => item !== country && item.gdpMd);
    const options = shuffle([value, ...shuffle(pool).slice(0, 4).map((item) => type === "gdp" ? formatGdp(item.gdpMd) : formatMoney(item.gdpPerCapita))]);
    return {
      question: type === "gdp" ? `What is the approximate GDP of ${country.name}?` : `What is the approximate GDP per capita of ${country.name}?`,
      answer: value,
      options,
      visual: "card",
      visualTitle: country.name,
      visualLabel: type === "gdp" ? "GDP" : "GDP per capita",
      imageQuery: `${country.name} economy money`,
    };
  }
  const themed = themedTrivia(type);
  if (themed) return themed;
  return {
    question: "Which country matches this clue?",
    answer: country.name,
    options: makeOptions(country, 5).map((c) => c.name),
    visual: "flag",
  };
}

function checkHunt(country) {
  if (state.answered) return;
  const correct = sameCountry(country, state.target);
  const clickedName = displayCountryName(country);
  if (correct) {
    const base = [100, 85, 70, 55, 40][state.huntHints] || 40;
    award(base, true);
    setFeedback(`Correct: ${clickedName}. +${base} points.`, true);
    state.answered = true;
    showContinueButton();
    return;
  }
  state.huntWrong += 1;
  const guessesLeft = Math.max(0, 5 - state.huntWrong);
  setFeedback(`That was ${clickedName}. Try again. ${guessesLeft} guess${guessesLeft === 1 ? "" : "es"} left.`, false);
  if (!guessesLeft) giveUpHunt();
}

function checkAnswer(button, correct) {
  if (state.answered) return;
  modeContent.querySelectorAll(".answer-button").forEach((candidate) => {
    const isCorrect = candidate.dataset.answer === state.correctAnswer;
    candidate.disabled = true;
    if (correct && candidate === button) candidate.classList.add("correct");
    if (!correct && candidate === button) candidate.classList.add("wrong");
    if (!correct && isCorrect) candidate.classList.add("correct");
  });
  const correctPoints = state.mode === "flags" || state.mode === "trivia" ? 1 : 12;
  award(correct ? correctPoints : state.mode === "flags" || state.mode === "trivia" ? 0 : -3, correct);
  if (state.stats[state.mode]) {
    state.stats[state.mode].total += 1;
    if (correct) state.stats[state.mode].correct += 1;
  }
  updateModeStat(state.mode);
  const extra = state.mode === "trivia" ? `The answer was ${state.correctAnswer}.` : `${state.target.name}: capital ${state.target.capital}.`;
  setFeedback(correct ? `Correct. +${correctPoints} point${correctPoints === 1 ? "" : "s"}.` : `Not quite. ${extra}`, correct);
  state.answered = true;
  if (state.mode !== "hunt") showContinueButton();
}

function showContinueButton(allowAutoNext = true) {
  if (modeContent.querySelector("#continue-round")) return;
  const button = document.createElement("button");
  button.id = "continue-round";
  button.className = "continue-button";
  button.textContent = "Continue to next";
  button.addEventListener("click", () => newRound(state.mode));
  modeContent.appendChild(button);
  if (state.autoNext && allowAutoNext) {
    clearTimeout(state.autoNextTimer);
    state.autoNextTimer = setTimeout(() => newRound(state.mode), 1000);
  }
}

function award(points, success) {
  const stat = state.gameScores[state.mode];
  stat.score = Math.max(0, stat.score + points);
  stat.streak = success ? stat.streak + 1 : 0;
  stat.best = Math.max(stat.best, stat.score);
  localStorage.setItem(`geosphere-best-${state.mode}`, stat.best);
  updateScore();
}

function updateScore() {
  const stat = state.gameScores[state.mode];
  scoreEl.textContent = stat.score;
  streakEl.textContent = stat.streak;
  bestEl.textContent = stat.best;
}

function setFeedback(text, success) {
  feedback.textContent = text;
  feedback.className = `feedback ${success ? "good" : "bad"}`;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  requestGlobeRender();
}

function draw() {
  state.globeFrame = null;
  if (!usesGlobe(state.mode)) return;
  const traverseHintAnimating =
    state.mode === "traverse" && !state.answered && state.traverse.hints === 1 && Boolean(state.traverse.hintCountry);
  const animating = (state.flight.active && !state.flight.paused) || Boolean(state.orientationTarget) || traverseHintAnimating;
  if (!state.renderDirty && !animating) return;
  state.renderDirty = false;
  if (state.orientationTarget) {
    state.yaw = lerpAngle(state.yaw, state.orientationTarget.yaw, 0.12);
    state.pitch += (state.orientationTarget.pitch - state.pitch) * 0.12;
    state.roll = lerpAngle(state.roll, state.orientationTarget.roll, 0.12);
    if (
      Math.abs(normalizeAngle(state.yaw - state.orientationTarget.yaw)) < 0.001 &&
      Math.abs(state.pitch - state.orientationTarget.pitch) < 0.001 &&
      Math.abs(normalizeAngle(state.roll - state.orientationTarget.roll)) < 0.001
    ) {
      Object.assign(state, state.orientationTarget);
      state.orientationTarget = null;
    }
  }
  if (state.flight.active) updateFlight();
  document.querySelector("#reset-view").disabled = state.flight.active && !state.flight.paused;
  const { width, height, radius, cx, cy } = globeMetrics();
  const traversePuzzle = state.mode === "traverse" && !state.answered;

  ctx.clearRect(0, 0, width, height);
  drawStars(width, height);
  drawSphere(cx, cy, radius);
  drawCountries(cx, cy, radius);
  if (state.mode === "free" && state.showElevation) drawElevationOverlay(cx, cy, radius);
  drawViewfinderFrame(cx, cy, radius);
  if ((state.showNight || state.fullNight) && state.mode === "free") drawNightOverlay(cx, cy, radius);
  drawTimezoneLines(cx, cy, radius);
  if (state.mode !== "viewfinder" && !traversePuzzle) drawCoordinateLines(cx, cy, radius);
  if (state.mode !== "viewfinder" || state.viewShowCapitals) drawActiveMarkers(cx, cy, radius);
  if (state.mode === "viewfinder" && state.viewShowCapitals) drawViewfinderCapitals(cx, cy, radius);
  drawDistanceArc(cx, cy, radius);
  drawFreeroamCompareLines(cx, cy, radius);
  drawTraverseRoute(cx, cy, radius);
  drawFlightTrail(cx, cy, radius);
  if (["free", "airports"].includes(state.mode) && state.flight.active) drawFlightPlane(cx, cy, radius);
  drawMapMarkers(cx, cy, radius);
  drawCountryNameLabels(cx, cy, radius);
  drawWaterLabels(cx, cy, radius);
  drawAirportCompass(width, height);
  if (state.mode !== "distance" && !traversePuzzle) drawDistanceScale(width, height, radius);
  if (animating) state.globeFrame = requestAnimationFrame(draw);
}

function globeMetrics() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const flightBlend = ["free", "airports"].includes(state.mode) && state.flight.active ? state.flight.cameraBlend : 0;
  const normalRadius = Math.min(width, height) * 0.42 * state.zoom;
  const chaseRadius = Math.min(width, height) * 0.78 * state.flight.chaseZoom;
  const radius = normalRadius + (chaseRadius - normalRadius) * flightBlend;
  let cx = width / 2;
  let cy = height / 2;
  if (flightBlend && state.flight.position) {
    const planeCamera = projectedFlightPosition();
    const targetX = width * 0.5;
    const targetY = height * 0.5;
    cx = width / 2 + (targetX - planeCamera.x * radius - width / 2) * flightBlend;
    cy = height / 2 + (targetY + planeCamera.y * radius - height / 2) * flightBlend;
  }
  return {
    width,
    height,
    radius,
    cx,
    cy,
  };
}

function drawStars(width, height) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  for (let i = 0; i < 80; i += 1) {
    const x = (i * 109) % width;
    const y = (i * 71) % height;
    const size = (i % 3) + 0.8;
    ctx.globalAlpha = 0.12 + ((i * 13) % 30) / 100;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
}

function drawSphere(cx, cy, radius) {
  const gradient = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
  gradient.addColorStop(0, "#3d9bff");
  gradient.addColorStop(0.45, "#145a95");
  gradient.addColorStop(1, "#071c32");
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.stroke();
  ctx.restore();
}

function drawCoordinateLines(cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  if (state.showEquator) {
    ctx.strokeStyle = "#05080b";
    ctx.lineWidth = 2.4;
    drawProjectedLine(cx, cy, radius, range(-180, 180, 3).map((lon) => ({ lat: 0, lon })));
  }

  if (state.showGreenwich) {
    ctx.strokeStyle = "#05080b";
    ctx.lineWidth = 2.4;
    drawProjectedLine(cx, cy, radius, range(-90, 90, 2).map((lat) => ({ lat, lon: 0 })));
  }
  ctx.restore();
}

function drawTimezoneLines(cx, cy, radius) {
  if (state.mode !== "free" || !state.showTimezones) return;
  if (!state.timezoneBoundaries) {
    if (!state.timezoneLoading) loadTimezoneBoundaries();
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  const size = 220;
  if (timezoneCanvas.width !== size) {
    timezoneCanvas.width = size;
    timezoneCanvas.height = size;
  }
  const image = timezoneCtx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sx = ((x + 0.5) / size) * 2 - 1;
      const sy = ((y + 0.5) / size) * 2 - 1;
      if (sx * sx + sy * sy > 1) continue;
      const geo = screenToLatLon(cx + sx * radius, cy + sy * radius, cx, cy, radius);
      if (!geo) continue;
      const zoneIndex = timezoneGridIndexAt(geo.lat, geo.lon);
      if (zoneIndex < 0) continue;
      const color = state.timezoneBoundaries[zoneIndex].color;
      const pixel = (y * size + x) * 4;
      image.data[pixel] = color[0];
      image.data[pixel + 1] = color[1];
      image.data[pixel + 2] = color[2];
      image.data[pixel + 3] = 105;
    }
  }
  timezoneCtx.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(timezoneCanvas, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.62)";
  ctx.lineWidth = 1.45;
  state.timezoneBoundaries.forEach((zone) => zone.rings.forEach((ring) => drawGeoRingSegments(ring, cx, cy, radius)));
  ctx.restore();
}

async function loadTimezoneBoundaries() {
  prepareTimezoneBoundaries();
}

function prepareTimezoneBoundaries() {
  if (state.timezoneBoundaries) {
    if (!state.timezoneGrid) buildTimezoneGrid();
    return;
  }
  if (!window.TIMEZONE_BOUNDARIES_GEOJSON?.features) return;
  state.timezoneBoundaries = window.TIMEZONE_BOUNDARIES_GEOJSON.features.map((feature, index) => {
    const polygons = simplifyPolygons(getFeaturePolygons(feature.geometry), 0.2);
    return {
      offset: Number(feature.properties?.name),
      color: hslToRgb(((Number(feature.properties?.name) + 12) * 29) % 360, 68, 58),
      polygons,
      preparedPolygons: polygons.map(prepareTimezonePolygon),
      rings: polygons.flatMap((polygon) => polygon),
    };
  });
  buildTimezoneGrid();
}

function buildTimezoneGrid() {
  const width = 360;
  const height = 180;
  const grid = new Int16Array(width * height);
  grid.fill(-1);
  const queue = [];
  for (let latIndex = 0; latIndex < height; latIndex += 1) {
    const lat = latIndex - 89.5;
    for (let lonIndex = 0; lonIndex < width; lonIndex += 1) {
      const lon = lonIndex - 179.5;
      let zoneIndex = state.timezoneBoundaries.findIndex((zone) =>
        zone.preparedPolygons.some((polygon) => pointInPreparedTimezonePolygon(lon, lat, polygon)),
      );
      grid[latIndex * width + lonIndex] = zoneIndex;
      if (zoneIndex >= 0) queue.push(latIndex * width + lonIndex);
    }
  }
  let cursor = 0;
  while (cursor < queue.length) {
    const index = queue[cursor++];
    const latitude = Math.floor(index / width);
    const longitude = index % width;
    const neighbors = [
      latitude > 0 ? index - width : -1,
      latitude < height - 1 ? index + width : -1,
      latitude * width + ((longitude - 1 + width) % width),
      latitude * width + ((longitude + 1) % width),
    ];
    neighbors.forEach((neighbor) => {
      if (neighbor < 0 || grid[neighbor] >= 0) return;
      grid[neighbor] = grid[index];
      queue.push(neighbor);
    });
  }
  state.timezoneGrid = grid;
}

function prepareTimezonePolygon(polygon) {
  return polygon.map((ring) => {
    if (!ring.length) return { points: [], centerLon: 0, minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
    const points = [[ring[0][0], ring[0][1]]];
    let previousLon = ring[0][0];
    for (let index = 1; index < ring.length; index += 1) {
      let lon = ring[index][0];
      while (lon - previousLon > 180) lon -= 360;
      while (lon - previousLon < -180) lon += 360;
      points.push([lon, ring[index][1]]);
      previousLon = lon;
    }
    const bounds = points.reduce((result, point) => ({
      minLat: Math.min(result.minLat, point[1]),
      maxLat: Math.max(result.maxLat, point[1]),
      minLon: Math.min(result.minLon, point[0]),
      maxLon: Math.max(result.maxLon, point[0]),
    }), { minLat: Infinity, maxLat: -Infinity, minLon: Infinity, maxLon: -Infinity });
    return {
      points,
      centerLon: points.reduce((sum, point) => sum + point[0], 0) / points.length,
      ...bounds,
    };
  });
}

function pointInPreparedTimezonePolygon(lon, lat, polygon) {
  if (!pointInPreparedTimezoneRing(lon, lat, polygon[0])) return false;
  return !polygon.slice(1).some((ring) => pointInPreparedTimezoneRing(lon, lat, ring));
}

function pointInPreparedTimezoneRing(lon, lat, ring) {
  if (!ring?.points.length || lat < ring.minLat || lat > ring.maxLat) return false;
  let testLon = lon;
  while (testLon - ring.centerLon > 180) testLon -= 360;
  while (testLon - ring.centerLon < -180) testLon += 360;
  if (testLon < ring.minLon || testLon > ring.maxLon) return false;
  let inside = false;
  for (let index = 0, previous = ring.points.length - 1; index < ring.points.length; previous = index, index += 1) {
    const [x, y] = ring.points[index];
    const [previousX, previousY] = ring.points[previous];
    if (y > lat !== previousY > lat &&
        testLon < ((previousX - x) * (lat - y)) / (previousY - y || Number.EPSILON) + x) {
      inside = !inside;
    }
  }
  return inside;
}

function timezoneGridIndexAt(lat, lon) {
  if (!state.timezoneGrid) return -1;
  const latIndex = clamp(Math.floor(lat + 90), 0, 179);
  const lonIndex = ((Math.floor(normalizeLon(lon) + 180) % 360) + 360) % 360;
  return state.timezoneGrid[latIndex * 360 + lonIndex];
}

function hslToRgb(hue, saturation, lightness) {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = hue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const [red, green, blue] =
    segment < 1 ? [chroma, second, 0] :
      segment < 2 ? [second, chroma, 0] :
        segment < 3 ? [0, chroma, second] :
          segment < 4 ? [0, second, chroma] :
            segment < 5 ? [second, 0, chroma] : [chroma, 0, second];
  const match = l - chroma / 2;
  return [red, green, blue].map((channel) => Math.round((channel + match) * 255));
}

function triangleMaxEdgeDegrees(triangle) {
  return Math.max(
    sphericalEdgeDegrees(triangle[0], triangle[1]),
    sphericalEdgeDegrees(triangle[1], triangle[2]),
    sphericalEdgeDegrees(triangle[2], triangle[0]),
  );
}

function timezoneOffsetAt(lat, lon) {
  prepareTimezoneBoundaries();
  const zone = state.timezoneBoundaries?.find((candidate) =>
    candidate.preparedPolygons.some((polygon) => pointInPreparedTimezonePolygon(lon, lat, polygon)),
  );
  return Number.isFinite(zone?.offset) ? zone.offset : Math.round(lon / 15);
}

function localTimeForCountry(country) {
  const offset = timezoneOffsetAt(getCenterLat(country), getCenterLon(country));
  const local = new Date(Date.now() + offset * 3600000);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(local);
  return `${time} (UTC${offset >= 0 ? "+" : ""}${offset})`;
}

function drawGeoRingSegments(ring, cx, cy, radius) {
  for (let i = 0; i < ring.length - 1; i += 1) {
    const aGeo = ring[i];
    const bGeo = ring[i + 1];
    if (isWrappedEdge(aGeo, bGeo)) continue;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(bGeo[0] - aGeo[0]), Math.abs(bGeo[1] - aGeo[1])) / 0.5));
    let previous = cameraPoint(aGeo[1], aGeo[0]);
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const current = cameraPoint(
        aGeo[1] + (bGeo[1] - aGeo[1]) * t,
        aGeo[0] + (bGeo[0] - aGeo[0]) * t,
      );
      const aVisible = previous.z >= 0;
      const bVisible = current.z >= 0;
      if (aVisible || bVisible) {
        const start = projectCameraPoint(aVisible ? previous : intersectHorizon(previous, current, 0), cx, cy, radius);
        const end = projectCameraPoint(bVisible ? current : intersectHorizon(previous, current, 0), cx, cy, radius);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
      previous = current;
    }
  }
}

function drawProjectedLine(cx, cy, radius, points) {
  let drawing = false;
  ctx.beginPath();
  points.forEach((point) => {
    const projected = project(point.lat, point.lon, cx, cy, radius);
    if (projected.visible) {
      if (!drawing) ctx.moveTo(projected.x, projected.y);
      else ctx.lineTo(projected.x, projected.y);
      drawing = true;
    } else {
      drawing = false;
    }
  });
  ctx.stroke();
}

function drawCountries(cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (state.mode === "viewfinder") {
    worldMap.forEach((feature) => drawTerrainSurface(feature, cx, cy, radius));
    if (state.viewShowBorders) {
      worldMap.forEach((feature) => {
        if (feature.renderTiles.some((tile) => tileIsVisible(tile, cx, cy, radius))) {
          drawFeatureBoundarySegments(feature, cx, cy, radius, false);
        }
      });
    }
    if (state.viewCorrectCountry) {
      const correctFeature = worldMap.find((feature) => sameCountry(feature, state.viewCorrectCountry));
      if (correctFeature) {
        ctx.save();
        ctx.globalAlpha = 0.48;
        ctx.fillStyle = "#42d77d";
        drawFeatureSurface(correctFeature, cx, cy, radius);
        ctx.restore();
        drawFeatureBoundarySegments(correctFeature, cx, cy, radius, true);
      }
    }
    if (state.viewWrongCountry) {
      const wrongFeature = worldMap.find((feature) => sameCountry(feature, state.viewWrongCountry));
      if (wrongFeature) {
        ctx.save();
        ctx.globalAlpha = 0.48;
        ctx.fillStyle = "#e85062";
        drawFeatureSurface(wrongFeature, cx, cy, radius);
        ctx.restore();
        drawFeatureBoundarySegments(wrongFeature, cx, cy, radius, true);
      }
    }
    ctx.restore();
    return;
  }

  worldMap.forEach((feature) => {
    if (
      state.mode === "traverse" &&
      !state.answered &&
      !sameCountry(feature, state.traverse.target) &&
      !sameCountry(feature, state.traverse.hintCountry) &&
      !state.traverse.route.some((country) => sameCountry(feature, country))
    ) {
      return;
    }
    if (!feature.renderTiles.some((tile) => tileIsVisible(tile, cx, cy, radius))) return;
    const isTarget =
      (state.mode === "hunt" && state.answered && sameCountry(feature, state.target)) ||
      (state.mode === "traverse" && sameCountry(feature, state.traverse.target));
    const isTraversePlayerPath =
      state.mode === "traverse" &&
      (state.traverse.route.some((country) => sameCountry(feature, country)) || sameCountry(feature, state.traverse.target));
    const isTraverseShortestPath =
      state.mode === "traverse" &&
      state.traverse.shortestShown &&
      state.traverse.shortest.some((name) => name === displayCountryName(feature));
    const isSelected =
      state.mode === "free"
        ? state.freeSelections.some((country) => sameCountry(feature, country))
        : state.mode === "traverse"
          ? isTraversePlayerPath || isTraverseShortestPath
        : sameCountry(feature, state.selected);
    const isHover = !["hunt", "traverse"].includes(state.mode) && sameCountry(feature, state.hover);
    const isTraverseHint =
      state.mode === "traverse" &&
      !state.answered &&
      state.traverse.hints >= 1 &&
      sameCountry(feature, state.traverse.hintCountry);
    const highlighted = isTarget || isSelected || isHover || isTraverseHint;
    const base = continentColors[feature.continent] || "#6ea879";
    const conquestTerritoryData = state.mode === "conquest" ? conquestTerritory(feature.gameCountry) : null;
    const conquestFaction = state.conquest?.factions.find((faction) => faction.id === conquestTerritoryData?.owner);
    const conquestColor = conquestTerritoryData?.owner === "neutral" ? "#59636e" : conquestFaction?.color;
    const traverseUnused =
      state.mode === "traverse" &&
      state.answered &&
      !(state.traverse.shortestShown ? isTraverseShortestPath : isTraversePlayerPath);

    ctx.globalAlpha = isTraverseHint ? 0.08 : 1;
    ctx.fillStyle = conquestColor || (isTraverseShortestPath
      ? "#b58cff"
      : isTraversePlayerPath
        ? "#49d6c8"
        : traverseUnused
          ? "#424a53"
          : isTarget
            ? "#f0c75e"
            : isSelected
              ? "#49d6c8"
              : isTraverseHint
                ? "#f7f1d2"
                : isHover
                  ? "#ffb066"
                  : base);
    drawFeatureSurface(feature, cx, cy, radius);
    ctx.globalAlpha = 1;
    drawFeatureBoundarySegments(feature, cx, cy, radius, highlighted, isTraverseHint);
  });
  ctx.restore();
}

function drawViewfinderFrame(cx, cy, radius) {
  if (state.mode !== "viewfinder" || !state.viewFrameOutline || state.viewFrameCorners.length < 3) return;
  const closed = [...state.viewFrameCorners, state.viewFrameCorners[0]];
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "#f0c75e";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  for (let index = 0; index < closed.length - 1; index += 1) {
    const a = closed[index];
    const b = closed[index + 1];
    const samples = greatCirclePoints(a.lat, a.lon, b.lat, b.lon, 24).map((point) =>
      project(point.lat, point.lon, cx, cy, radius),
    );
    drawArcSegments(samples, true, "#f0c75e", 4);
  }
  ctx.restore();
}

function drawTerrainSurface(feature, cx, cy, radius) {
  const terrainTiles = state.viewAltitude <= 1_600 && feature.terrainTilesFine
    ? feature.terrainTilesFine
    : feature.terrainTiles;
  terrainTiles.forEach((tile) => {
    if (!tileIsVisible(tile, cx, cy, radius)) return;
    tile.triangles.forEach((triangle) => {
      const clipped = clipRingToVisible(triangle.map(cameraVector));
      if (clipped.length < 3) return;
      const center = normalizeVector(triangle.reduce(
        (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z }),
        { x: 0, y: 0, z: 0 },
      ));
      const geo = vectorToLatLon(center);
      ctx.beginPath();
      clipped.forEach((point, index) => {
        const projected = projectCameraPoint(point, cx, cy, radius);
        if (!index) ctx.moveTo(projected.x, projected.y);
        else ctx.lineTo(projected.x, projected.y);
      });
      ctx.closePath();
      const color = terrainColor(geo.lat, geo.lon);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.85;
      ctx.stroke();
    });
  });
}

function terrainColor(lat, lon) {
  const absoluteLat = Math.abs(lat);
  const broadNoise = (Math.sin(toRad(lon * 7 + lat * 11)) + Math.sin(toRad(lon * 19 - lat * 5))) * 0.25 + 0.5;
  const localNoise = (Math.sin(toRad(lon * 47 + lat * 31)) + Math.cos(toRad(lon * 29 - lat * 53))) * 0.16;
  const noise = clamp(broadNoise + localNoise, 0, 1);
  const tropical = mixColor("#418d58", "#67ad70", noise);
  const temperate = mixColor("#6d9a55", "#8bb46c", noise);
  const cool = mixColor("#8da57b", "#b1c39f", noise);
  let base = tropical;
  if (absoluteLat >= 20 && absoluteLat < 35) base = mixColor(tropical, temperate, (absoluteLat - 20) / 15);
  else if (absoluteLat >= 35 && absoluteLat < 52) base = temperate;
  else if (absoluteLat >= 52) base = mixColor(temperate, cool, clamp((absoluteLat - 52) / 16, 0, 1));

  const desertWeight = Math.max(
    softClimateBox(lat, lon, 10, 36, -22, 62, 6),
    softClimateBox(lat, lon, -38, -12, 105, 155, 5),
  );
  const rainforestWeight = Math.max(
    softClimateBox(lat, lon, -15, 14, -86, -44, 5),
    softClimateBox(lat, lon, -12, 11, 5, 36, 5),
    softClimateBox(lat, lon, -13, 15, 90, 150, 5),
  );
  base = mixColor(base, mixColor("#c7a45f", "#dfc985", noise), desertWeight);
  base = mixColor(base, mixColor("#1d6843", "#37875a", noise), rainforestWeight);
  return mixColor(base, mixColor("#dce8ea", "#f5f8f8", noise), smoothStep(58, 75, absoluteLat));
}

function softClimateBox(lat, lon, minLat, maxLat, minLon, maxLon, feather) {
  const latitudeWeight = smoothStep(minLat - feather, minLat + feather, lat) *
    (1 - smoothStep(maxLat - feather, maxLat + feather, lat));
  const longitudeWeight = smoothStep(minLon - feather, minLon + feather, lon) *
    (1 - smoothStep(maxLon - feather, maxLon + feather, lon));
  return latitudeWeight * longitudeWeight;
}

function smoothStep(edge0, edge1, value) {
  const amount = clamp((value - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

function mixColor(a, b, amount) {
  const parse = (value) => {
    if (value.startsWith("#")) {
      return [1, 3, 5].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
    }
    const channels = value.match(/\d+(?:\.\d+)?/g);
    return channels ? channels.slice(0, 3).map(Number) : [0, 0, 0];
  };
  const first = parse(a);
  const second = parse(b);
  const mixed = first.map((value, index) => Math.round(value + (second[index] - value) * clamp(amount, 0, 1)));
  return `rgb(${mixed.join(",")})`;
}

function drawActiveMarkers(cx, cy, radius) {
  if (state.mode === "traverse") return;
  countries.forEach((country) => {
    const projected = project(country.lat, country.lon, cx, cy, radius);
    country.screen = projected;
    if (!projected.visible) return;

    const isTarget = sameCountry(country, state.target) && state.mode === "hunt" && state.answered;
    const isSelected =
      state.mode === "free"
        ? state.freeSelections.some((item) => sameCountry(item, country))
        : sameCountry(country, state.selected);
    const isHover = state.mode !== "hunt" && sameCountry(country, state.hover);
    const isDistanceEndpoint = state.mode === "distance" && state.distancePair.some((item) => sameCountry(item, country));
    const isTiny = isTinyCountry(country);
    if (!isTarget && !isSelected && !isHover && !isDistanceEndpoint && !isTiny) return;

    const size = isTarget || isSelected ? 9 : isTiny ? 5 : 7;
    const feature = worldMap.find((item) => sameCountry(item, country));
    const tinyColor = continentColors[feature?.continent || continentForCountry(country)] || "#6ea879";
    ctx.fillStyle = isTarget ? "#f0c75e" : isSelected ? "#49d6c8" : isTiny ? tinyColor : "#ffffff";
    ctx.globalAlpha = projected.alpha;
    if (isTiny && !isTarget && !isSelected) {
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawStar(projected.x, projected.y, size, size * 0.45);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = isHover ? 3 : 1.5;
    ctx.strokeStyle = "#111820";
    ctx.stroke();

    if ((isHover || isSelected) && state.mode !== "hunt") {
      ctx.fillStyle = "rgba(8,10,14,0.78)";
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      const label = `${displayCountryName(country)} - ${country.capital}`;
      ctx.font = "700 13px Inter, sans-serif";
      const metrics = ctx.measureText(label);
      const boxWidth = metrics.width + 18;
      const x = clamp(projected.x + 12, 8, canvas.clientWidth - boxWidth - 8);
      const y = clamp(projected.y - 30, 8, canvas.clientHeight - 34);
      roundedRect(x, y, boxWidth, 28, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f3f7fb";
      ctx.fillText(label, x + 9, y + 18);
    }
  });
}

function drawViewfinderCapitals(cx, cy, radius) {
  ctx.save();
  ctx.font = "700 12px Inter, sans-serif";
  state.viewCountries.forEach((country) => {
    const point = project(country.lat, country.lon, cx, cy, radius);
    if (!point.visible) return;
    ctx.fillStyle = "#f0c75e";
    drawStar(point.x, point.y, 6, 2.7);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(8,10,14,0.85)";
    ctx.strokeText(country.capital, point.x + 7, point.y - 7);
    ctx.fillStyle = "#f7f1d2";
    ctx.fillText(country.capital, point.x + 7, point.y - 7);
  });
  ctx.restore();
}

function drawMapMarkers(cx, cy, radius) {
  const markers = [];
  if (state.mode === "airports") {
    state.airportPair.forEach((country) => {
      const airport = airportForCountry(country);
      markers.push({ kind: "airport", name: airport.iata, code: airport.iata, fullName: airport.name, lat: airport.lat, lon: airport.lon });
    });
  } else if (state.mode === "free" && state.showAirports) {
    countries.forEach((country) => {
      const airport = airportForCountry(country);
      markers.push({ kind: "airport", name: airport.iata, code: airport.iata, fullName: airport.name, lat: airport.lat, lon: airport.lon });
    });
  }
  if (state.mode === "free" && state.showAllCapitals) {
    countries.forEach((country) => markers.push({
      kind: "capital", name: country.capital, lat: country.lat, lon: country.lon,
    }));
  }
  if (state.mode === "free" && state.showLandmarks) {
    landmarkData.forEach(([name, lat, lon, place, file, info]) => markers.push({
      kind: "landmark", name, lat, lon, place, info,
      image: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=420`,
    }));
  }
  if (state.mode === "free") state.markers.forEach((marker) => markers.push({ ...marker, kind: "user" }));
  state.visibleMapMarkers = markers;
  ctx.save();
  ctx.font = "700 11px Inter, sans-serif";
  markers.forEach((marker) => {
    const point = project(marker.lat, marker.lon, cx, cy, radius);
    marker.screen = point;
    if (!point.visible) return;
    if (marker.kind === "airport") {
      ctx.font = "900 18px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#081018";
      ctx.lineWidth = 4;
      ctx.strokeText("✈︎", point.x, point.y + 6);
      ctx.fillText("✈︎", point.x, point.y + 6);
      ctx.font = "700 11px Inter, sans-serif";
      ctx.textAlign = "start";
    } else if (marker.kind === "capital") {
      ctx.fillStyle = "#f3f7fb";
      drawStar(point.x, point.y, 6, 2.7);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(point.x, point.y, marker.kind === "landmark" ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = marker.kind === "landmark" ? "#f0c75e" : marker.kind === "user" ? "#ff6f61" : "#f3f7fb";
      ctx.fill();
      ctx.strokeStyle = "#081018";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    if (marker.kind !== "user" && (marker.kind === "capital" || marker.kind === "airport" || markers.length < 80 || state.zoom > 1.5)) {
      ctx.fillStyle = "#f3f7fb";
      ctx.strokeStyle = "rgba(8,10,14,0.9)";
      ctx.lineWidth = 3;
      ctx.strokeText(marker.name, point.x + 7, point.y - 6);
      ctx.fillText(marker.name, point.x + 7, point.y - 6);
    }
  });
  ctx.restore();
}

function mapMarkerAt(x, y) {
  return (state.visibleMapMarkers || []).find((marker) =>
    marker.screen?.visible && Math.hypot(marker.screen.x - x, marker.screen.y - y) <= 10,
  ) || null;
}

function drawStar(x, y, outerRadius, innerRadius) {
  ctx.beginPath();
  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 ? innerRadius : outerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (!index) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function continentForCountry(country) {
  const region = `${country?.region || ""}`.toLowerCase();
  if (region.includes("africa")) return "Africa";
  if (region.includes("america") || region.includes("caribbean")) return region.includes("south") ? "South America" : "North America";
  if (region.includes("asia") || region.includes("middle east")) return "Asia";
  if (region.includes("europe")) return "Europe";
  if (region.includes("oceania") || region.includes("pacific")) return "Oceania";
  return "";
}

function drawCountryNameLabels(cx, cy, radius) {
  const traverseHover = state.mode === "traverse" && state.answered && state.hover;
  if (!traverseHover && (state.mode !== "free" || !state.showCountryNames)) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = `${clamp(10 + state.zoom * 1.4, 10, 15)}px Inter, sans-serif`;
  worldMap.forEach((feature) => {
    if (traverseHover && !sameCountry(feature, state.hover)) return;
    const point = project(feature.labelLat, feature.labelLon, cx, cy, radius);
    if (!point.visible || point.z < 0.18) return;
    const label = displayCountryName(feature);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(5,10,16,0.88)";
    ctx.fillStyle = "rgba(247,251,255,0.92)";
    ctx.strokeText(label, point.x, point.y);
    ctx.fillText(label, point.x, point.y);
  });
  ctx.restore();
}

const majorWaterLabels = [
  { name: "Atlantic Ocean", lat: 7, lon: -35, area: "106.5 million km²", info: "The Atlantic is the world's second-largest ocean and separates the Americas from Europe and Africa." },
  { name: "Pacific Ocean", lat: 2, lon: -145, area: "165.3 million km²", info: "The Pacific is Earth's largest and deepest ocean, covering more area than all land combined." },
  { name: "Indian Ocean", lat: -20, lon: 78, area: "70.6 million km²", info: "The Indian Ocean is the warmest major ocean and is strongly influenced by monsoon circulation." },
  { name: "Arctic Ocean", lat: 79, lon: 5, area: "14.1 million km²", info: "The Arctic is the smallest and shallowest major ocean and is seasonally covered by sea ice." },
  { name: "Southern Ocean", lat: -61, lon: 25, area: "20.3 million km²", info: "The Southern Ocean encircles Antarctica and drives the powerful Antarctic Circumpolar Current." },
];

const minorWaterLabels = [
  { name: "Mediterranean Sea", lat: 35, lon: 18, info: "A nearly enclosed sea joining Europe, Africa, and Asia through the Strait of Gibraltar." },
  { name: "Caribbean Sea", lat: 15, lon: -75, info: "A tropical Atlantic sea bordered by the Antilles and the coasts of Central and South America." },
  { name: "Red Sea", lat: 20, lon: 38, info: "A narrow, warm sea between Africa and Arabia with extensive coral reefs." },
  { name: "Caspian Sea", lat: 41, lon: 51, info: "Despite its name, the Caspian is the world's largest enclosed inland body of water." },
  { name: "Black Sea", lat: 43, lon: 35, info: "A largely enclosed sea whose deep waters contain very little oxygen." },
  { name: "Baltic Sea", lat: 58, lon: 19, info: "A brackish northern European sea with limited exchange with the North Sea." },
  { name: "North Sea", lat: 56, lon: 3, info: "A shallow Atlantic sea important for shipping, fishing, energy, and offshore wind." },
  { name: "Great Lakes", lat: 45, lon: -84, info: "Five connected lakes containing about one-fifth of the world's surface fresh water." },
  { name: "Lake Victoria", lat: -1.1, lon: 33, info: "Africa's largest lake by area and the principal reservoir of the White Nile." },
  { name: "Lake Baikal", lat: 53.5, lon: 108, info: "The world's deepest lake and largest freshwater lake by volume." },
];

function drawWaterLabels(cx, cy, radius) {
  state.visibleWaterLabels = [];
  if (
    !usesGlobe(state.mode) ||
    state.mode === "viewfinder" ||
    (state.mode === "traverse" && !state.answered) ||
    state.zoom < 0.75
  ) return;
  const labels = [...majorWaterLabels, ...(state.mode === "free" && state.showWaterBodies ? minorWaterLabels : [])];
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "italic 700 11px Inter, sans-serif";
  labels.forEach((label) => {
    const point = project(label.lat, label.lon, cx, cy, radius);
    if (!point.visible || point.z < 0.2) return;
    const width = ctx.measureText(label.name).width;
    state.visibleWaterLabels.push({ ...label, x: point.x, y: point.y, width, height: 18 });
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(4,17,30,0.82)";
    ctx.fillStyle = "rgba(190,224,255,0.78)";
    ctx.strokeText(label.name, point.x, point.y);
    ctx.fillText(label.name, point.x, point.y);
  });
  ctx.restore();
}

function waterLabelAt(x, y) {
  return state.visibleWaterLabels.find((label) =>
    Math.abs(x - label.x) <= label.width / 2 + 6 && Math.abs(y - label.y) <= label.height,
  ) || null;
}

function showWaterInfo(water, x, y) {
  showMapInfo(`<strong>${water.name}</strong><span>Total area: ${water.area || "Unknown"}</span><span>${water.info}</span>`, x, y);
}

function showMapInfo(content, x, y) {
  waterInfoPopup.innerHTML = content;
  waterInfoPopup.hidden = false;
  const zone = canvas.parentElement.getBoundingClientRect();
  const popup = waterInfoPopup.getBoundingClientRect();
  waterInfoPopup.style.left = `${clamp(x + 14, 12, zone.width - popup.width - 12)}px`;
  waterInfoPopup.style.top = `${clamp(y + 14, 12, zone.height - popup.height - 12)}px`;
}

function hideWaterInfo() {
  waterInfoPopup.hidden = true;
}

function drawFlightTrail(cx, cy, radius) {
  if (!["free", "airports"].includes(state.mode) || !state.flight.showTrail || state.flight.trail.length < 2) return;
  const samples = state.flight.trail.map((point) => project(point.lat, point.lon, cx, cy, radius));
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  drawArcSegments(samples, true, "rgba(255,208,102,0.92)", 2.4);
  ctx.restore();
}

function drawAirportCompass(width, height) {
  if (state.mode !== "airports" || !state.flight.active || !state.airportPair[1]) return;
  const target = airportForCountry(state.airportPair[1]);
  const bearing = initialBearing(state.flight.lat, state.flight.lon, target.lat, target.lon);
  const metrics = globeMetrics();
  const here = project(state.flight.lat, state.flight.lon, metrics.cx, metrics.cy, metrics.radius);
  const northPoint = destinationPoint(state.flight.lat, state.flight.lon, 0, 120);
  const northScreen = project(northPoint.lat, northPoint.lon, metrics.cx, metrics.cy, metrics.radius);
  const northAngle = state.flight.paused
    ? Math.atan2(northScreen.x - here.x, -(northScreen.y - here.y))
    : 0;
  const relative = state.flight.paused
    ? northAngle + toRad(bearing)
    : toRad(normalizeHeading(bearing - state.flight.heading));
  const x = 140;
  const y = height - 254;
  const radius = 95;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(8,12,18,0.82)";
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f3f7fb";
  ctx.font = "800 18px Inter, sans-serif";
  ctx.textAlign = "center";
  [["N", 0], ["E", 90], ["S", 180], ["W", 270]].forEach(([label, bearingDegrees]) => {
    const angle = state.flight.paused
      ? northAngle + toRad(bearingDegrees)
      : toRad(normalizeHeading(bearingDegrees - state.flight.heading));
    ctx.fillText(label, Math.sin(angle) * 70, -Math.cos(angle) * 70 + 6);
  });
  ctx.rotate(relative);
  ctx.fillStyle = "#f0c75e";
  ctx.beginPath();
  ctx.moveTo(0, -55);
  ctx.lineTo(12, 15);
  ctx.lineTo(0, 7);
  ctx.lineTo(-12, 15);
  ctx.closePath();
  ctx.fill();
  ctx.rotate(-relative);
  ctx.fillStyle = "#f3f7fb";
  ctx.font = "800 15px Inter, sans-serif";
  ctx.fillText(`${String(Math.round(state.flight.heading)).padStart(3, "0")}°`, 0, 123);
  ctx.fillStyle = "#f0c75e";
  ctx.fillText(`TO ${target.iata}`, 0, 145);
  ctx.restore();
}

function drawFeatureSurface(feature, cx, cy, radius) {
  ctx.beginPath();
  const tiles = state.mode === "traverse" ? feature.metropolitanRenderTiles : feature.renderTiles;
  tiles.forEach((tile) => {
    if (!tileIsVisible(tile, cx, cy, radius)) return;
    tile.triangles.forEach((triangle) => {
      const clipped = clipRingToVisible(triangle.map(cameraVector));
      if (clipped.length < 3) return;
      clipped.forEach((point, index) => {
        const projected = projectCameraPoint(point, cx, cy, radius);
        if (index === 0) ctx.moveTo(projected.x, projected.y);
        else ctx.lineTo(projected.x, projected.y);
      });
      ctx.closePath();
    });
  });
  ctx.fill();
}

function tileIsVisible(tile, cx, cy, radius) {
  const center = cameraVector(tile.center);
  if (center.z < -Math.sin(tile.angularRadius + 0.02)) return false;
  const projected = projectCameraPoint(center, cx, cy, radius);
  const pixelRadius = Math.sin(Math.min(Math.PI / 2, tile.angularRadius + 0.05)) * radius;
  return !(
    projected.x + pixelRadius < 0 ||
    projected.y + pixelRadius < 0 ||
    projected.x - pixelRadius > canvas.clientWidth ||
    projected.y - pixelRadius > canvas.clientHeight
  );
}

function cameraVector(vector) {
  if (!state.northUp && state.freeMatrix) {
    return applyMatrix3(state.freeMatrix, { x: vector.z, y: vector.y, z: vector.x });
  }
  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const x = vector.z * cy + vector.x * sy;
  const z = vector.x * cy - vector.z * sy;
  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);
  const y = vector.y * cp - z * sp;
  const z2 = vector.y * sp + z * cp;
  const cr = Math.cos(state.roll);
  const sr = Math.sin(state.roll);
  return { x: x * cr - y * sr, y: x * sr + y * cr, z: z2 };
}

function drawFeatureBoundarySegments(feature, cx, cy, radius, highlighted, pulse = false) {
  ctx.save();
  const pulseAlpha = 0.45 + (Math.sin(performance.now() * 0.006) + 1) * 0.27;
  ctx.lineWidth = pulse ? 3 : highlighted ? 1.35 : 0.65;
  ctx.strokeStyle = pulse ? `rgba(255,255,255,${pulseAlpha})` : highlighted ? "rgba(255,255,255,0.9)" : "rgba(11,24,27,0.82)";

  const polygons = state.mode === "traverse" ? feature.metropolitanPolygons : feature.polygons;
  polygons.forEach((polygon) => {
    polygon.forEach((ring) => {
      const points = ring.map(([lon, lat]) => cameraPoint(lat, lon));
      for (let i = 0; i < points.length - 1; i += 1) {
        if (isWrappedEdge(ring[i], ring[i + 1])) continue;
        if (
          displayCountryName(feature) === "Antarctica" &&
          (ring[i][1] <= -89.5 || ring[i + 1][1] <= -89.5)
        ) {
          continue;
        }
        const a = points[i];
        const b = points[i + 1];
        const aVisible = a.z >= 0;
        const bVisible = b.z >= 0;
        if (!aVisible && !bVisible) continue;

        const start = projectCameraPoint(aVisible ? a : intersectHorizon(a, b, 0), cx, cy, radius);
        const end = projectCameraPoint(bVisible ? b : intersectHorizon(a, b, 0), cx, cy, radius);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    });
  });
  ctx.restore();
}

function drawDistanceArc(cx, cy, radius) {
  if (state.mode !== "distance") {
    if (["free", "airports"].includes(state.mode) && state.flight.active) {
      if (state.mode === "free") {
        targetDistance.textContent = `${Math.round(state.flight.currentSpeed).toLocaleString()} km/h${state.flight.boost ? " | BOOST" : state.flight.slow ? " | BRAKE" : ""}`;
      }
      return;
    }
    const altitude = state.mode === "viewfinder"
      ? state.viewAltitude
      : Math.max(200, Math.round(6371 / state.zoom));
    targetDistance.textContent = state.mode === "viewfinder"
      ? `Altitude: ${altitude.toLocaleString()} km`
      : `${worldMap.length} countries | Altitude ${altitude.toLocaleString()} km`;
    return;
  }
  const [a, b] = state.distancePair;
  const samples = greatCirclePoints(a.lat, a.lon, b.lat, b.lon, 96).map((point) =>
    project(point.lat, point.lon, cx, cy, radius),
  );

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  drawArcSegments(samples, false, "rgba(255,122,102,0.25)", 2);
  drawArcSegments(samples, true, "#ff7a66", 3.2);
  ctx.restore();
}

function drawFreeroamCompareLines(cx, cy, radius) {
  if (state.mode !== "free" || !state.compareLines || state.freeSelections.length < 2) return;

  for (let i = 0; i < state.freeSelections.length - 1; i += 1) {
    for (let j = i + 1; j < state.freeSelections.length; j += 1) {
      const a = state.freeSelections[i];
      const b = state.freeSelections[j];
      const samples = greatCirclePoints(a.lat, a.lon, b.lat, b.lon, 96).map((point) =>
        project(point.lat, point.lon, cx, cy, radius),
      );
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      drawArcSegments(samples, false, "rgba(0,0,0,0.3)", 2);
      drawArcSegments(samples, true, "#05080b", 2.8);
      ctx.restore();
    }
  }
}

function drawTraverseRoute(cx, cy, radius) {
  if (state.mode !== "traverse") return;
  const playerRoute =
    state.answered && !sameCountry(state.traverse.route[state.traverse.route.length - 1], state.traverse.target)
      ? [...state.traverse.route, state.traverse.target]
      : state.traverse.route;
  if (state.traverse.showPlayerLines) drawTraversePath(playerRoute, "#ff5c5c", cx, cy, radius);
  if (state.traverse.shortestShown) {
    const shortest = state.traverse.shortest
      .map((name) => countries.find((country) => country.name === name))
      .filter(Boolean);
    drawTraversePath(shortest, "#ffffff", cx, cy, radius);
  }
}

function drawTraversePath(route, color, cx, cy, radius) {
  if (route.length < 2) return;
  for (let index = 0; index < route.length - 1; index += 1) {
    const a = route[index];
    const b = route[index + 1];
    const samples = greatCirclePoints(getCenterLat(a), getCenterLon(a), getCenterLat(b), getCenterLon(b), 32)
      .map((point) => project(point.lat, point.lon, cx, cy, radius));
    drawArcSegments(samples, true, color, color === "#ffffff" ? 4 : 3);
  }
}

function drawDistanceScale(width, height, radius) {
  const targetPixels = 110;
  const rawKm = (targetPixels / radius) * 6371;
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, rawKm)));
  const normalized = rawKm / magnitude;
  const nice = normalized >= 5 ? 5 : normalized >= 2 ? 2 : 1;
  const km = nice * magnitude;
  const pixels = (km / 6371) * radius;
  const x = width - pixels - 24;
  const y = height - 66;
  ctx.save();
  ctx.strokeStyle = "#f3f7fb";
  ctx.fillStyle = "#f3f7fb";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x, y);
  ctx.lineTo(x + pixels, y);
  ctx.lineTo(x + pixels, y - 6);
  ctx.stroke();
  ctx.font = "700 11px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${km.toLocaleString()} km`, x + pixels / 2, y - 9);
  ctx.restore();
}

function drawNightOverlay(cx, cy, radius) {
  const now = new Date();
  const day =
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(now.getUTCFullYear(), 0, 0)) /
    86400000;
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  const gamma = (2 * Math.PI / 365) * (day - 1 + (utcHours - 12) / 24);
  const equationMinutes =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const declination = radToDeg(
    0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma),
  );
  const subsolarLon = normalizeLon(180 - utcHours * 15 - equationMinutes * 0.25);
  const size = 180;
  if (nightCanvas.width !== size) {
    nightCanvas.width = size;
    nightCanvas.height = size;
  }
  const image = nightCtx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sx = ((x + 0.5) / size) * 2 - 1;
      const sy = -(((y + 0.5) / size) * 2 - 1);
      if (sx * sx + sy * sy > 1) continue;
      const geo = screenToLatLon(cx + sx * radius, cy - sy * radius, cx, cy, radius);
      if (!geo) continue;
      const sunHeight =
        Math.sin(toRad(geo.lat)) * Math.sin(toRad(declination)) +
        Math.cos(toRad(geo.lat)) * Math.cos(toRad(declination)) * Math.cos(toRad(geo.lon - subsolarLon));
      const darkness = state.fullNight ? 1 : clamp((-sunHeight + 0.08) / 0.42, 0, 1);
      const index = (y * size + x) * 4;
      image.data[index] = 2;
      image.data[index + 1] = 7;
      image.data[index + 2] = 18;
      image.data[index + 3] = Math.round(darkness * 205);
    }
  }
  nightCtx.putImageData(image, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(nightCanvas, cx - radius, cy - radius, radius * 2, radius * 2);
  if (state.fullNight) {
    ctx.globalCompositeOperation = "screen";
    countries
      .filter((country) => Number(country.populationNumber || 0) >= 1_000_000)
      .forEach((country) => {
        const point = project(country.lat, country.lon, cx, cy, radius);
        if (!point.visible || point.z < 0.05) return;
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 8);
        glow.addColorStop(0, "rgba(255,235,155,0.95)");
        glow.addColorStop(0.25, "rgba(255,184,72,0.7)");
        glow.addColorStop(1, "rgba(255,145,35,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
  }
  ctx.restore();
}

function drawElevationOverlay(cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  worldMap.forEach((feature) => {
    const tiles = feature.terrainTilesFine || feature.terrainTiles;
    if (!tiles) return;
    tiles.forEach((tile) => {
      if (!tileIsVisible(tile, cx, cy, radius)) return;
      tile.triangles.forEach((triangle) => {
        const clipped = clipRingToVisible(triangle.map(cameraVector));
        if (clipped.length < 3) return;
        const center = normalizeVector(triangle.reduce(
          (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z }),
          { x: 0, y: 0, z: 0 },
        ));
        const geo = vectorToLatLon(center);
        const mountainNoise =
          Math.abs(Math.sin(toRad(geo.lon * 5.7 + geo.lat * 8.3))) *
          Math.abs(Math.cos(toRad(geo.lon * 2.9 - geo.lat * 11.1)));
        const latitudeLift = smoothStep(25, 72, Math.abs(geo.lat)) * 0.16;
        const elevation = clamp(mountainNoise * 0.9 + latitudeLift, 0, 1);
        const color = elevation < 0.58
          ? mixColor("#174f32", "#6e9b4c", elevation / 0.58)
          : mixColor("#e0a05b", "#7a3d20", (elevation - 0.58) / 0.42);
        ctx.beginPath();
        clipped.forEach((point, index) => {
          const projected = projectCameraPoint(point, cx, cy, radius);
          if (!index) ctx.moveTo(projected.x, projected.y);
          else ctx.lineTo(projected.x, projected.y);
        });
        ctx.closePath();
        ctx.globalAlpha = 0.62;
        ctx.fillStyle = color;
        ctx.fill();
      });
    });
  });
  ctx.restore();
}

function drawArcSegments(points, visible, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  let drawing = false;

  points.forEach((point) => {
    const isVisible = point.z > 0;
    if (isVisible !== visible) {
      if (drawing) ctx.stroke();
      drawing = false;
      return;
    }

    if (!drawing) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      drawing = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  if (drawing) ctx.stroke();
  ctx.restore();
}

function project(lat, lon, cx, cy, radius) {
  const point = cameraPoint(lat, lon);
  return {
    ...projectCameraPoint(point, cx, cy, radius),
    z: point.z,
    visible: point.z >= 0,
    alpha: clamp((point.z + 0.2) / 1.2, 0.25, 1),
    scale: clamp((point.z + 1) / 2, 0.2, 1),
  };
}

function cameraPoint(lat, lon) {
  if (!state.northUp && state.freeMatrix) {
    const phi = toRad(lat);
    const lambda = toRad(lon);
    return applyMatrix3(state.freeMatrix, {
      x: Math.cos(phi) * Math.sin(lambda),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.cos(lambda),
    });
  }
  return cameraPointForView(lat, lon, state.yaw, state.pitch, state.roll);
}

function cameraPointForView(lat, lon, yaw, pitch, roll) {
  const phi = toRad(lat);
  const lambda = toRad(lon) + yaw;
  const cosPhi = Math.cos(phi);
  let x = cosPhi * Math.sin(lambda);
  let y = Math.sin(phi);
  let z = cosPhi * Math.cos(lambda);

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y * cp - z * sp;
  const z2 = y * sp + z * cp;
  y = y2;
  z = z2;
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const x2 = x * cr - y * sr;
  const y3 = x * sr + y * cr;
  x = x2;
  y = y3;

  return { x, y, z };
}

function cameraMatrixForEuler(yaw, pitch, roll) {
  const transform = (vector) => {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const x1 = vector.x * cy + vector.z * sy;
    const z1 = vector.z * cy - vector.x * sy;
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const y2 = vector.y * cp - z1 * sp;
    const z2 = vector.y * sp + z1 * cp;
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    return { x: x1 * cr - y2 * sr, y: x1 * sr + y2 * cr, z: z2 };
  };
  const x = transform({ x: 1, y: 0, z: 0 });
  const y = transform({ x: 0, y: 1, z: 0 });
  const z = transform({ x: 0, y: 0, z: 1 });
  return [x.x, y.x, z.x, x.y, y.y, z.y, x.z, y.z, z.z];
}

function applyMatrix3(matrix, vector) {
  return {
    x: matrix[0] * vector.x + matrix[1] * vector.y + matrix[2] * vector.z,
    y: matrix[3] * vector.x + matrix[4] * vector.y + matrix[5] * vector.z,
    z: matrix[6] * vector.x + matrix[7] * vector.y + matrix[8] * vector.z,
  };
}

function multiplyMatrix3(a, b) {
  const result = Array(9).fill(0);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      for (let index = 0; index < 3; index += 1) {
        result[row * 3 + column] += a[row * 3 + index] * b[index * 3 + column];
      }
    }
  }
  return result;
}

function transposeMatrix3(matrix) {
  return [matrix[0], matrix[3], matrix[6], matrix[1], matrix[4], matrix[7], matrix[2], matrix[5], matrix[8]];
}

function orthonormalizeMatrix3(matrix) {
  const x = normalizeVector({ x: matrix[0], y: matrix[1], z: matrix[2] });
  const rawY = { x: matrix[3], y: matrix[4], z: matrix[5] };
  const projection = dotVector(rawY, x);
  const y = normalizeVector({
    x: rawY.x - x.x * projection,
    y: rawY.y - x.y * projection,
    z: rawY.z - x.z * projection,
  });
  const z = normalizeVector(crossVector(x, y));
  return [x.x, x.y, x.z, y.x, y.y, y.z, z.x, z.y, z.z];
}

function rotationMatrixX(angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [1, 0, 0, 0, cosine, -sine, 0, sine, cosine];
}

function rotationMatrixY(angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [cosine, 0, sine, 0, 1, 0, -sine, 0, cosine];
}

function rotationMatrixZ(angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [cosine, -sine, 0, sine, cosine, 0, 0, 0, 1];
}

function projectCameraPoint(point, cx, cy, radius) {
  return {
    x: cx + point.x * radius,
    y: cy - point.y * radius,
  };
}

function clipRingToVisible(points) {
  const clipped = [];
  const horizon = 0;

  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const currentVisible = current.z >= horizon;
    const nextVisible = next.z >= horizon;

    if (currentVisible) clipped.push(current);
    if (currentVisible !== nextVisible) clipped.push(intersectHorizon(current, next, horizon));
  }

  return clipped;
}

function intersectHorizon(a, b, horizon) {
  const t = (horizon - a.z) / ((b.z - a.z) || Number.EPSILON);
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: horizon,
  };
}

function isWrappedEdge(a, b) {
  if (!a || !b) return false;
  return Math.abs(a[0] - b[0]) > 180;
}

function greatCirclePoints(lat1, lon1, lat2, lon2, steps) {
  const start = latLonToVector(lat1, lon1);
  const end = latLonToVector(lat2, lon2);
  const dot = clamp(start.x * end.x + start.y * end.y + start.z * end.z, -1, 1);
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);
  const points = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    let vector;
    if (sinOmega < 0.0001) {
      vector = {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
        z: start.z + (end.z - start.z) * t,
      };
    } else {
      const a = Math.sin((1 - t) * omega) / sinOmega;
      const b = Math.sin(t * omega) / sinOmega;
      vector = {
        x: start.x * a + end.x * b,
        y: start.y * a + end.y * b,
        z: start.z * a + end.z * b,
      };
    }
    points.push(vectorToLatLon(normalizeVector(vector)));
  }

  return points;
}

function latLonToVector(lat, lon) {
  const phi = toRad(lat);
  const lambda = toRad(lon);
  const cosPhi = Math.cos(phi);
  return {
    x: cosPhi * Math.cos(lambda),
    y: Math.sin(phi),
    z: cosPhi * Math.sin(lambda),
  };
}

function vectorToLatLon(vector) {
  return {
    lat: radToDeg(Math.asin(clamp(vector.y, -1, 1))),
    lon: normalizeLon(radToDeg(Math.atan2(vector.z, vector.x))),
  };
}

function normalizeVector(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

function countryAt(x, y) {
  const { radius, cx, cy } = globeMetrics();
  const point = screenToLatLon(x, y, cx, cy, radius);
  if (!point) return null;
  if (cameraPoint(point.lat, point.lon).z <= 0.001) return null;

  const hits = worldMap.filter((feature) => feature.gameCountry && pointInFeature(point.lon, point.lat, feature));
  if (hits.length) return hits.sort((a, b) => a.area - b.area)[0];

  return countries.find((country) => {
    const projected = country.screen;
    if (!projected || !projected.visible || projected.z <= 0.001) return false;
    return Math.hypot(projected.x - x, projected.y - y) < (isTinyCountry(country) ? 14 : 10);
  }) || null;
}

function isTinyCountry(country) {
  return Number(country?.areaKm2 || country?.gameCountry?.areaKm2 || 0) < 5_000;
}

function focusCountry(country) {
  const lon = getCenterLon(country);
  const lat = getCenterLat(country);
  const feature = worldMap.find((item) => sameCountry(item, country));
  const points = feature?.polygons.flatMap((polygon) => polygon[0] || []) || [];
  const latSpan = points.length ? Math.max(...points.map((point) => point[1])) - Math.min(...points.map((point) => point[1])) : 20;
  const lonSpan = points.length ? wrappedLongitudeSpan(points.map((point) => point[0])) : 20;
  const span = Math.max(1.2, latSpan, lonSpan * Math.cos(toRad(lat)));
  const rect = canvas.getBoundingClientRect();
  const baseRadius = Math.min(rect.width, rect.height) * 0.42;
  const targetWidth = rect.width * 0.4;
  const angularWidth = Math.max(0.01, 2 * Math.sin(toRad(span) / 2));
  const zoom = clamp(targetWidth / (baseRadius * angularWidth), 0.78, 22);
  focusLatLon({ lat, lon }, zoom);
  state.selected = country.gameCountry || country;
}

function wrappedLongitudeSpan(longitudes) {
  if (!longitudes.length) return 0;
  const sorted = longitudes.map((lon) => normalizeLon(lon)).sort((a, b) => a - b);
  let largestGap = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    const next = i === sorted.length - 1 ? sorted[0] + 360 : sorted[i + 1];
    largestGap = Math.max(largestGap, next - sorted[i]);
  }
  return 360 - largestGap;
}

function focusLatLon(point, zoom = 1.15) {
  state.orientationTarget = null;
  state.yaw = -toRad(point.lon);
  state.pitch = clamp(toRad(point.lat), -Math.PI / 2, Math.PI / 2);
  state.roll = 0;
  state.freeMatrix = state.northUp ? null : cameraMatrixForEuler(state.yaw, state.pitch, state.roll);
  state.zoom = zoom;
}

function buildWorldMap(data) {
  if (!data || !Array.isArray(data.features)) return [];

  const mappedFeatures = data.features
    .filter((feature) => feature.geometry && feature.properties)
    .map((feature) => {
      const properties = feature.properties;
      const name = propertyValue(properties, "NAME_LONG", "name_long", "ADMIN", "admin", "NAME", "name");
      const polygons = densifyPolygons(simplifyPolygons(getFeaturePolygons(feature.geometry), 0.02), 3);
      const labelLon = Number(propertyValue(properties, "LABEL_X", "label_x") ?? getAverageCoordinate(polygons, 0));
      const labelLat = Number(propertyValue(properties, "LABEL_Y", "label_y") ?? getAverageCoordinate(polygons, 1));
      const gameCountry =
        gameCountryByIso.get(propertyValue(properties, "ADM0_A3", "adm0_a3")) ||
        gameCountryByIso.get(propertyValue(properties, "ISO_A3", "iso_a3")) ||
        gameCountryByKey.get(countryKey(name)) ||
        gameCountryByKey.get(countryKey(propertyValue(properties, "NAME", "name"))) ||
        gameCountryByKey.get(countryKey(propertyValue(properties, "ADMIN", "admin"))) ||
        null;
      const triangleDegrees = countryTriangleDegrees(gameCountry);
      const renderTriangles = polygons.flatMap((polygon) =>
        triangulatePolygon(polygon)
          .filter((triangle) => triangleMaxEdgeDegrees(triangle) < 80)
          .flatMap((triangle) => subdivideTriangle(triangle, triangleDegrees))
          .map((triangle) => triangle.map(([lon, lat]) => latLonToVector(lat, normalizeLon(lon)))),
      );
      const metropolitanNames = new Set(["France", "Netherlands", "Portugal", "Spain"]);
      const metropolitanPolygons =
        gameCountry && metropolitanNames.has(gameCountry.name)
          ? polygons.filter((polygon) => distanceKm(polygonFillCenter(polygon[0] || []), gameCountry) < 1_900)
          : polygons;
      const metropolitanTriangles = metropolitanPolygons.flatMap((polygon) =>
        triangulatePolygon(polygon)
          .filter((triangle) => triangleMaxEdgeDegrees(triangle) < 80)
          .flatMap((triangle) => subdivideTriangle(triangle, triangleDegrees))
          .map((triangle) => triangle.map(([lon, lat]) => latLonToVector(lat, normalizeLon(lon)))),
      );

      const mapped = {
        name,
        shortName: propertyValue(properties, "NAME", "name") || name,
        continent: gameCountry?.name === "Maldives" ? "Asia" : propertyValue(properties, "CONTINENT", "continent"),
        polygons,
        fillCenters: polygons.map((polygon) => polygonFillCenter(polygon[0] || [])),
        renderTriangles,
        renderTiles: buildRenderTiles(renderTriangles),
        metropolitanPolygons,
        metropolitanRenderTiles: buildRenderTiles(metropolitanTriangles),
        terrainTiles: null,
        terrainTilesFine: null,
        labelLon,
        labelLat,
        area: approximateFeatureArea(polygons),
        gameCountry,
      };
      if (gameCountry) {
        const gdpMd = Number(propertyValue(properties, "GDP_MD", "gdp_md"));
        if (Number.isFinite(gdpMd) && gdpMd >= 0) {
          gameCountry.gdpMd = gdpMd;
          gameCountry.gdpPerCapita = gameCountry.populationNumber ? (gdpMd * 1_000_000) / gameCountry.populationNumber : 0;
        }
      }
      return mapped;
    });

  const somalia = mappedFeatures.find((feature) => sameCountry(feature, { name: "Somalia" }));
  const somaliland = mappedFeatures.find((feature) => countryKey(feature.name) === "somaliland");
  if (somalia && somaliland) {
    somalia.polygons.push(...somaliland.polygons);
    somalia.fillCenters.push(...somaliland.fillCenters);
    somalia.renderTriangles.push(...somaliland.renderTriangles);
    somalia.renderTiles = buildRenderTiles(somalia.renderTriangles);
    somalia.area = approximateFeatureArea(somalia.polygons);
  }

  return mappedFeatures.filter((feature) => feature.gameCountry);
}

function ensureTerrainMeshes(includeFine = false) {
  worldMap.forEach((feature) => {
    const buildTerrainTiles = (maxDegrees) => buildRenderTiles(feature.polygons.flatMap((polygon) =>
      triangulatePolygon(polygon)
        .filter((triangle) => triangleMaxEdgeDegrees(triangle) < 80)
        .flatMap((triangle) => subdivideTriangle(triangle, maxDegrees))
        .map((triangle) => triangle.map(([lon, lat]) => latLonToVector(lat, normalizeLon(lon)))),
    ));
    if (!feature.terrainTiles) feature.terrainTiles = buildTerrainTiles(2.5);
    if (includeFine && !feature.terrainTilesFine) feature.terrainTilesFine = buildTerrainTiles(0.85);
  });
}

function buildRenderTiles(triangles) {
  const groups = new Map();
  triangles.forEach((triangle) => {
    const center = normalizeVector(triangle.reduce(
      (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z }),
      { x: 0, y: 0, z: 0 },
    ));
    const geo = vectorToLatLon(center);
    const key = `${Math.floor((geo.lat + 90) / 15)}:${Math.floor((geo.lon + 180) / 15)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(triangle);
  });
  return [...groups.values()].map((tileTriangles) => {
    const center = normalizeVector(tileTriangles.flat().reduce(
      (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z }),
      { x: 0, y: 0, z: 0 },
    ));
    const angularRadius = Math.max(...tileTriangles.flat().map((point) =>
      Math.acos(clamp(dotVector(center, point), -1, 1)),
    ));
    return { center, angularRadius, triangles: tileTriangles };
  });
}

function countryTriangleDegrees(country) {
  const area = Number(country?.areaKm2 || 0);
  if (area >= 7_000_000) return 12;
  if (area >= 2_000_000) return 18;
  if (area >= 500_000) return 30;
  if (area >= 100_000) return 51;
  return 72;
}

function propertyValue(properties, ...keys) {
  for (const key of keys) {
    if (properties[key] !== undefined && properties[key] !== null) return properties[key];
  }
  return null;
}

function getFeaturePolygons(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  return [];
}

function densifyPolygons(polygons, maxDegrees) {
  return polygons.map((polygon) => polygon.map((ring) => densifyRing(ring, maxDegrees)));
}

function simplifyPolygons(polygons, tolerance) {
  return polygons.map((polygon) => polygon.map((ring) => simplifyRing(ring, tolerance)));
}

function triangulatePolygon(polygon) {
  const earcut = window.earcut?.default || window.earcut;
  if (!earcut || !polygon?.[0]?.length) return triangulateRing(polygon?.[0] || []);
  const rings = polygon
    .map((ring) => unwrapRingForTriangulation(simplifyRing(ring, 0.08)))
    .filter((ring) => ring.length >= 4)
    .map((ring) => ring.slice(0, -1));
  if (!rings.length) return [];

  const outerMean = rings[0].reduce((sum, point) => sum + point[0], 0) / rings[0].length;
  rings.slice(1).forEach((ring) => {
    const mean = ring.reduce((sum, point) => sum + point[0], 0) / ring.length;
    const shift = Math.round((outerMean - mean) / 360) * 360;
    ring.forEach((point) => {
      point[0] += shift;
    });
  });

  const vertices = [];
  const holes = [];
  const points = [];
  rings.forEach((ring, ringIndex) => {
    if (ringIndex) holes.push(points.length);
    ring.forEach((point) => {
      points.push(point);
      vertices.push(point[0], point[1]);
    });
  });
  const indices = earcut(vertices, holes, 2);
  return Array.from({ length: Math.floor(indices.length / 3) }, (_, index) => [
    points[indices[index * 3]],
    points[indices[index * 3 + 1]],
    points[indices[index * 3 + 2]],
  ]);
}

function unwrapRingForTriangulation(ring) {
  if (!ring.length) return [];
  const unwrapped = [[ring[0][0], ring[0][1]]];
  let previousLon = ring[0][0];
  for (let i = 1; i < ring.length; i += 1) {
    let lon = ring[i][0];
    while (lon - previousLon > 180) lon -= 360;
    while (lon - previousLon < -180) lon += 360;
    unwrapped.push([lon, ring[i][1]]);
    previousLon = lon;
  }
  return unwrapped;
}

function triangulateRing(ring) {
  if (ring.length < 4) return [];
  const unwrapped = [];
  let previousLon = ring[0][0];
  unwrapped.push([previousLon, ring[0][1]]);
  for (let i = 1; i < ring.length - 1; i += 1) {
    let lon = ring[i][0];
    while (lon - previousLon > 180) lon -= 360;
    while (lon - previousLon < -180) lon += 360;
    unwrapped.push([lon, ring[i][1]]);
    previousLon = lon;
  }
  const points = simplifyRing([...unwrapped, unwrapped[0]], 0.08).slice(0, -1);
  if (points.length < 3) return [];
  const orientation = polygonSignedArea(points) >= 0 ? 1 : -1;
  const indices = points.map((_, index) => index);
  const triangles = [];
  let guard = points.length * points.length;

  while (indices.length > 3 && guard > 0) {
    let clipped = false;
    for (let i = 0; i < indices.length; i += 1) {
      const previous = indices[(i - 1 + indices.length) % indices.length];
      const current = indices[i];
      const next = indices[(i + 1) % indices.length];
      const a = points[previous];
      const b = points[current];
      const c = points[next];
      if (triangleCross(a, b, c) * orientation <= 0.0000001) continue;
      if (indices.some((index) => index !== previous && index !== current && index !== next && pointInTriangle(points[index], a, b, c))) {
        continue;
      }
      triangles.push([a, b, c]);
      indices.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
    guard -= 1;
  }
  if (indices.length === 3) triangles.push(indices.map((index) => points[index]));
  if (!triangles.length) {
    for (let i = 1; i < points.length - 1; i += 1) triangles.push([points[0], points[i], points[i + 1]]);
  }
  return triangles;
}

function subdivideTriangle(triangle, maxDegrees) {
  const stack = [triangle];
  const result = [];
  while (stack.length) {
    const current = stack.pop();
    const lengths = [
      sphericalEdgeDegrees(current[0], current[1]),
      sphericalEdgeDegrees(current[1], current[2]),
      sphericalEdgeDegrees(current[2], current[0]),
    ];
    const longest = Math.max(...lengths);
    if (longest <= maxDegrees) {
      result.push(current);
      continue;
    }
    const edge = lengths.indexOf(longest);
    const aIndex = edge;
    const bIndex = (edge + 1) % 3;
    const otherIndex = (edge + 2) % 3;
    const midpoint = sphericalMidpoint(current[aIndex], current[bIndex]);
    stack.push([current[aIndex], midpoint, current[otherIndex]]);
    stack.push([midpoint, current[bIndex], current[otherIndex]]);
  }
  return result;
}

function sphericalEdgeDegrees(a, b) {
  const va = latLonToVector(a[1], normalizeLon(a[0]));
  const vb = latLonToVector(b[1], normalizeLon(b[0]));
  return radToDeg(Math.acos(clamp(va.x * vb.x + va.y * vb.y + va.z * vb.z, -1, 1)));
}

function sphericalMidpoint(a, b) {
  const va = latLonToVector(a[1], normalizeLon(a[0]));
  const vb = latLonToVector(b[1], normalizeLon(b[0]));
  const point = vectorToLatLon(normalizeVector({ x: va.x + vb.x, y: va.y + vb.y, z: va.z + vb.z }));
  let lon = point.lon;
  const reference = (a[0] + b[0]) / 2;
  while (lon - reference > 180) lon -= 360;
  while (lon - reference < -180) lon += 360;
  return [lon, point.lat];
}

function polygonSignedArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const next = points[(i + 1) % points.length];
    area += points[i][0] * next[1] - next[0] * points[i][1];
  }
  return area / 2;
}

function triangleCross(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function pointInTriangle(point, a, b, c) {
  const first = triangleCross(point, a, b);
  const second = triangleCross(point, b, c);
  const third = triangleCross(point, c, a);
  const hasNegative = first < 0 || second < 0 || third < 0;
  const hasPositive = first > 0 || second > 0 || third > 0;
  return !(hasNegative && hasPositive);
}

function simplifyRing(ring, tolerance) {
  if (ring.length <= 4) return ring;
  const sqTolerance = tolerance * tolerance;
  const result = [ring[0]];

  function pointSegmentDistance(point, start, end) {
    let x = start[0];
    let y = start[1];
    let dx = end[0] - x;
    let dy = end[1] - y;
    if (dx || dy) {
      const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = end[0];
        y = end[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = point[0] - x;
    dy = point[1] - y;
    return dx * dx + dy * dy;
  }

  function simplifySection(first, last) {
    let maxDistance = sqTolerance;
    let index = 0;
    for (let i = first + 1; i < last; i += 1) {
      const distance = pointSegmentDistance(ring[i], ring[first], ring[last]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    if (!index) return;
    if (index - first > 1) simplifySection(first, index);
    result.push(ring[index]);
    if (last - index > 1) simplifySection(index, last);
  }

  simplifySection(0, ring.length - 1);
  result.push(ring[ring.length - 1]);
  return result;
}

function densifyRing(ring, maxDegrees) {
  const dense = [];
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [lon1, lat1] = ring[i];
    const [rawLon2, lat2] = ring[i + 1];
    let lon2 = rawLon2;
    const deltaLon = lon2 - lon1;
    if (deltaLon > 180) lon2 -= 360;
    if (deltaLon < -180) lon2 += 360;
    const edgeLimit = Math.abs(lat2 - lat1) < 0.03 ? Math.min(maxDegrees, 0.5) : maxDegrees;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(lon2 - lon1), Math.abs(lat2 - lat1)) / edgeLimit));

    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      dense.push([normalizeLon(lon1 + (lon2 - lon1) * t), lat1 + (lat2 - lat1) * t]);
    }
  }
  if (ring.length) dense.push(ring[ring.length - 1]);
  return dense;
}

function getAverageCoordinate(polygons, index) {
  let total = 0;
  let count = 0;
  polygons.forEach((polygon) => {
    polygon[0]?.forEach((point) => {
      total += point[index];
      count += 1;
    });
  });
  return count ? total / count : 0;
}

function approximateFeatureArea(polygons) {
  return polygons.reduce((sum, polygon) => sum + Math.abs(ringArea(polygon[0] || [])), 0);
}

function polygonFillCenter(ring) {
  const vectors = ring.map(([lon, lat]) => latLonToVector(lat, lon));
  const sum = vectors.reduce(
    (total, vector) => ({
      x: total.x + vector.x,
      y: total.y + vector.y,
      z: total.z + vector.z,
    }),
    { x: 0, y: 0, z: 0 },
  );
  if (!vectors.length || Math.hypot(sum.x, sum.y, sum.z) < 0.0001) {
    return { lat: 0, lon: 0 };
  }
  return vectorToLatLon(normalizeVector(sum));
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += x1 * y2 - x2 * y1;
  }
  return area / 2;
}

function screenToLatLon(x, y, cx, cy, radius) {
  let sx = (x - cx) / radius;
  let sy = -(y - cy) / radius;
  const distance = sx * sx + sy * sy;
  if (distance > 1) return null;

  const zRotated = Math.sqrt(Math.max(0, 1 - distance));
  if (!state.northUp && state.freeMatrix) {
    const world = applyMatrix3(transposeMatrix3(state.freeMatrix), { x: sx, y: sy, z: zRotated });
    return {
      lat: radToDeg(Math.asin(clamp(world.y, -1, 1))),
      lon: normalizeLon(radToDeg(Math.atan2(world.x, world.z))),
    };
  }
  const cr = Math.cos(state.roll);
  const sr = Math.sin(state.roll);
  const unrolledX = sx * cr + sy * sr;
  const unrolledY = -sx * sr + sy * cr;
  sx = unrolledX;
  sy = unrolledY;
  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);
  const sphereY = sy * cp + zRotated * sp;
  const sphereZ = -sy * sp + zRotated * cp;
  const lambda = Math.atan2(sx, sphereZ);

  return {
    lat: radToDeg(Math.asin(clamp(sphereY, -1, 1))),
    lon: normalizeLon(radToDeg(lambda - state.yaw)),
  };
}

function pointInFeature(lon, lat, feature) {
  if (displayCountryName(feature) === "Antarctica") return pointInPolarFeature(lon, lat, feature);
  return feature.polygons.some((polygon) => {
    const outer = polygon[0];
    const holes = polygon.slice(1);
    if (!pointInRing(lon, lat, outer)) return false;
    return !holes.some((ring) => pointInRing(lon, lat, ring));
  });
}

function pointInPolarFeature(lon, lat, feature) {
  const point = polarPoint(lon, lat);
  return feature.polygons.some((polygon) => {
    if (!pointInCartesianRing(point, polygon[0].map(([ringLon, ringLat]) => polarPoint(ringLon, ringLat)))) return false;
    return !polygon.slice(1).some((ring) => pointInCartesianRing(point, ring.map(([ringLon, ringLat]) => polarPoint(ringLon, ringLat))));
  });
}

function polarPoint(lon, lat) {
  const radius = 90 + lat;
  const angle = toRad(lon);
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function pointInCartesianRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses = yi > point[1] !== yj > point[1];
    if (crosses && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi || Number.EPSILON) + xi) inside = !inside;
  }
  return inside;
}

function pointInRing(lon, lat, ring) {
  if (!ring.length) return false;
  const unwrapped = [];
  let previousLon = ring[0][0];
  unwrapped.push([previousLon, ring[0][1]]);
  for (let i = 1; i < ring.length; i += 1) {
    let currentLon = ring[i][0];
    while (currentLon - previousLon > 180) currentLon -= 360;
    while (currentLon - previousLon < -180) currentLon += 360;
    unwrapped.push([currentLon, ring[i][1]]);
    previousLon = currentLon;
  }
  const centerLon = unwrapped.reduce((sum, point) => sum + point[0], 0) / unwrapped.length;
  let testLon = lon;
  while (testLon - centerLon > 180) testLon -= 360;
  while (testLon - centerLon < -180) testLon += 360;

  let inside = false;
  for (let i = 0, j = unwrapped.length - 1; i < unwrapped.length; j = i, i += 1) {
    const xi = unwrapped[i][0];
    const yi = unwrapped[i][1];
    const xj = unwrapped[j][0];
    const yj = unwrapped[j][1];
    const crosses = yi > lat !== yj > lat;
    if (crosses && testLon < ((xj - xi) * (lat - yi)) / (yj - yi || Number.EPSILON) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function sameCountry(a, b) {
  if (!a || !b) return false;
  if (a.iso3 && b.iso3 && a.iso3 === b.iso3) return true;
  if (a.gameCountry && sameCountry(a.gameCountry, b)) return true;
  if (b.gameCountry && sameCountry(a, b.gameCountry)) return true;
  return countryKey(displayCountryName(a)) === countryKey(displayCountryName(b));
}

function displayCountryName(country) {
  if (!country) return "";
  return country.gameCountry?.name || country.name || country.shortName || "";
}

function formatHoverText() {
  if (state.mode === "viewfinder") return "Borderless view";
  const coordinateText = state.cursorGeo ? formatCoordinates(state.cursorGeo.lat, state.cursorGeo.lon) : "Off globe";
  if (state.mode === "hunt") return coordinateText;
  const countryText = state.hover ? displayCountryName(state.hover) : oceanAt(state.cursorGeo);
  return `${countryText} | ${coordinateText}`;
}

function formatCoordinates(lat, lon) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lon).toFixed(2)}° ${ew}`;
}

function oceanAt(point) {
  if (!point) return "Off globe";
  const { lat, lon } = point;
  const waters = [
    ["Mediterranean Sea", 30, 46, -6, 37],
    ["Caribbean Sea", 8, 24, -89, -58],
    ["Gulf of Mexico", 18, 31, -98, -80],
    ["Red Sea", 12, 30, 32, 44],
    ["Caspian Sea", 36, 48, 46, 55],
    ["Black Sea", 40, 48, 27, 42],
    ["Baltic Sea", 53, 66, 9, 30],
    ["North Sea", 51, 62, -4, 10],
    ["Persian Gulf", 23, 31, 47, 57],
    ["Great Lakes", 41, 50, -93, -75],
    ["Lake Victoria", -4, 1, 31, 35],
    ["Lake Baikal", 51, 56, 103, 110],
    ["Arabian Sea", 4, 25, 45, 78],
    ["Bay of Bengal", 5, 24, 78, 100],
    ["South China Sea", 0, 25, 100, 122],
    ["Sea of Japan", 34, 52, 127, 142],
    ["Hudson Bay", 50, 70, -96, -74],
    ["Coral Sea", -30, -10, 145, 165],
    ["Adriatic Sea", 39, 46, 12, 20],
    ["Aegean Sea", 35, 42, 22, 29],
  ];
  const named = waters.find(([, minLat, maxLat, minLon, maxLon]) => lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon);
  if (named) return named[0];
  if (lat >= 52 && lat <= 67 && (lon >= 165 || lon <= -165)) return "Bering Sea";
  if (lat <= -60) return "Southern Ocean";
  if (lat >= 66) return "Arctic Ocean";
  if (lon >= 20 && lon <= 147 && lat < 32) return "Indian Ocean";
  if (lon > -70 && lon < 20) return "Atlantic Ocean";
  if (lon >= 147 || lon <= -70) return "Pacific Ocean";
  return "Atlantic Ocean";
}

function getCenterLat(country) {
  return Number(country.countryLat ?? country.labelLat ?? country.gameCountry?.countryLat ?? country.lat ?? country.gameCountry?.lat ?? 0);
}

function getCenterLon(country) {
  return Number(country.countryLon ?? country.labelLon ?? country.gameCountry?.countryLon ?? country.lon ?? country.gameCountry?.lon ?? 0);
}

function countryKey(name) {
  const key = rawCountryKey(name);
  return countryAliases.get(key) || key;
}

function rawCountryKey(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function countryMatchKeys(country) {
  return [
    country.name,
    country.officialName,
    country.slug,
    country.name?.replace(/^the\s+/i, ""),
  ]
    .filter(Boolean)
    .map(countryKey);
}

function outlineSearchKeys(country) {
  const aliases = {
    "United States": ["usa", "us", "america", "states"],
    "United Kingdom": ["uk", "great britain", "britain", "kingdom"],
    "United Arab Emirates": ["uae", "emirates"],
    "DR Congo": ["drc", "congo kinshasa", "democratic republic of the congo"],
    "Republic of the Congo": ["congo brazzaville"],
    "South Korea": ["korea"],
    "North Korea": ["korea"],
  };
  return [...countryMatchKeys(country), ...(aliases[country.name] || []).map(rawCountryKey)];
}

function countrySuggestions(value, limit = 9) {
  const query = rawCountryKey(value);
  if (!query) return [];
  return countries
    .filter((country) => outlineSearchKeys(country).some((key) => rawCountryKey(key).includes(query)))
    .sort((a, b) => {
      const aStarts = outlineSearchKeys(a).some((key) => rawCountryKey(key).startsWith(query));
      const bStarts = outlineSearchKeys(b).some((key) => rawCountryKey(key).startsWith(query));
      return Number(bStarts) - Number(aStarts) || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

function countryFromInput(value, suggestionSelector) {
  const exact = countries.find((country) => outlineSearchKeys(country).some((key) => rawCountryKey(key) === rawCountryKey(value)));
  if (exact) return exact;
  const active = modeContent.querySelector(`${suggestionSelector} .suggestion-button.active`);
  const first = modeContent.querySelector(`${suggestionSelector} .suggestion-button`);
  const selectedName = active?.dataset.country || first?.dataset.country;
  return selectedName ? countries.find((country) => country.name === selectedName) || null : null;
}

function moveCountrySuggestion(selector, currentIndex, direction) {
  const buttons = [...modeContent.querySelectorAll(`${selector} .suggestion-button`)];
  if (!buttons.length) return -1;
  const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
  buttons.forEach((button, index) => button.classList.toggle("active", index === nextIndex));
  buttons[nextIndex].scrollIntoView({ block: "nearest" });
  return nextIndex;
}

const currencyCodes = {
  EUR: "Euro", USD: "US dollar", GBP: "Pound sterling", DKK: "Danish krone", SEK: "Swedish krona", NOK: "Norwegian krone",
  CHF: "Swiss franc", PLN: "Polish zloty", CZK: "Czech koruna", HUF: "Hungarian forint", RON: "Romanian leu",
  BGN: "Bulgarian lev", ISK: "Icelandic krona", TRY: "Turkish lira", RUB: "Russian ruble", UAH: "Ukrainian hryvnia",
  CAD: "Canadian dollar", MXN: "Mexican peso", BRL: "Brazilian real", ARS: "Argentine peso", CLP: "Chilean peso",
  COP: "Colombian peso", PEN: "Peruvian sol", CNY: "Chinese yuan", JPY: "Japanese yen", KRW: "South Korean won",
  INR: "Indian rupee", PKR: "Pakistani rupee", BDT: "Bangladeshi taka", IDR: "Indonesian rupiah", MYR: "Malaysian ringgit",
  THB: "Thai baht", VND: "Vietnamese dong", PHP: "Philippine peso", SGD: "Singapore dollar", AUD: "Australian dollar",
  NZD: "New Zealand dollar", ZAR: "South African rand", EGP: "Egyptian pound", MAD: "Moroccan dirham",
  AED: "UAE dirham", SAR: "Saudi riyal", ILS: "Israeli new shekel", JOD: "Jordanian dinar", KWD: "Kuwaiti dinar",
  QAR: "Qatari riyal", NGN: "Nigerian naira", KES: "Kenyan shilling", GHS: "Ghanaian cedi", ETB: "Ethiopian birr",
  XOF: "West African CFA franc", XAF: "Central African CFA franc", XCD: "East Caribbean dollar",
};

const currencyByIso = {
  AD:"EUR",AT:"EUR",BE:"EUR",HR:"EUR",CY:"EUR",EE:"EUR",FI:"EUR",FR:"EUR",DE:"EUR",GR:"EUR",IE:"EUR",IT:"EUR",LV:"EUR",LT:"EUR",LU:"EUR",MT:"EUR",MC:"EUR",ME:"EUR",NL:"EUR",PT:"EUR",SM:"EUR",SK:"EUR",SI:"EUR",ES:"EUR",VA:"EUR",XK:"EUR",
  US:"USD",EC:"USD",SV:"USD",PA:"USD",TL:"USD",GB:"GBP",DK:"DKK",SE:"SEK",NO:"NOK",CH:"CHF",LI:"CHF",PL:"PLN",CZ:"CZK",HU:"HUF",RO:"RON",BG:"BGN",IS:"ISK",TR:"TRY",RU:"RUB",UA:"UAH",
  CA:"CAD",MX:"MXN",BR:"BRL",AR:"ARS",CL:"CLP",CO:"COP",PE:"PEN",CN:"CNY",JP:"JPY",KR:"KRW",IN:"INR",PK:"PKR",BD:"BDT",ID:"IDR",MY:"MYR",TH:"THB",VN:"VND",PH:"PHP",SG:"SGD",AU:"AUD",NZ:"NZD",
  ZA:"ZAR",NA:"ZAR",LS:"ZAR",SZ:"SZL",EG:"EGP",MA:"MAD",EH:"MAD",AE:"AED",SA:"SAR",IL:"ILS",PS:"ILS",JO:"JOD",KW:"KWD",QA:"QAR",NG:"NGN",KE:"KES",GH:"GHS",ET:"ETB",
  BJ:"XOF",BF:"XOF",CI:"XOF",GW:"XOF",ML:"XOF",NE:"XOF",SN:"XOF",TG:"XOF",CM:"XAF",CF:"XAF",TD:"XAF",CG:"XAF",GQ:"XAF",GA:"XAF",AG:"XCD",DM:"XCD",GD:"XCD",KN:"XCD",LC:"XCD",VC:"XCD",
};

function currencyForCountry(country) {
  const code = currencyCodeForCountry(country);
  return code ? `${currencyCodes[code] || code} (${code})` : "N/A";
}

function currencyCodeForCountry(country) {
  return currencyByIso[country.iso2] || "";
}

function formatGdp(gdpMd) {
  if (!Number.isFinite(gdpMd) || gdpMd <= 0) return "Unknown";
  if (gdpMd >= 1_000_000) return `$${(gdpMd / 1_000_000).toFixed(2)} trillion`;
  if (gdpMd >= 1_000) return `$${(gdpMd / 1_000).toFixed(1)} billion`;
  return `$${Math.round(gdpMd).toLocaleString()} million`;
}

function formatMoney(value) {
  return Number.isFinite(value) && value > 0 ? `$${Math.round(value).toLocaleString()}` : "Unknown";
}

function formatModeStat(mode) {
  const stat = state.stats[mode];
  return stat ? `${stat.correct}/${stat.total} correct` : "";
}

function updateModeStat(mode) {
  const element = modeContent.querySelector("#mode-answer-stat");
  if (element) element.textContent = formatModeStat(mode);
}

function broadRegion(country) {
  return worldMap.find((feature) => sameCountry(feature, country))?.continent || country.region;
}

function averageCountryCenter(predicate) {
  const matches = countries.filter(predicate);
  const vector = matches.reduce((sum, country) => {
    const item = latLonToVector(getCenterLat(country), getCenterLon(country));
    return { x: sum.x + item.x, y: sum.y + item.y, z: sum.z + item.z };
  }, { x: 0, y: 0, z: 0 });
  return vectorToLatLon(normalizeVector(vector));
}

function themedPool(type) {
  const poolKey = {
    landmark: "landmarks",
    dish: "dishes",
    city: "cities",
    timezone: "timezones",
    carBrand: "carBrands",
    company: "companies",
    climate: "climates",
    tourism: "tourism",
    independence: "independence",
    landscape: "landscapes",
    mountain: "mountains",
    river: "rivers",
    nationalPark: "nationalParks",
  }[type] || type;
  return (triviaExtras[poolKey] || [])
    .map(([countryName, subject]) => ({ country: countries.find((country) => sameCountry(country, { name: countryName })), subject }))
    .filter((item) => item.country);
}

function themedTrivia(type, itemIndex = null) {
  const usable = themedPool(type);
  if (!usable.length) return null;
  const item = itemIndex === null ? randomFrom(usable) : usable[itemIndex % usable.length];
  const displaySubject = capitalizeFirst(item.subject);
  if (type === "independence") {
    return {
      question: `What year is associated with ${item.country.name}'s independence?`,
      answer: item.subject,
      options: shuffle([item.subject, ...shuffle(usable.filter((candidate) => candidate.subject !== item.subject)).slice(0, 4).map((candidate) => candidate.subject)]),
      visual: "image",
      visualTitle: item.country.name,
      visualLabel: "Independence",
      imageQuery: `${item.country.name} independence celebration`,
      country: item.country,
    };
  }
  const options = makeOptions(item.country, 5).map((country) => country.name);
  const questions = {
    landmark: `Which country is home to ${item.subject}?`,
    dish: `Which country is strongly associated with ${item.subject}?`,
    city: `Which country is ${item.subject} in?`,
    timezone: `Which country uses ${item.subject}?`,
    carBrand: `Which country is ${item.subject} from?`,
    company: `Which country is ${item.subject} from?`,
    climate: `Which country is known for ${item.subject}?`,
    tourism: `Which country matches this tourism clue: ${displaySubject}?`,
    landscape: `Which country contains this landscape: ${item.subject}?`,
    mountain: `Which country is home to ${item.subject}?`,
    river: `Which country is strongly associated with ${item.subject}?`,
    nationalPark: `Which country is home to ${item.subject}?`,
  };
  const labels = {
    landmark: "Landmark",
    dish: "Dish",
    city: "City",
    timezone: "Timezone",
    carBrand: "Car brand",
    company: "Company",
    climate: "Climate",
    tourism: "Tourism",
    landscape: "Landscape",
    mountain: "Mountain",
    river: "River",
    nationalPark: "National park",
  };
  return {
    question: questions[type] || "Which country matches this clue?",
    answer: item.country.name,
    options,
    visual: "image",
    visualTitle: displaySubject,
    visualLabel: labels[type] || capitalizeFirst(type),
    imageQuery: ["climate", "tourism", "timezone"].includes(type)
      ? `${item.country.name} ${item.subject}`
      : item.subject,
    country: item.country,
  };
}

function capitalizeFirst(value) {
  const text = String(value || "");
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

function triviaVisual(data, country) {
  if (data.visual === "image" || data.visual === "card") {
    return `
      <div class="trivia-card trivia-image-card" id="trivia-image-card">
        ${flagImage(country, `Flag of ${country.name}`)}
        <span>${escapeAttribute(data.visualLabel || "Clue")}</span>
        <strong>${escapeAttribute(data.visualTitle || data.answer)}</strong>
      </div>
    `;
  }
  return `<div class="flag-display">${flagImage(country, `Flag of ${country.name}`)}</div>`;
}

async function hydrateTriviaImage(data) {
  if (!data.imageQuery) return;
  const card = modeContent.querySelector("#trivia-image-card");
  if (!card) return;
  try {
    const image = await wikiImageSearch(data.imageQuery);
    if (!image?.url || !modeContent.contains(card)) return;
    card.innerHTML = `
      <img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(data.visualTitle || data.imageQuery)}">
      <span>${escapeAttribute(data.visualLabel || "Clue")}</span>
      <strong>${escapeAttribute(data.visualTitle || data.answer)}</strong>
    `;
    card.classList.add("loaded");
  } catch {
    card.classList.remove("loaded");
  }
}

async function wikiImageSearch(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "5",
    gsrnamespace: "0",
    prop: "pageimages",
    piprop: "thumbnail|original",
    pithumbsize: "900",
    format: "json",
    origin: "*",
  });
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
  if (!response.ok) throw new Error("Wikipedia image lookup failed");
  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});
  const page = pages.find((candidate) => candidate.thumbnail?.source || candidate.original?.source);
  const url = page?.thumbnail?.source || page?.original?.source;
  return url ? { url } : null;
}

function distanceKm(a, b) {
  const earthRadius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function distanceStartZoom(km) {
  const t = clamp(km / 16000, 0, 1);
  return 1.55 - t * 0.78;
}

function distanceScore(percent) {
  if (percent <= 0.01) return 100;
  return Math.max(0, Math.round(100 * Math.exp(-4.2 * (percent - 0.01))));
}

function estimateFlightTime(km) {
  const cruisingSpeed = 850;
  const overheadHours = 0.45;
  const totalHours = km / cruisingSpeed + overheadHours;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  if (hours <= 0) return `${minutes} min`;
  return `${hours} hr ${minutes} min`;
}

function makeOptions(answer, count = 4) {
  return shuffle([answer, ...shuffle(countries.filter((country) => country !== answer)).slice(0, count - 1)]);
}

function randomCountry() {
  return randomFrom(countries);
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function range(start, end, step) {
  const values = [];
  for (let value = start; value <= end; value += step) values.push(value);
  return values;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function radToDeg(radians) {
  return (radians * 180) / Math.PI;
}

function normalizeLon(lon) {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function flagImage(country, alt) {
  const fallback = fallbackFlag(country.name);
  const src = country.flag || fallback;
  return `<img alt="${escapeAttribute(alt)}" src="${escapeAttribute(src)}" onerror="this.onerror=null;this.src='${fallback}'">`;
}

function localIsoFlagPath(country) {
  if (!country.iso2) return "";
  return `assets/Country Flags/svg/${country.iso2.toLowerCase()}.svg`;
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svgFlag(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function fallbackFlag(name) {
  return svgFlag(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="#182334"/><path d="M0 42h300M0 100h300M0 158h300" stroke="#313b49" stroke-width="18"/><rect x="96" y="72" width="108" height="56" rx="6" fill="#49d6c8"/></svg>`);
}

function countryFlagsUrl(country) {
  const directSlug = flagDirectSlug(country);
  return `https://www.countryflags.com/wp-content/uploads/${directSlug}-flag-png-large.png`;
}

function flagDirectSlug(country) {
  const key = rawCountryKey(country.name);
  const directAliases = new Map([
    ["cape verde", "cape-verde"],
    ["dr congo", "democratic-republic-of-congo"],
    ["ivory coast", "ivory-coast"],
    ["myanmar", "myanmar"],
    ["north korea", "north-korea"],
    ["south korea", "south-korea"],
    ["united kingdom", "united-kingdom"],
    ["palestine", "palestine"],
    ["sao tome and principe", "sao-tome-and-principe"],
    ["republic of the congo", "republic-of-the-congo"],
  ]);
  return directAliases.get(key) || key.replace(/\s+/g, "-");
}

init();
