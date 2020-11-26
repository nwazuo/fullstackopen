import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Services from './services';
import './index.css';

const PersonForm = ({
	setNewName,
	newName,
	setNewNumber,
	newNumber,
	handleSubmit,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<h2>Add new</h2>
			<div>
				name:{' '}
				<input onChange={(e) => setNewName(e.target.value)} value={newName} />
				<br />
				phone no:{' '}
				<input
					onChange={(e) => setNewNumber(e.target.value)}
					value={newNumber}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

const Filter = ({ handleFilter, filterField }) => (
	<div>
		filter shown with <input onChange={handleFilter} value={filterField} />
	</div>
);

const Persons = ({ persons, filtered, filterField, deletePerson }) => (
	<ul>
		{(filterField === '' ? persons : filtered).map((person) => (
			<li key={person.name}>
				{person.name} - {person.number}
				<button onClick={() => deletePerson(person)}>delete</button>
			</li>
		))}
	</ul>
);

const Notification = ({ message, error }) => {
	if (!message) {
		return null;
	}

	return <div className={error ? 'error' : 'success'}>{message}</div>;
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filtered, setFiltered] = useState(persons);
	const [filterField, setFilterField] = useState('');
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [notification, setNotification] = useState('');
	const [error, setError] = useState(false);

	useEffect(() => {
		axios.get('http://localhost:3001/persons').then((response) => {
			setPersons(response.data);
		});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!newName || !newNumber) return;
		const existingNote = persons.find((value) => value.name === newName);

		if (existingNote) {
			let confirmUpdate = window.confirm(
				`${newName} already exists, update phone number?`
			);
			if (confirmUpdate) {
				const updatedNote = { ...existingNote, number: newNumber };
				Services.updateNumber(updatedNote)
					.then((data) => {
						let updatedPersons = persons.map((person) =>
							person.id !== updatedNote.id ? person : updatedNote
						);
						setPersons(updatedPersons);
						setNewName('');
						setNewNumber('');
						notificationHandler(`${updatedNote.name} updated successfully`);
					})
					.catch((err) => {
						if (err.response.status === 404) {
							notificationHandler(
								`Information of ${newName} has already been removed from server`,
								true
							);
						}
					});
			}
			return;
		}

		Services.addNumber({ name: newName, number: newNumber })
			.then((data) => {
				setPersons(persons.concat(data));
				setNewName('');
				setNewNumber('');
				notificationHandler(`${data.name} added successfully`);
			})
			.catch((err) => notificationHandler(`Something went wrong`, true));
	};

	const notificationHandler = (msg, error = false) => {
		setNotification(msg);
		if (error) {
			setError(true);
			setTimeout(() => {
				setError(false);
				setNotification(null);
			}, 2000);
		} else {
			setTimeout(() => {
				setNotification(null);
			}, 2000);
		}
	};

	const handleFilter = (e) => {
		setFilterField(e.target.value);
		let filter = persons.filter(
			(person) =>
				person.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
		);
		setFiltered(filter);
	};

	const handleDelete = (data) => {
		let confirm = window.confirm(`Delete ${data.name} ?`);
		if (confirm) {
			Services.deleteNumber(data.id)
				.then((deletedData) => {
					let newPersons = persons.filter((person) => person.id !== data.id);
					setPersons(newPersons);
					notificationHandler(`${data.name} deleted successfully`);
				})
				.catch((err) => {
					if (err.response.status === 404) {
						notificationHandler(
							`Information of ${data.name} has already been removed from server`,
							true
						);
					}
				});
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notification} error={error} />
			<Filter handleFilter={handleFilter} filterField={filterField} />
			<PersonForm
				setNewName={setNewName}
				newName={newName}
				setNewNumber={setNewNumber}
				newNumber={newNumber}
				handleSubmit={handleSubmit}
			/>
			<h2>Numbers</h2>
			<Persons
				filtered={filtered}
				persons={persons}
				filterField={filterField}
				deletePerson={handleDelete}
			/>
		</div>
	);
};

export default App;
