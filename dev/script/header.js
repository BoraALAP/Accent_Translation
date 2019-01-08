const scroll = () => {
	const backToTop = document.getElementById('backToTop');

	backToTop.addEventListener('click', (e) => {
	  window.scroll({ 
		top: 0, // could be negative value
		left: 0, 
		behavior: 'smooth' 
	});
	});
	


	window.addEventListener('scroll', (e) => {
		const accent = document.getElementById('ACCENT')
		const translations = document.getElementById('TRANSLATIONS')

		if ( window.pageYOffset > 200) {
			accent.classList.add('hide');
			translations.classList.add('hide');
		} else {
			accent.classList.remove('hide');
			translations.classList.remove('hide');
		};
		
	})

}

scroll();