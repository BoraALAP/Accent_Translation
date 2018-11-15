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
})({ 1: [function (require, module, exports) {}, {}] }, {}, [1]);