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
		(function ($) {
			var result_target = '';
			var picker = null;
			var gopts = {
				'devkey': null, //api key
				'appid': null,
				'user': null,
				'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive',
				'authtok': null,
				'init_stage': 0,
				'width': 800,
				'height': 400,
				'callback': set_results,
				'debug': false
			};

			var dlgopts = {};

			function do_auth(callback) {
				google_api_load();
				if (gopts.authtok != null && gopts.user != null) {
					if (callback) callback();
					return;
				}
				if (gopts.debug) console.log("invoking autorization");
				gapi.auth.authorize({
					'client_id': gopts.appid,
					'scope': gopts.scope,
					'immediate': false
				}, function (auth_result) {
					if (auth_result && !auth_result.error) {
						gopts.authtok = auth_result.access_token;
						get_user_id(callback);
					} else {
						console.log("Could not authenticate you with Google");
					}
				});
			};

			function get_user_id(callback) {
				gapi.client.setApiKey(gopts.devkey);
				gapi.client.load('oauth2', 'v2', function () {
					gapi.client.oauth2.userinfo.get().execute(function (resp) {
						gopts.user = resp.email;
						if (callback) callback();
					});
				});
			};

			function google_api_load() {
				if ((gopts.init_stage & 3) == 3) return;
				if (!(gopts.init_stage & 1)) gapi.load('auth', { 'callback': function () {
						gopts.init_stage |= 1;
					} });
				if (!(gopts.init_stage & 2)) gapi.load('picker', { 'callback': function () {
						gopts.init_stage |= 2;
					} });
			};

			function set_results(target_id, data) {
				if (data.action == google.picker.Action.PICKED) {
					var doc = data.docs[0];
					var file_id = doc.id;
					var url = doc[google.picker.Document.URL];
					var filename = doc[google.picker.Document.NAME];
					var fullpath = "gdrive://" + filename + "/" + file_id;
					$('#' + target_id).val(fullpath);
					$('#' + target_id).change();
				}
			};

			function show_dlg(target_id) {
				$('#' + target_id).val('');
				var elem_opts = dlgopts[target_id];

				var view = new google.picker.DocsView(google.picker.ViewId.DOCS);
				view.setMode(google.picker.DocsViewMode.LIST);
				if (elem_opts.filter == 'application/vnd.google-apps.folder') {
					view.setSelectFolderEnabled(true);
					view.setMimeTypes('application/vnd.google-apps.folder');
				}

				var picker_builder = new google.picker.PickerBuilder().enableFeature(google.picker.Feature.NAV_HIDDEN).disableFeature(google.picker.Feature.MULTISELECT_ENABLED).setAppId(gopts.appid).addView(view)
				//.addView(new google.picker.View(google.picker.ViewId.FOLDERS))
				.setOAuthToken(gopts.authtok).setDeveloperKey(gopts.devkey).setCallback(function (data) {
					gopts.callback(target_id, data);
				}).setSize(gopts.width, gopts.height).setTitle(elem_opts.header);
				if (gopts.user != null) picker_builder.setAuthUser(gopts.user);
				picker = picker_builder.build();
				picker.setVisible(true);
				return picker;
			};

			$.fn.gdrive = function (action, options) {
				if (action === 'init') {
					gopts = $.extend(gopts, options);
					google_api_load();
					return this;
				}
				if (action === 'set') {
					return this.each(function () {
						var elemid = $(this).attr('id');
						var elem_opts = $.extend($.extend(dlgopts[elemid], { 'trigger': null, 'header': '', 'filter': '' }), options);
						dlgopts[elemid] = elem_opts;
						var trig_elem = elem_opts.trigger == null ? elemid : elem_opts.trigger;
						$('#' + trig_elem).click(function () {
							do_auth(function () {
								picker = show_dlg(elemid);
							});
						});
					});
				}
				if (action === 'show') {
					var elemid = this.attr('id');
					do_auth(function () {
						picker = show_dlg(elemid);
					});
					return this;
				}
				if (action === 'hide') {
					if (null != picker) {
						picker.setVisible(false);
						picker = null;
					}
					return this;
				}
				if (action == 'token') {
					return gopts.authtok;
				}
				if (action == 'user') {
					return gopts.user;
				}
				if (action == 'setauth') {
					var elem_opts = $.extend({ 'uid': null, 'token': null, 'callback': null }, options);
					var target_uid = elem_opts.uid;
					var target_tok = elem_opts.token;
					var callback = elem_opts.callback;
					do_auth(function () {
						if (null != target_uid) $('#' + target_uid).val(gopts.user);
						if (null != target_tok) $('#' + target_tok).val(gopts.authtok);
						if (null != callback) callback();
					});
				}
				if (action == 'debug') {
					return gopts;
				}
			};
		})(jQuery);
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
			const picker = document.getElementById('picker');

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

			picker.addEventListener('click', e => {
				app.gDrive();
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

				const comma = document.querySelector(".counterNum[data-type='comma']");
				console.log(comma.split(0));

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
				flag.setAttribute("src", `/assets/svg/flag/${language.innerText.toLowerCase()}.svg`);

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

		app.applicantForm = () => {
			var $form = $('form#test-form'),
			    url = 'https://script.google.com/macros/s/AKfycbxV-sS5obCWcSxQx6Mzc2Rln0dTDHWLPCUcy_APR1Emmuq1Iwbe/exec';

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
				}).done(res => {
					console.log(res);
				});

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
			});
		};

		app.applicationtest = () => {};

		app.init = () => {
			app.testimonials();
			app.languageSelector();
			app.inView();
			app.events();
			app.applicantForm();
			app.applicationtest();
		};

		app.init();
	}, {}] }, {}, [1]);