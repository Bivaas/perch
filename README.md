# perch 

watch live airplanes traffic, METAR and flight history for VNKT. You can also search for any city then select the desired airport and view live aircraft traffic around the airport along with METAR of that specific airport. 

I have included two of the airports VNKT because its the main operational international airport of Nepal and OMDb since it has relatively high air traffic and more better coverage as compared to mountainous nepal. Flight history of VNKT and OMDB is only stored due to storage limitation.

I've included GPS accuracy indicator because a lot of ATR and regional aircraft's positioning are really inaccurate so this tells us whether to trust the position or not.

## Features

- search airport with cityname or current location.
- 10 airports within 100km radius with ICAO code can be displayed.
- Live airtraffic around the airport 
- METAR of selected airport and decoded version
- inaccurate GPS indicator and altitude mismatch indicator
- View airplane type, registration and airline name
- dotted line showing aircraft heading

## How it works

the files in collector directory runs 24/7 hosted in hackclub nest. In each 15 seconds, it asks adsb.lol for aircraft info and saves them for VNKT and OMDB. The accuracy of departure and arrival of VNKT may not be fully accurate due to limited coverage due to valley. so for VNKT it is 13nm 11390ft AGL, for OMDB it is 3nm 2062ft AGL. In another directory web is deployed in vercel which reads flights and hourly counts from supabase, gets aircraft position, METAR info from aviationweather.gov and maps the coordinates to Open-Meteo and cityname with Open-Meteo and finds nearby airports from OurAirports data. Flights record which are older than 24 hours are also deleted.

## Limitation

The main limitation being dependence in adsb.lol for all available data along with rate limit it poses. adsb.lol also has very few receiver and less coverage around Kathmandu. If the user scales, rate limit will be exceeded and this project may not work as intended. the status indicator regarding departure and arrival are guess using altitude and distance info. NACp value is also not very reliable from my observation because for country like Nepal, there is no full coverage and many flights are mislabelled as "degraded". There is also 15 second gap for aircraft position to update so it isn't truly realtime. 

## Color profile

- Blue -> descend
- Green -> climb
- Purple -> cruise / level
- Grey -> on ground
- Red dotted ring -> NACP below 8 (or bad GPS accuracy)
- Orange dotted ring -> altitude pressure and GPS dont match (altitude mismatch)
- dashed line -> aircraft direction (heading)

## use of AI

I used AI when asking help to get airport list and its ICAO since its very huge number. It recommened a github repo which I used. It helped me to add airport runways in map (black bar). Other than that, I mostly used AI for debugging, fixing errors and in specific parts of UI design.    

## Used

- adsb.lol
- aviationweather.gov
- ourairports.com
- open-meteo.com
- openstreetmap.org
- openflights.org