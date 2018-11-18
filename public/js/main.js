(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
			}var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, f, f.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
		const dropdownMenuItems = () => {
			const dropdown = Array.prototype.slice.call(document.querySelectorAll('.dropdown-item'));

			dropdown.forEach(item => {
				const list = item.querySelector('.dropdown-menu');
				item.addEventListener('click', () => {
					list.classList.toggle('active');
					console.log(item);
				});
				item.addEventListener('mouseleave', () => {
					list.classList.remove('active');
				});
			});
		};

		const scroll = () => {
			const backToTop = document.getElementById('backToTop');

			backToTop.addEventListener('click', e => {
				window.scroll({
					top: 0, // could be negative value
					left: 0,
					behavior: 'smooth'
				});
			});
		};

		dropdownMenuItems();
		scroll();
	}, {}] }, {}, [1]);
(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
			}var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, f, f.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
		const app = {};

		app.events = () => {
			const menuBut = document.getElementById('hamburger');

			menuBut.addEventListener('click', e => {
				const menuUl = document.getElementById('menuUl');
				const menuSVG = menuBut.querySelector('svg');
				menuBut.classList.toggle('active');
				menuUl.classList.toggle('active');

				if (menuBut.classList.contains('active')) {
					menuSVG.dataset.icon = 'times';
				} else {
					menuSVG.dataset.icon = 'bars';
				}
			});
		};

		app.counters = () => {
			const numbers = [].slice.call(document.querySelectorAll('.counterNum'));
			numbers.forEach(item => {
				const max = item.dataset.to;
				let min = 0;
				let timing = 100;

				if (max > 3000) {
					timing = 1 / 100000;
				}

				console.log(max % 20);

				// return new Promise(resolve => {
				const timer = setInterval(() => {
					if (min < max) {
						if (max > 3000) {
							min = min + 10;
						} else {
							min++;
						}
					}
					item.innerText = min;
					if (min == max) {
						clearInterval(timer);
					}
				}, timing);
			});
		};

		app.testimonials = () => {

			let array = [];

			fetch('./public/js/testimonials.json').then(res => {
				return res.json();
			}).then(res => {
				displayTesti(res.testimonials);
			}).catch(err => {
				console.log(err);
			});

			const displayTesti = array => {
				let counter = 0;
				const container = document.querySelector('.testimonial');
				const testi = (array, counter) => {

					const testNum = document.querySelector('#testimonialNum');
					container.innerHTML = `
			<p><span class="text">"${array[counter].testimonial}"</span></p>
			<span class="name"><i>${array[counter].person}</i></span>`;

					testNum.innerHTML = `${counter + 1}/${array.length}`;
				};
				const arrows = [].slice.call(document.querySelectorAll('.testimonialArrows button'));
				arrows.forEach(item => {
					item.addEventListener('click', () => {
						return new Promise((resolve, reject) => {
							container.classList.add('transition');
							setTimeout(() => {
								if (item.getAttribute('data-direction') == 'right') {
									if (counter < array.length - 1) {
										counter++;
									} else {
										counter = 0;
									}
								} else {
									if (counter > 0) {
										counter--;
									} else {
										counter = array.length - 1;
									}
								}
								resolve(counter);
							}, 1000);
						}).then(resolve => {
							testi(array, counter);
							container.classList.remove('transition');
							console.log(resolve);
						});
					});
				});
				testi(array, counter);
			};
		};

		app.inView = () => {
			// document.getElementById('counters').classList.add('in-view');

			const isScrolledIntoView = elem => {
				var docViewTop = window.scrollTop;
				var docViewBottom = docViewTop + window.innerHeight;

				var elemTop = elem.offsetTop + 200;
				var elemBottom = elemTop;
				//  + $(elem).height() - 200

				return elemBottom <= docViewBottom && elemTop >= docViewTop;
			};

			var something = function () {
				var executed = false;
				return function () {
					if (!executed) {
						executed = true;
						app.counters();
					}
				};
			}();

			window.addEventListener('scroll', e => {
				const counters = [].slice.call(document.querySelectorAll('.counterHome')).forEach(item => {

					if (window.pageYOffset + window.innerHeight - 300 >= item.offsetTop) {
						item.classList.add('in-view');
						something();
					} else {
						item.classList.remove('in-view');
					}
				});
			});
		};

		app.init = () => {
			app.testimonials();
			app.inView();
			app.events();
		};

		app.init();
	}, {}] }, {}, [1]);