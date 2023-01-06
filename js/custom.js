$(function () {
	"use strict";

	/* Preloader
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	setTimeout(function () {
		$('.loader_bg').fadeToggle();
	}, 1500);

	/* Scroll to Top
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	$("#back-to-top").on("click", function () {
		$('body,html').animate({
			scrollTop: 0
		}, 1000);
	});

	/* Map
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	let geocoder = new google.maps.Geocoder();
	let map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: -1.4381579, lng: -48.4747411 },
		zoom: 13,
	});

	let builderForm = function (celula) {
		return `<form class="map-contact">`
		+ `<h2>Refúgio ${celula}</h2>`
		+ `<input type="hidden" name="celula" value="${celula}"/>`
		+ `<input type="text" name="nome" placeholder="Nome Completo"/>`
		+ `<input type="number" name="idade" placeholder="Idade"/>`
		+ `<input type="tel" name="telefone" placeholder="Telefone"/>`
		+ `<button type="submit">Desejo visitar essa célula</button>`
		+ `</form>`;
	}

	window.addEventListener('submit', function (event) {
		event.preventDefault();

		if (event.target.classList.contains('map-contact')) {
			let [celula, nome, idade, telefone,] = event.target;
			let params = new URLSearchParams({
				phone: 559185286060,
				apikey: 9167513,
				text: `Gostaria de visitar a *Refúgio ${celula.value}* (_enviado pelo site_).

			*Nome:* ${nome.value}
			*Idade:* ${idade.value}
			*Telefone:* ${telefone.value}`
			});

			fetch(`https://api.callmebot.com/whatsapp.php?${params.toString()}`)
				.catch(function (err) {
					console.log(err)
				})
				.finally(function () {
					alert('Entraremos em contato o mais breve possível! Deus abençoe');
					event.target.reset();
				});
		}
	});

	fetch('https://docs.google.com/spreadsheets/d/193-JG5mPmBXXl90pvH44h5-A5jKD9j0ABG9hrU03FnY/gviz/tq?tqx=out:csv&tq&gid=0')
		.then(res => res.text())
		.then(csv => Papa.parse(csv, {header: true}))
		.then(sheet => {
			for(let celula of sheet.data) {
				let enderecoCompleto = `${celula['ENDEREÇO']} - ${celula['BAIRRO']}, ${celula['CEP']}, ${celula['CIDADE']}`;

				geocoder.geocode({ 'address': enderecoCompleto }, function ([address,], status) {
					if (status === 'OK') {
						let { location } = address.geometry;
			
						const infowindow = new google.maps.InfoWindow({
							content: builderForm(celula['CÉLULA']),
							ariaLabel: `Refúgio ${celula['CÉLULA']}`,
						});
			
						const marker = new google.maps.Marker({
							map,
							title: `Refúgio ${celula['CÉLULA']}`,
							position: location,
							icon: 'images/icone-marker.png'
						});
			
						marker.addListener("click", () => {
							map.setCenter(location);
							map.setZoom(15);
							infowindow.open({
								anchor: marker,
								map,
							});
						});
					} else {
						console.log('Geocode was not successful for the following reason: ' + status, celula['CÉLULA']);
					}
				});
			}
		})

	
});