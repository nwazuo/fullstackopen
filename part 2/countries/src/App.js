import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const App = () => {
	const [countriesData, setCountriesData] = useState([]);
	const [currentView, setCurrentView] = useState(''); // single || list
	const [error, setError] = useState(false);
	// const [queryString, setQueryString] = useState('');

	const handleInput = (e) => {
		// setQueryString(e.target.value);
		if (e.target.value === '') return;
		axios
			.get(`https://restcountries.eu/rest/v2/name/${e.target.value}`)
			.then((response) => {
				let data = response.data;
				setCountriesData(data);
				if (data.length < 2) {
					setCurrentView('single');
				} else {
					setCurrentView('list');
				}
				setError(false);
			})
			.catch((err) => {
				setError(true);
			});
	};

	const debouncedQuery = useCallback(debounce(handleInput, 400), []);

	return (
		<div>
			find countries <input type="text" onChange={debouncedQuery} />
			{(() => {
				if (error) {
					return <p>Something went wrong</p>;
				}
				if (currentView) {
					if (currentView === 'single') {
						return <SingleCountryView data={countriesData[0]} />;
					} else {
						return (
							<ListView
								data={countriesData}
								changeView={setCurrentView}
								setCountriesData={setCountriesData}
							/>
						);
					}
				}
			})()}
		</div>
	);
};

const SingleCountryView = ({ data }) => {
	const [weatherData, setWeatherData] = useState('');

	useEffect(() => {
		axios
			.get(
				`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${data.name}`
			)
			.then((response) => {
				setWeatherData(response.data);
			})
			.catch((err) => {
				console.log('--> Error getting weather data', err);
			});
	}, []);

	return (
		<div>
			<h1>{data.name}</h1>
			<ul>
				<li>capital {data.capital} </li>
				<li>population {data.population}</li>
			</ul>
			<h3>Languages</h3>
			<ul>
				{data.languages.map((lang) => (
					<li>{lang.name}</li>
				))}
			</ul>
			<figure>
				<img src={data.flag} alt="flag" width="300px" />
			</figure>
			<h3>Weather Data</h3>
			{weatherData ? (
				<>
					<p>
						<b>temperature:</b> {weatherData.current.temperature} celsius
					</p>
					<div>
						{weatherData.current.weather_icons.map((src) => (
							<img src={src} alt="wather" />
						))}
					</div>
					<p>
						<b>wind: </b>
						{weatherData.current.wind_speed} mph direction{' '}
						{weatherData.current.wind_dir}
					</p>
				</>
			) : (
				<p>Loading weather data...</p>
			)}
		</div>
	);
};

const ListView = ({ data, changeView, setCountriesData }) => {
	return (
		<div>
			{data.length > 10 ? (
				<p>Too many matches. Specify another filter</p>
			) : (
				<div>
					{data.map((country, i) => {
						return (
							<p>
								{country.name}
								<button
									onClick={() => {
										changeView('single');
										setCountriesData([data[i]]);
									}}
								>
									show
								</button>
							</p>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default App;
