const app = {};

app.events = () => {
	const menuBut = document.getElementById('hamburger');
	menuBut.addEventListener('click', () => {
		const menuUl = document.getElementById('menuUl');
		menuUl.classList.toggle('active');
	})
}

app.counters = () => {
	const numbers = [].slice.call(document.querySelectorAll('.counterNum'));
	numbers.forEach((item) => {
		const max = item.dataset.to;
		let min = 0;
		let timing = 100

		if (max > 3000) {
			timing = 1 / 100000;
		}

		const comma = document.querySelector(".counterNum[data-type='comma']");

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
		}, timing)
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
		flag.setAttribute("src", `/assets/svg/flag/${language.innerText.toLowerCase()}.svg`);

		language.addEventListener('click', (e) => {
			let languageName = language.textContent.toLowerCase();
			// language.querySelector('button')
			languagesBtn.forEach((languageSib) => {
				languageSib.classList.remove('active');
			})
			language.classList.add('active');

			fetching(languageName);
		});
	})

	const markupWhyUs = (text, language) => {
		const container = document.getElementById('why-us');
		const res = text[language];

		const generateText = (data) => {
			let result = []
			for (let line in data) {
				result.push(`<div><h6>${data[line].title}</h6><p>${data[line].text}</p></div>`)
			}

			return result.join('')
		}

		container.innerHTML = `
		<div class="container">
			<h5>Accent Translations is:</h5>
			${generateText(res.whyus)}
		</div>`
	}


	fetching("english");
}

app.applicantForm = () => {
	var $form = $('form#test-form'),
		url = 'https://script.google.com/macros/s/AKfycbxV-sS5obCWcSxQx6Mzc2Rln0dTDHWLPCUcy_APR1Emmuq1Iwbe/exec'


	$('#submit-form').on('click', function (e) {
		e.preventDefault();

		// fetch(url, {
		//   method: "GET",
		//   mode: 'cors',
		//   data: $form.serialize()
		// }).then(res => {
		// 	return res.json();
		// 	console.log(res)
		// }).catch(err => {
		// 	console.log(err)
		// })

		var jqxhr = $.ajax({
			url: url,
			method: "GET",
			dataType: "json",
			data: $form.serialize()
		}).done((res) => {
			console.log(res)
		})

		var file,
			reader = new FileReader();



		function showSuccess(e) {
			if (e === "OK") {
				$('#forminner').hide();
				$('#success').show();
			} else {
				showError(e);
			}
		}


		var files = $('#file')[0].files;

		if (files.length === 0) {
			showError("Please select a file to upload");
			return;
		}

		file = files[0];

		if (file.size > 1024 * 1024 * 5) {
			showError("The file size should be < 5 MB. Please <a href='http://www.labnol.org/internet/file-upload-google-forms/29170/' target='_blank'>upgrade to premium</a> for receiving larger files in Google Drive");
			return;
		}

		showMessage("Uploading file..");

		reader.readAsDataURL(file);



		function showError(e) {
			$('#progress').addClass('red-text').html(e);
		}

		function showMessage(e) {
			$('#progress').removeClass('red-text').html(e);
		}


	})
}

app.hoverLetter = () => {
	const letters = document.querySelectorAll('#letters>h3');
	const theWord = document.getElementById('the_word');

	letters.forEach((letter) => {
		letter.addEventListener('mouseenter', (e) => {
			theWord.innerText = e.target.getAttribute('data-name');
		});
	})
}

app.init = () => {
	app.testimonials();
	app.languageSelector();
	app.inView();
	app.events();
	app.applicantForm();
	app.applicationtest();
	app.hoverLetter();
}

app.init();