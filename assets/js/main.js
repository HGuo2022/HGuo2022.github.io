/*
	Twenty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '981px',   '1280px' ],
			narrow:    [ '841px',   '980px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() { return $header.length ? $header.height() + 10 : 0; }
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			expandMode: (browser.mobile ? 'click' : 'hover')
		});

	// Nav Panel.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

		// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
			if (browser.os == 'wp' && browser.osVersion < 10)
				$('#navButton, #navPanel, #page-wrapper')
					.css('transition', 'none');

	// Header.
		if (!browser.mobile
		&&	$header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt reveal'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			});

		}

	// Lightbox for project images/videos
		var $lightbox = $('#lightbox');
		var $lightboxImg = $('#lightbox-img');
		var $lightboxVideo = $('#lightbox-video');
		var $lightboxSource = $('#lightbox-source');
		var $lightboxContent = $('.lightbox-content');
		var currentSlides = [];
		var currentSlideIndex = 0;

		// Prevent default behavior and open lightbox when clicking project images
		$(document).on('click', 'a[href="#"]', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $slideshow = $(this).find('.slideshow');
			if (!$slideshow.length) return;
			var $slides = $slideshow.find('.slide');

			// Store the slides from this project
			currentSlides = [];
			$slides.each(function() {
				var isVideo = this.tagName.toLowerCase() === 'video';
				var src = isVideo ? $(this).find('source').attr('src') : $(this).attr('src');
			if (!src && isVideo) {
				src = $(this).attr('src');
			}
			if (src) {
				currentSlides.push({
					src: src,
					type: isVideo ? 'video' : 'image'
				});
			}
		});

		if (currentSlides.length > 0) {
			currentSlideIndex = 0;
			displaySlide(0);
			$lightbox.addClass('active');
		}
	});

	// Display slide in lightbox
	function displaySlide(index) {
		if (index < 0) {
			currentSlideIndex = currentSlides.length - 1;
		} else if (index >= currentSlides.length) {
			currentSlideIndex = 0;
		} else {
			currentSlideIndex = index;
		}

		var slide = currentSlides[currentSlideIndex];

		// Clear both
		$lightboxImg.hide();
		$lightboxVideo.hide();

		if (slide.type === 'video') {
			var videoElement = $lightboxVideo[0];
			videoElement.pause();
			videoElement.currentTime = 0;
			$lightboxSource.attr('src', slide.src);
			videoElement.src = slide.src;
			videoElement.muted = true;
			videoElement.playsInline = true;
			videoElement.load();
			videoElement.play().catch(function(err) {
				console.log('Video play error:', err);
			});
			$lightboxVideo.show();
		} else {
			$lightboxImg.attr('src', slide.src);
			$lightboxImg.show();
		}
	}

	// Navigation arrows
	$('.lightbox-prev').on('click', function() {
		displaySlide(currentSlideIndex - 1);
	});

	$('.lightbox-next').on('click', function() {
		displaySlide(currentSlideIndex + 1);
	});

	// Close lightbox
	function closeLightbox() {
		$lightbox.removeClass('active');
		$lightboxImg.attr('src', '');
		var videoElement = $lightboxVideo[0];
		if (videoElement) {
			videoElement.pause();
			videoElement.removeAttribute('src');
			videoElement.load();
		}
		$lightboxSource.attr('src', '');
		currentSlides = [];
	}

	$('.lightbox-close').on('click', function() {
			closeLightbox();
		});

		// Close on overlay click
		$('.lightbox-overlay').on('click', function() {
			closeLightbox();
		});

		// Close on Escape key
		$(document).on('keydown', function(e) {
			if (e.key === 'Escape' && $lightbox.hasClass('active')) {
				closeLightbox();
			}
		});

})(jQuery);