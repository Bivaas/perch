# perch 

watch live airplanes traffic, METAR and flight history for VNKT. You can also search for any city then select the desired airport and view live aircraft traffic around the airport along with METAR of that specific airport. 

I have included two of the airports VNKT because its the only operational international airport of Nepal. Flight history of VNKT is only stored due to storage limitation.

I've included GPS accuracy indicator because a lot of ATR and regional aircraft's positioning are really inaccurate so this tells us whether to trust the position or not.

## Features

- search airport with cityname or current location.
- 10 airports within 100km radius with ICAO code can be displayed.
- Live airtraffic around the airport 
- METAR of selected airport and decoded version
- inaccurate GPS indicator and altitude mismatch indicator
- View airplane type, registration and airline name

## How it works

the files in collector directory runs 24/7 hosted in hackclub nest. In each 15 seconds, it asks adsb.lol for aircraft info and saves them for VNKT and VNVT. Aircrafts have status of departure or arrival if it comes within 3nm of airport and below 2000ft AGL. In another directory web is deployed in vercel which reads flights and hourly counts, gets aircraft position, METAR info from aviationweather.gov and maps the coordinates to Open-Meteo and cityname with Open-Meteo. In other words, I simply analyzed, manipulated and added conditions to publicly available adsb data.

## Limitation

The main limitation being dependence in adsb.lol for all available data along with rate limit it poses. If the user scales, rate limit will be exceeded and this project may fail. the status indicator regarding departure and arrival are guess using altitude and distance info. NACp value is also not very reliable from my observation because for country like Nepal, there is no full coverage and many flights are mislabelled as "degraded". There is also 15 second gap for aircraft position to update so it isn't truly realtime. 

## Color profile

- Blue -> descend
- Green -> climb
- Purple -> cruise / level
- Grey -> on ground

## use of AI

I used AI when asking help to get airport list and its ICAO since its very huge number. It recommened a github repo which I used. It helped me to add airport runways in map (black bar). Other than that, I mostly used AI for debugging, fixing errors and in specific parts of UI design. 

## Used

- adsb.lol
- aviationweather.gov
- ourairports.com
- open-meteo.com
- openstreetmap.org
- openflights.org