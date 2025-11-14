
        const cityinput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const searchcitysection=document.querySelector(".search-city");
const weatherinfosection=document.querySelector(".weather-info");
const countrytxt=document.querySelector(".country-txt");
const temptxt=document.querySelector(".temp-txt");
const conditiontxt=document.querySelector(".condition-txt");
const windtxt=document.querySelector(".wind-value-txt");
const humiditytxt=document.querySelector(".humidity-value-txt");
const notfounding = document.querySelector(".not-found");
const weathersummaryimg=document.querySelector(".weather-summary-img");
const currentdate=document.querySelector(".current-date-txt");
const forecastitemscontainer=document.querySelector(".forecast-items-container");
const apikey= 'API KEY';

searchBtn.addEventListener("click", () => {
    const cityName = cityinput.value.trim();
    if (cityName !== '') {
        updateweatherinfo(cityinput.value);
        cityinput.value = '';
        cityinput.blur()
    }
})

cityinput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && cityinput.value.trim() !== ''){
        updateweatherinfo(cityinput.value);
        cityinput.value = '';
        cityinput.blur()
    }
})

async function getFetchData(endpoint, city) {
    const apiurl=`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    const response=await fetch(apiurl);
    return response.json();
}


function getweathericon(id){
    if (id <= 232) {
        return 'storm.png';
    }  if (id <= 321) {
        return 'drizzle2.png';
    } if (id <= 531) {
        return 'rain.png';
    } if (id <= 622) {
        return 'snow.png';
    } if (id <= 781) {
        return 'atmosphere.png';
    } if (id === 800) {
        return 'clear.png';
    } if (id <= 804) {
        return 'cloud.png';
    } else {
        return 'default.png'; 
    }
}

async function updateweatherinfo(city) {
    const weatherdata = await getFetchData('weather', city);

    if (weatherdata.cod !== 200) {
        showDisplaySection(notfounding)
        return;
    }

    const{
        name : country,
        main: { temp , humidity },
        weather: [{id, main}],
        wind: { speed },
    } = weatherdata

    countrytxt.textContent = country;
    temptxt.textContent = `${Math.round(temp)}°C`;
    conditiontxt.textContent = main;
    windtxt.textContent = `${speed.toFixed(1)} m/s`; 
    humiditytxt.textContent = `${humidity}%`;
    // Using local image path
    weathersummaryimg.src = getweathericon(id); 
    
    const date = new Date();
    currentdate.textContent = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    await updateforecastinfo(city);
    showDisplaySection(weatherinfosection);
}


async  function updateforecastinfo(city){
    const forecastdata = await getFetchData('forecast', city);
    const timeToFilter = '12:00:00'; 
    const todayDateISO = new Date().toISOString().split('T')[0];
    
    forecastitemscontainer.innerHTML=''; 
    
    let addedCount = 0;
    
    forecastdata.list.forEach(forecastweather => {
        const dateISO = forecastweather.dt_txt.split(' ')[0];
        const timePart = forecastweather.dt_txt.split(' ')[1];
        

        if (dateISO !== todayDateISO && timePart === timeToFilter && addedCount < 5) {
            updateforecastinfocard(forecastweather);
            addedCount++;
        }
    });
}


function updateforecastinfocard(forecastweather){
    
    const{
        dt_txt, 
        main: { temp }, 
        weather: [{id}], 
    }=forecastweather 

    const datataken=new Date(dt_txt);
    const dateoptions={ weekday: 'short', month: 'short', day: 'numeric' };
    const dateresult=datataken.toLocaleDateString('en-US', dateoptions);

    // Using local image path
    const forecastitem="<div class=\"forecast-item\">\n"+
    "            <h5 class=\"forecast-item-date regular-txt\">"+dateresult+"</h5>\n"+
    "        <img src=\""+getweathericon(id)+"\" height=\"90px\" class=\"forecast-item-img\">\n"+
    "        <h5 class=\"forecast-item-temp\">"+Math.round(temp)+"°C</h5>\n"+
    "        </div>";
    
    forecastitemscontainer.insertAdjacentHTML('beforeend', forecastitem);
}

function showDisplaySection(section){
    [weatherinfosection ,searchcitysection, notfounding]
    .forEach(sec => sec.style.display = 'none');
    section.style.display = 'flex'; 
}
