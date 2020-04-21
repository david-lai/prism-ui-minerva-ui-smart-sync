import React from 'react';
import rrd from 'react-router-dom';
// Just render plain div with its children
rrd.BrowserRouter = ({children}) => {
	return (
		<div>
			{ children }
		</div>
	);
};
rrd.HashRouter = ({children}) => {
	return (
		<div>
			{ children }
		</div>
	);
};

export default rrd;
