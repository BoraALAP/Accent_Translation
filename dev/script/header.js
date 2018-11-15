const dropdownMenuItems = () => {
	const dropdown = Array.prototype.slice.call(document.querySelectorAll('.dropdown-item'));

	dropdown.forEach((item) => {
		const list = item.querySelector('.dropdown-menu')
		item.addEventListener('click',() => {
			list.classList.toggle('active');
			console.log(item)
		});
		item.addEventListener('mouseleave',() => {
			list.classList.remove('active');
		});
	})
}

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



dropdownMenuItems();
scroll();