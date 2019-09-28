import React from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './HomePage/index.js';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={HomePage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
