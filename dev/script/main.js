const app = {};

app.events = () => {
	const menuBut = document.getElementById('hamburger');
	menuBut.addEventListener('click', () => {
		const menuUl = document.getElementById('menuUl');
		menuUl.classList.toggle('active');
	})
}

app.testimonials = () => {

	let array = []

	fetch('./public/js/testimonials.json')
		.then((res) => {
			return res.json();
		})
		.then(res => {
			displayTesti(res.testimonials)
		})
		.catch(err => {
			console.log(err)
		})


	const displayTesti = (array) => {
		let counter = 0;
		const container = document.querySelector('.testimonial');
		const testi = (array, counter) => {

			const testNum = document.querySelector('#testimonialNum');
			container.innerHTML = `
			<p><span class="text">"${array[counter].testimonial}"</span></p>
			<span class="name"><i>${array[counter].person}</i></span>`;

			testNum.innerHTML = `${counter +1}/${array.length}`;
		}
		const arrows = [].slice.call(document.querySelectorAll('.testimonialArrows button'));
		arrows.forEach((item) => {
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
					}, 1000)
				}).then(resolve => {
					testi(array, counter);
					container.classList.remove('transition');
					console.log(resolve)
				})
			});
		})
		testi(array, counter);
	}
}

app.counters = () => {
	const numbers = [].slice.call(document.querySelectorAll('.counterNum'));
	const comma = document.querySelector(".counterNum[data-type='comma']");

	numbers.forEach((item) => {
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
				min = min + (max / 1000);
			}
			if (item.hasAttribute('data-type')) {
				item.innerText = min.toFixed(1);
			} else {
				item.innerText = Math.round(min);
			}
			if (min >= max) {
				clearInterval(timer);
			}
		}, timing)
	})
}

app.inView = () => {
	// document.getElementById('counters').classList.add('in-view');

	const isScrolledIntoView = (elem) => {
		var docViewTop = window.scrollTop;
		var docViewBottom = docViewTop + window.innerHeight;

		var elemTop = elem.offsetTop + 200;
		var elemBottom = elemTop;
		//  + $(elem).height() - 200

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	const something = (function () {
		let executed = false;
		return () => {
			if (!executed) {
				executed = true;
				app.counters();
			}
		};
	})();

	window.addEventListener('scroll', (e) => {
		const counters = [].slice.call(document.querySelectorAll('.counterHome')).forEach((item) => {

			if ((window.pageYOffset + window.innerHeight - 300) >= item.offsetTop) {
				item.classList.add('in-view');
				something();
			} else {
				item.classList.remove('in-view');
			}
		});
	});
}

app.languageSelector = () => {

	const languagesBtn = [].slice.call(document.querySelectorAll('#languages li .btn'));
	const title = document.querySelector('#languageSelector > .container > h3');


	const fetching = (languageSelect) => {
		fetch(`./public/js/languageText.json`)
			.then(res => res.json())
			.then(res => {
				markupWhyUs(res, languageSelect);
			})
			.catch(err => {
				console.log(err)
			})
	}

	languagesBtn.forEach((language) => {
		const flag = language.querySelector('img');
		flag.setAttribute("src", `./assets/svg/flag/${language.innerText.toLowerCase()}.svg`);


		language.addEventListener('click', (e) => {
			let languageName = language.textContent.toLowerCase();
			// language.querySelector('button')
			languagesBtn.forEach((languageSib) => {
				languageSib.classList.remove('active');
			})
			language.classList.add('active');

			fetching(languageName);
			console.log(languageName)
			if (languageName === 'english') {
				title.classList.add('active');
			} else {
				title.classList.remove('active');
			}
		});
	})

	const markupWhyUs = (text, language) => {
		const container = document.getElementById('applicants');
		const res = text[language];

		// const generateText = (data) => {
		// 	let result = []
		// 	for (let line in data) {
		// 		result.push(`<div><h6>${data[line].title}</h6><p>${data[line].text}</p></div>`)
		// 	}

		// 	return result.join('')
		// }

		container.innerHTML = `
		<div class="container">
			${res.whyus.top.text}

			<div id="video"> 
				<div class="vidcon">
					<iframe width="560" height="315" src="${res.whyus.youtube.src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				</div>
			</div>
			
			${res.whyus.bottom.text}

			<a href="https://goo.gl/forms/hHhQUBiBRpvqlrf73" target="_blank"><button class="btn btnDark">Get a Quote</button></a>
		</div>`
	}


	fetching("english");
}



app.hoverLetter = () => {
	const letters = document.querySelectorAll('#letters>h3');
	const theWord = document.getElementById('the_word');

	let currentLetter = 0;

	setInterval(function () {
		theWord.innerText = letters[currentLetter].getAttribute('data-name');
		letters.forEach((letter) => {
			letter.classList.remove("opacity");
		})
		letters[currentLetter].classList.add("opacity")
		currentLetter = (currentLetter + 1) % letters.length;

	}, 2500)
}

app.init = () => {
	if (document.querySelector('#testimonials')) {
		app.testimonials();
		app.inView();
	}
	if (document.querySelector('#languageSelector')) {
		app.languageSelector();
	}
	app.events();
	if (document.querySelector('#why-us-main')) {
		app.hoverLetter();
	}
}

app.init();