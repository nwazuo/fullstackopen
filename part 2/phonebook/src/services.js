import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const addNumber = (phoneDetails) => {
	return axios.post(baseUrl, phoneDetails).then((response) => response.data);
};

const deleteNumber = (id) => {
	return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

const updateNumber = (phoneDetails) => {
	return axios
		.put(`${baseUrl}/${phoneDetails.id}`, phoneDetails)
		.then((response) => response.data);
};

export default { addNumber, deleteNumber, updateNumber };
