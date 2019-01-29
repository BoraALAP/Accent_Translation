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
		const scroll = () => {
			const backToTop = document.getElementById('backToTop');

			backToTop.addEventListener('click', e => {
				window.scroll({
					top: 0, // could be negative value
					left: 0,
					behavior: 'smooth'
				});
			});

			window.addEventListener('scroll', e => {
				const accent = document.getElementById('ACCENT');
				const translations = document.getElementById('TRANSLATIONS');

				if (window.pageYOffset > 200) {
					accent.classList.add('hide');
					translations.classList.add('hide');
				} else {
					accent.classList.remove('hide');
					translations.classList.remove('hide');
				};
			});
		};

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
			menuBut.addEventListener('click', () => {
				const menuUl = document.getElementById('menuUl');
				menuUl.classList.toggle('active');
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

		app.counters = () => {
			const numbers = [].slice.call(document.querySelectorAll('.counterNum'));
			const comma = document.querySelector(".counterNum[data-type='comma']");

			numbers.forEach(item => {
				let max = item.dataset.to;
				let min = 0;
				let timing;

				if (max > 3000) {
					timing = item.dataset.to / 1200;
				} else if (item.hasAttribute('data-type')) {
					max = item.dataset.to / 10;
					timing = item.dataset.to / 10;
				} else {
					max = item.dataset.to;
					timing = 10;
				}

				const timer = setInterval(() => {
					if (min < max) {
						min = min + max / 1000;
					}
					if (item.hasAttribute('data-type')) {
						item.innerText = min.toFixed(1);
					} else {
						item.innerText = Math.round(min);
					}
					if (min >= max) {
						clearInterval(timer);
					}
				}, timing);
			});
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

			const something = function () {
				let executed = false;
				return () => {
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

		app.languageSelector = () => {

			const languagesBtn = [].slice.call(document.querySelectorAll('#languages li .btn'));

			const fetching = languageSelect => {
				fetch(`./public/js/languageText.json`).then(res => res.json()).then(res => {
					markupWhyUs(res, languageSelect);
				}).catch(err => {
					console.log(err);
				});
			};

			languagesBtn.forEach(language => {
				const flag = language.querySelector('img');
				flag.setAttribute("src", `./assets/svg/flag/${language.innerText.toLowerCase()}.svg`);

				language.addEventListener('click', e => {
					let languageName = language.textContent.toLowerCase();
					// language.querySelector('button')
					languagesBtn.forEach(languageSib => {
						languageSib.classList.remove('active');
					});
					language.classList.add('active');

					fetching(languageName);
				});
			});

			const markupWhyUs = (text, language) => {
				const container = document.getElementById('why-us');
				const res = text[language];

				const generateText = data => {
					let result = [];
					for (let line in data) {
						result.push(`<div><h6>${data[line].title}</h6><p>${data[line].text}</p></div>`);
					}

					return result.join('');
				};

				container.innerHTML = `
		<div class="container">
			<h5>Accent Translations is:</h5>
			${generateText(res.whyus)}
		</div>`;
			};

			fetching("english");
		};

		app.hoverLetter = () => {
			const letters = document.querySelectorAll('#letters>h3');
			const theWord = document.getElementById('the_word');

			let currentLetter = 0;
			console.log("set on the page");

			setInterval(function () {
				theWord.innerText = letters[currentLetter].getAttribute('data-name');
				console.log("interval start");
				letters.forEach(letter => {
					letter.classList.remove("opacity");
					console.log("each letter run");
				});
				letters[currentLetter].classList.add("opacity");
				currentLetter = (currentLetter + 1) % letters.length;
			}, 4000);
		};

		app.init = () => {
			if (window.location.pathname == "/") {
				app.testimonials();
				app.inView();
			}
			if (window.location.pathname == "././imm-applicants.html") {
				app.languageSelector();
			}
			app.events();
			if (window.location.pathname == "././why-us.html") {
				app.hoverLetter();
			}
		};

		app.init();
	}, {}] }, {}, [1]);