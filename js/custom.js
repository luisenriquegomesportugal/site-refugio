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

	let formString = '<form class="map-contact">'
	+ '<h2>Refúgio 54</h2>'
	+ '<input type="text" name="nome" placeholder="Nome Completo"/>'
	+ '<input type="number" name="idade" placeholder="Idade"/>'
	+ '<input type="tel" name="telefone" placeholder="Telefone"/>'
	+ '<button type="submit">Desejo visitar essa célula</button>'
	+ '</form>';
	
	
	window.addEventListener('submit', function(event) {
		event.preventDefault();

		let [nome, idade, telefone, ] = event.target;
		let params = new URLSearchParams({
			phone: 559185286060,
			apikey: 9167513,
			text: `Gostaria de visitar a *Refúgio 54* (_enviado pelo site_).

			*Nome:* ${nome.value}
			*Idade:* ${idade.value}
			*Telefone:* ${telefone.value}`
		});
		
		fetch(`https://api.callmebot.com/whatsapp.php?${params.toString()}`)
			.catch(function(err) {
				console.log(err)
			})
			.finally(function() {
				alert('Entraremos em contato o mais breve possível! Deus abençoe');
				event.target.reset();
			});
	});

	geocoder.geocode({ 'address': 'RUA ANTÔNIO EVERDOSA, 985, APTO 101' }, function ([address,], status) {
		if (status === 'OK') {
			let { location } = address.geometry;

			const infowindow = new google.maps.InfoWindow({
				content: formString,
				ariaLabel: "Refúgio 54",
			});

			const marker = new google.maps.Marker({
				map,
				title: "Refúgio 54",
				position: location,
				icon: '/images/icone-marker.png'
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
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
});