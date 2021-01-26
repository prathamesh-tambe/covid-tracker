import { useState,useEffect } from "react"; 
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import InfoBox from './infoBox';
import Map from './map';
import Table from './table';
import Linegraph from './Linegraph';
import { sortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setcountryInfo] = useState([]);
  const [tableData, settableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat:20.5937,lng:78.9629});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
   
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setcountryInfo(data);
    });
  },[]);

  useEffect(() => {
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((data) => { 
        const countries = data.map(country => (
          {
            name : country.country,
            value : country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data); 
        settableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async(event) =>{
    const countryCode = event.target.value;
    
    const url = (countryCode === 'worldwide') ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setCountry(countryCode);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      console.log(data.countryInfo.lat,data.countryInfo.long,mapCenter);
      setMapZoom(4);
      setcountryInfo(data);      
    });
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => {
                  return <MenuItem value={country.value}>{country.name}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
              <InfoBox isRed active={casesType === 'cases'} onClick={(e) => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
              <InfoBox active={casesType === 'recovered'} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
              <InfoBox isRed active={casesType === 'deaths'} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>      

        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
          <CardContent>
            <h3>Live cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <Linegraph casesType={casesType}/>
          </CardContent>
      </Card>        

            
    </div>
  );
}

export default App;
