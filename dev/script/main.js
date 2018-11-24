const app = {};

app.events = () => {
	const menuBut = document.getElementById('hamburger');
	
	menuBut.addEventListener('click',(e) => {
		const menuUl = document.getElementById('menuUl');
		const menuSVG = menuBut.querySelector('svg');
		menuBut.classList.toggle('active');
		menuUl.classList.toggle('active');

		if (menuBut.classList.contains('active')){
			menuSVG.dataset.icon = 'times'
		} else {
			menuSVG.dataset.icon = 'bars'
		}
	});
}

app.counters = () => {
	const numbers = [].slice.call(document.querySelectorAll('.counterNum'));
	numbers.forEach((item) => {
		const max = item.dataset.to;
		let min = 0;
		let timing = 100

		if (max > 3000){
			timing = 1 / 100000;
		}

	  // return new Promise(resolve => {
		const timer = setInterval(() => {
			if (min < max){
				if (max > 3000){
				  	min = min + 10;
				} else {
			    	min++;
			    }
			}
			item.innerText = min;
			if (min == max){
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
			item.addEventListener('click',() => {
				return new Promise ((resolve,reject) => {
					container.classList.add('transition');
					setTimeout(() => {		
						if (item.getAttribute('data-direction') == 'right'){
							if(counter < array.length -1) {
								counter ++;
							} else {
								counter = 0;
							}
					  	} else {
					  		if(counter > 0) {
								counter --;
							} else {
								counter = array.length -1;
							}
					  	}
					  	resolve(counter);
					}, 1000)				
				}).then(resolve =>{
					testi(array,counter);
					container.classList.remove('transition');
					console.log(resolve)
				})
			});
		})
		testi(array,counter);
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

	const something = (function() {
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
		
		language.addEventListener('click',(e) => {
			let languageName = language.textContent.toLowerCase();
			// language.querySelector('button')
			languagesBtn.forEach((languageSib) => {
				languageSib.classList.remove('active');
			})
			language.classList.add('active');

			fetching(languageName);
		});
	})

	const markupWhyUs = (text,language) => {
		const container = document.getElementById('why-us');
		const res = text[language];
		
		const generateText = (data) => {
			let result = []
			for (let line in data){
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

app.init = () => {
	app.testimonials();
	app.languageSelector();
	app.inView();
	app.events();
}

app.init();