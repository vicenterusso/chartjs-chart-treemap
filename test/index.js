'use strict';

import Chart from 'chart.js';
import fixture from './fixture';
import matchers from './matchers';
import utils from './utils';

var charts = {};

// force ratio=1 for tests on high-res/retina devices
window.devicePixelRatio = 1;

jasmine.chart = {
	acquire: function() {
		var chart = utils.acquireChart.apply(utils, arguments);
		charts[chart.id] = chart;
		return chart;
	},
	release: function(chart) {
		utils.releaseChart.apply(utils, arguments);
		delete charts[chart.id];
	}
};

jasmine.fixture = fixture;
jasmine.triggerMouseEvent = utils.triggerMouseEvent;

beforeEach(function() {
	jasmine.addMatchers(matchers);

	Chart.helpers.merge(Chart.defaults, {
		animation: false,
		legend: {display: false},
		responsive: false,
		title: {display: false},
		tooltips: {enabled: false}
	});
});

afterEach(function() {
	// Auto releasing acquired charts
	Object.keys(charts).forEach(function(id) {
		var chart = charts[id];
		if (!(chart.$test || {}).persistent) {
			jasmine.chart.release(chart);
		}
	});
});
