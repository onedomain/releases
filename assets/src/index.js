import HTTP from 'marbles/http';
import Config from './config';
import MainRouter from './router';
import JSONMiddleware from 'marbles/http/middleware/serialize_json';
import LayoutComponent from './views/layout';

var $appContainer = document.getElementById("app-container");
var listeners = [];
var appContext = {
	data: {
		channels: [],
		loading: true
	},
	render: function (component, props) {
		props = props || {};
		var wrapped = React.createElement(LayoutComponent, {}, React.createElement(component, props));
		ReactDOM.render(wrapped, $appContainer);
	},
	listen: function (fn) {
		listeners.push(fn);
	}
};

var updateData = function (newData) {
	appContext.data = newData;
	listeners.forEach(function (fn) {
		fn();
	});
};

Config.history.register(new MainRouter({ context: appContext }));
Config.history.start();

HTTP({
	method: 'GET',
	url: '/api/channels',
	middleware: [JSONMiddleware]
}).then(function (args) {
	updateData({
		channels: args[0],
		loading: false
	});
}).catch(function () {
	updateData({
		channels: [],
		loading: false,
		error: 'GET /api/channels Error!'
	});
});
