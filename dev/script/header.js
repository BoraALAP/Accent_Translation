const scroll = () => {
	const backToTop = document.getElementById('backToTop');

	backToTop.addEventListener('click', (e) => {
	  window.scroll({ 
		top: 0, // could be negative value
		left: 0, 
		behavior: 'smooth' 
	});
	});
	
}

scroll();