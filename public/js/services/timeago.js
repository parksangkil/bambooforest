(function(){
	'use strict';
	var app = angular.module('bambooforest');



	app.directive('timeAgo', ['timeAgo', 'nowTime', function (timeAgo, nowTime) {
		return {
			restrict: 'EA',
			link: function(scope, elem, attrs) {
				var fromTime;

				// Track the fromTime attribute
				attrs.$observe('fromTime', function (value) {
					fromTime = timeAgo.parse(value);
				});

				// Track changes to time difference
				scope.$watch(function () {
					return nowTime() - fromTime;
				}, function(value) {
					angular.element(elem).text(timeAgo.inWords(value));
				});
			}
		};
	}]).factory('nowTime', ['$window', '$rootScope', function ($window, $rootScope) {
		var nowTime = Date.now();
		var updateTime = function() {
			$window.setTimeout(function() {
				$rootScope.$apply(function(){
					nowTime = Date.now();
					updateTime();
				});
			}, 1000);
		};
		updateTime();
		return function() {
			return nowTime;
		};
	}]).factory('timeAgo', function () {
		var service = {};

		service.settings = {
			refreshMillis: 60000,
			allowFuture: false,
			strings: {
				'en_US': {
					prefixAgo: null,
					prefixFromNow: null,
					suffixAgo: 'ago',
					suffixFromNow: 'from now',
					seconds: 'less than a minute',
					minute: 'about a minute',
					minutes: '%d minutes',
					hour: 'about an hour',
					hours: 'about %d hours',
					day: 'a day',
					days: '%d days',
					month: 'about a month',
					months: '%d months',
					year: 'about a year',
					years: '%d years',
					numbers: []
				},
				'ko_KR': {
					prefixAgo: null,
					prefixFromNow: null,
					suffixAgo: '전',
					suffixFromNow: '방금',
					seconds: '방금',
					minute: '1 분',
					minutes: '%d 분',
					hour: '1 시간',
					hours: '%d 시간',
					day: '하루',
					days: '%d 일',
					month: '1 개월',
					months: '%d 개월',
					year: '작년',
					years: '%d 년',
					numbers: []
				}
			}
		};

		service.inWords = function (distanceMillis) {
			var lang = document.documentElement.lang;
			var $l = service.settings.strings[lang];
			if (typeof $l === 'undefined') {
				$l = service.settings.strings['en_US'];
			}
			var prefix = $l.prefixAgo;
			var suffix = $l.suffixAgo;
			if (service.settings.allowFuture) {
				if (distanceMillis < 0) {
					prefix = $l.prefixFromNow;
					suffix = $l.suffixFromNow;
				}
			}

			var seconds = Math.abs(distanceMillis) / 1000;
			var minutes = seconds / 60;
			var hours = minutes / 60;
			var days = hours / 24;
			var years = days / 365;

			function substitute(stringOrFunction, number) {
				var string = angular.isFunction(stringOrFunction) ?
					stringOrFunction(number, distanceMillis) : stringOrFunction;
				var value = ($l.numbers && $l.numbers[number]) || number;
				return string.replace(/%d/i, value);
			}

			var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
				seconds < 90 && substitute($l.minute, 1) ||
				minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
				minutes < 90 && substitute($l.hour, 1) ||
				hours < 24 && substitute($l.hours, Math.round(hours)) ||
				hours < 42 && substitute($l.day, 1) ||
				days < 30 && substitute($l.days, Math.round(days)) ||
				days < 45 && substitute($l.month, 1) ||
				days < 365 && substitute($l.months, Math.round(days / 30)) ||
				years < 1.5 && substitute($l.year, 1) ||
				substitute($l.years, Math.round(years));

			var separator = $l.wordSeparator === undefined ?  ' ' : $l.wordSeparator;
			if(lang === 'he_IL'){
				return [prefix, suffix, words].join(separator).trim();
			} else {
				return [prefix, words, suffix].join(separator).trim();
			}
		};

		service.parse = function (iso8601) {
			if (angular.isNumber(iso8601)) {
				return parseInt(iso8601, 10);
			}
			if (iso8601 instanceof Date){
				return iso8601;
			}
			var s = (iso8601 || '').trim();
			s = s.replace(/\.\d+/, ''); // remove milliseconds
			s = s.replace(/-/, '/').replace(/-/, '/');
			s = s.replace(/T/, ' ').replace(/Z/, ' UTC');
			s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
			return new Date(s);
		};

		return service;
	}).filter('timeAgo', ['nowTime', 'timeAgo', function (nowTime, timeAgo) {
		return function (value) {
			var fromTime = timeAgo.parse(value);
			var diff = nowTime() - fromTime;
			return timeAgo.inWords(diff);
		};
	}]);


})();