import React from 'react';

const Header = ({ course }) => {
	return <h2>{course.name}</h2>;
};

const Total = ({ course }) => {
	const sum = course.parts.reduce((acc, cur) => Number(acc + cur.exercises), 0);
	return (
		<p>
			<b>Number of exercises {sum}</b>
		</p>
	);
};

const Part = (props) => {
	return (
		<p>
			{props.part.name} {props.part.exercises}
		</p>
	);
};

const Content = ({ course }) => {
	return (
		<div>
			{course.parts.map((part) => (
				<Part part={part} key={part.id} />
			))}
			<Total course={course} />
		</div>
	);
};

const Course = ({ courses }) => {
	return (
		<>
			<h1>Web development curriculum</h1>
			{courses.map((course) => (
				<div key={course.id}>
					<Header course={course} />
					<Content course={course} />
				</div>
			))}
		</>
	);
};

export default Course;
