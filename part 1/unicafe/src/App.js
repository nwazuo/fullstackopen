import React, { useState } from 'react';

const Button = ({ children, onClick }) => (
	<button onClick={onClick}>{children}</button>
);

const Statistic = ({ text, value }) => (
	<tr>
		<td>{text}</td> <td>{value}</td>
	</tr>
);

const Statistics = ({ show, stats }) => {
	return (
		<>
			<h1>statistics</h1>
			{show ? (
				<table>
					<tbody>
						<Statistic text="good" value={stats.good} />
						<Statistic text="neutral" value={stats.neutral} />
						<Statistic text="bad" value={stats.bad} />
						<Statistic text="all" value={stats.total} />
						<Statistic text="average" value={stats.average} />
						<Statistic text="positive" value={stats.positive} />
					</tbody>
				</table>
			) : (
				'no stats yet'
			)}
		</>
	);
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);
	const [isFeedback, setFeedback] = useState(false);

	const handleClick = (setValue, value) => () => {
		setFeedback(true);
		setValue(value + 1);
	};

	const total = Number(good + neutral + bad);
	const average = (good * 1 + 0 + bad * -1) / total || 0;
	const positive = (good / total) * 100 || 0;
	const stats = { good, neutral, bad, average, total, positive };

	return (
		<div>
			<h1>give feedback</h1>
			<div>
				<Button onClick={handleClick(setGood, good)}>good</Button>
				<Button onClick={handleClick(setNeutral, neutral)}>neutral</Button>
				<Button onClick={handleClick(setBad, bad)}>bad</Button>
			</div>

			<Statistics show={isFeedback} stats={stats} />
		</div>
	);
};

export default App;
