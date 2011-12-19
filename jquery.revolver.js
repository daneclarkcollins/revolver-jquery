/**
 * jQuery Revolver Plugin 1.0
 *
 * http://johnnyfreeman.github.com/revolver/
 * Copyright 2011, Johnny Freeman
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
 
;(function ($) {
    
    // plugin
    $.fn.revolver = function(options)
    {
        return this.each(function()
        {
            // store the revolver object using jquery's data method
            if (!$.data(this, 'revolver'))
            {
                $.data(this, 'revolver', new revolver(this, options));
            }
        });
    };

    // setup constructor
    var revolver = function(container, options)
    {
        return this.init(container, options);
    }

    // default settings
    revolver.prototype.options = {
        rotationSpeed:      4000,       // how long (in milliseconds) to stay on each slide before going to the next
        transitionSpeed:    1500,       // how long (in milliseconds) the transition should last
        autoPlay:           true,       // whether or not to automatically begin playing the slides
        slideClass:         'slide'     // this is what revolver will look for to determin what is a slide 
    };

    // revolver state
    revolver.prototype.previousSlide    = null;    // key for previous slide
    revolver.prototype.currentSlide     = null;    // key for current slide
    revolver.prototype.numSlides        = 0;       // total number of slides
    revolver.prototype.lastSlide        = null;    // key for last slide

    // dom elements
    revolver.prototype.container    = null;    // the wrapper element for all images
    revolver.prototype.slideClass   = null;    // array of slides

    // misc
    revolver.prototype.status       = null;    // will either be equal to "stopped" or "playing"
    revolver.prototype.intervalId   = null;    // id set by setInterval(), used for pause() method

    // constructor
    revolver.prototype.init = function(container, options)
    {
        // merge options with defaults
        $.extend(this.options, options);
        
        // setup revolver
        this.container      = $(container);
        this.slides         = this.container.find('.' + this.options.slideClass);
        this.numSlides      = this.slides.length;
        this.previousSlide  = 0;
        this.currentSlide   = this.numSlides > 1 ? 1 : 0;
        this.lastSlide      = this.numSlides == 0 ? null : this.numSlides - 1;

        // Don't run if there's only one slide
        if (this.numSlides <= 1) {
            return;
        };

        // apply basic styling to container and images
        this.container.css({
            'position': 'relative'
        });

        this.slides.css({
            'top': 0,
            'left': 0,
            'position': 'absolute'
        });

        // hide all slides except the first
        this.slides.not(':first').hide();

        // begin auto play, if enabled
        if (this.options.autoPlay)
        {
            this.play();
        }
        else
        {
            this.status = 'stopped';
        }

        return this;
    }

    revolver.prototype.transition = function()
    {
        // fadeout previous, fadein current
        this.slides.eq(this.previousSlide).fadeOut(this.options.transitionSpeed);
        this.slides.eq(this.currentSlide).fadeIn(this.options.transitionSpeed);

        // update vars
        this.previousSlide  = this.currentSlide;
        this.currentSlide   = this.currentSlide == this.lastSlide ? 0 : this.currentSlide+1;
    };

    revolver.prototype.play = function()
    {
        // transition immediately only if revolver has been stopped or paused
        if (this.status == 'stopped')
        {
            this.transition();
        };
        
        this.status     = 'playing';
        this.intervalId = setInterval(this.transition.bind(this), parseFloat(this.options.rotationSpeed));

        return this;
    };

    revolver.prototype.pause = function()
    {
        this.status = 'stopped';
        clearInterval(this.intervalId);
        return this;
    };

    revolver.prototype.stop = function()
    {
        this.pause();

        // reset only if not already on the first slide
        if (this.previousSlide != 0)
        {
            this.reset();
        }

        return this;
    };

    revolver.prototype.reset = function()
    {
        this.currentSlide = 0;
        return this;
    };

    revolver.prototype.restart = function()
    {
        // restart only if not already on the first slide
        if (this.previousSlide != 0)
        {
            this.stop().play();
        }
        
        return this;
    };

    revolver.prototype.next = function()
    {
        if (this.status == "stopped")
        {
            this.transition();
        }
        else
        {
            this.pause().play();
        }

        return this;
    };

    revolver.prototype.previous = function()
    {
        this.currentSlide = this.previousSlide == 0 ? this.lastSlide : this.previousSlide - 1;
        this.next();

        return this;
    };

})(jQuery);