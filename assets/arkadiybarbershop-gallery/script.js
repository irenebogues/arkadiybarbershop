(function ($) {
    
    var isBuilder = $('html').hasClass('is-builder');
    if (!isBuilder) {

        var tag = document.createElement('script');
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var players = [];
          }
        
    /* Masonry Grid */
    $(document).on('add.cards change.cards', function (event) {
        var $section = $(event.target),
            allItem = $section.find('.izb-gallery-filter-all');
        if (!$section.hasClass('izb-slider-carousel')) return;
        var filterList = [];

        $section.find('.izb-gallery-item').each(function (el) {
            var tagsAttr = ($(this).attr('data-tags') || "").trim();
            var tagsList = tagsAttr.split(',');
            tagsList.map(function (el) {
                var tag = el.trim();

                if ($.inArray(tag, filterList) == -1)
                    filterList.push(tag);
            })
        })
        if ($section.find('.izb-gallery-filter').length > 0 && $(event.target).find('.izb-gallery-filter').hasClass('gallery-filter-active')) {
            var filterHtml = '';
            $section.find('.izb-gallery-filter ul li:not(li:eq(0))').remove();
            filterList.map(function (el) {
                filterHtml += '<li>' + el + '</li>'
            });
            $section.find('.izb-gallery-filter ul').append(allItem).append(filterHtml);
            $section.on('click', '.izb-gallery-filter li', function (e) {
                $li = $(this);
                $li.parent().find('li').removeClass('active')
                $li.addClass('active');

                var $mas = $li.closest('section').find('.izb-gallery-row');
                var filter = $li.html().trim();

                $section.find('.izb-gallery-item').each(function (i, el) {
                    var $elem = $(this);
                    var tagsAttr = $elem.attr('data-tags');
                    var tags = tagsAttr.split(',');
                    tagsTrimmed = tags.map(function (el) {
                        return el.trim();
                    })
                    if ($.inArray(filter, tagsTrimmed) == -1 && !$li.hasClass('izb-gallery-filter-all')) {
                        $elem.addClass('izb-gallery-item__hided');
                        setTimeout(function () {
                            $elem.css('left', '300px');
                        }, 200);
                    } else {
                        $elem.removeClass('izb-gallery-item__hided')
                    };

                })
                setTimeout(function () {
                    $mas.closest('.izb-gallery-row').trigger('filter');
                }, 50);
            })
        } else {
            $section.find('.izb-gallery-item__hided').removeClass('izb-gallery-item__hided');
            $section.find('.izb-gallery-row').trigger('filter');
        }
        if (!isBuilder) {

            $section.find('.slide').each(function (i) {
                var index = $(this).closest('.izb-gallery-item').index();

               // setImgSrc($(this));
            });
        }

        if (typeof $.fn.masonry !== 'undefined') {
            $section.outerFind('.izb-gallery').each(function () {
                var $msnr = $(this).find('.izb-gallery-row').masonry({
                    itemSelector: '.izb-gallery-item:not(.izb-gallery-item__hided)',
                    percentPosition: true
                });
                // reload masonry (need for adding new or resort items)
                $msnr.masonry('reloadItems');
                $msnr.on('filter', function () {
                    $msnr.masonry('reloadItems');
                    $msnr.masonry('layout');
                    // update parallax backgrounds
                    $(window).trigger('update.parallax')
                }.bind(this, $msnr))
                // layout Masonry after each image loads
                $msnr.imagesLoaded().progress(function () {
                    $msnr.masonry('layout');
                });
            });
        }
    });
    $('.izb-gallery-item').on('click', 'a', function (e) {
        e.stopPropagation();
    })
    var timeout;
    var timeout2;

    function fitLBtimeout() {
        clearTimeout(timeout);
        timeout = setTimeout(fitLightbox, 50);
    }

    /* Lightbox Fit */
    function fitLightbox() {
        var $lightbox = $('.izb-gallery .modal');
        if (!$lightbox.length) {
            return;
        }

        var windowPadding = 0;
        var bottomPadding = 10;
        var wndW = $(window).width() - windowPadding * 2;
        var wndH = $(window).height() - windowPadding * 2;
        $lightbox.each(function () {
            var setWidth, setTop;
            var isShown = $(this).hasClass('in');
            var $modalDialog = $(this).find('.modal-dialog');
            var $currentImg = $modalDialog.find('.carousel-item.active > img');

            if ($modalDialog.find('.carousel-item.prev > img, .carousel-item.next > img').length) {
                $currentImg = $modalDialog.find('.carousel-item.prev > img, .carousel-item.next > img').eq(0);
            }

            var lbW = $currentImg[0].naturalWidth;
            var lbH = $currentImg[0].naturalHeight;

            // height change
            if (wndW / wndH > lbW / lbH) {
                var needH = wndH - bottomPadding * 2;
                setWidth = needH * lbW / lbH;
            }

            // width change
            else {
                setWidth = wndW - bottomPadding * 2;
            }
            // check for maw width
            setWidth = setWidth >= lbW ? lbW : setWidth;

            // set top to vertical center
            setTop = (wndH - setWidth * lbH / lbW) / 2;

            $modalDialog.css({
                width: parseInt(setWidth),
                top: setTop + windowPadding
            });
        });
    }

    /* Starts slide on different events and fit lightbox */
    var $window = $(document).find('.izb-gallery');
    $window.on('show.bs.modal', function (e) {
   
    })
    
    $(window).on('resize load', fitLBtimeout);
    $window.on('slid.bs.carousel', function (e) {
        var slide = $(e.target).find('.carousel-item.active');
        if (slide.length > 0) {
            players.playslide?players.playslide():players.play();
        }
        fitLBtimeout();
    });
    $window.on('hide.bs.modal', function (e) {
        players.map(function (players, i) {
            players.pauseslide?players.pauseslide():players.pause();
        });
    });
} (jQuery));
