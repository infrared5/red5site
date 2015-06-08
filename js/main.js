(function() {
  'use strict';

  var Handlebars  = require( 'handlebars' );
  var Templates   = require( './templates.js' );
  var Posts       = require( './posts.js' );
  var Post        = require( './post.js' );
  var page        = require( 'page' );
  var tmpls       = Handlebars.templates;
  var posts       = [];
  var $container  = null;

  function accumulatePosts () {
    var isPostFormatRegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z-/,
        postSplitterRegEx = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)-(.*)$/;

    for ( var tmpl in tmpls ) {
      if ( tmpls.hasOwnProperty ( tmpl ) ) {
        if ( isPostFormatRegEx.test( tmpl ) ) {
          var date = new Date( tmpl.replace( postSplitterRegEx, '$1' ) ),
              name = tmpl.replace( postSplitterRegEx, '$2' )
                      .replace( /\-{3}/g, ' - ' )
                      .replace( /([^\- ])\-([^\- ])/g, '$1 $2' );

          posts.push( new Post( date, name, tmpls[ tmpl ]( {} ) ) );
        }
      }
    }
  }

  function setPage ( ctx, next ) {
    var page = ctx.path.substring(1);

    //  Ensure / matches index
    if ( page.length === 0 ) {
      page = 'index';
    }

    ctx.page = page;

    if ( !tmpls.hasOwnProperty( page ) ) {
      ctx.path = '/404';
      ctx.page = '404';
    }

    //  Continue down callback chain
    if ( !!next ) {
      next();
    }
  }

  function setActiveLinkBasedOnPath ( ctx, next ) {
    var path = ctx.path !== '/404' ? ctx.path : '/',
        $active = $( '.active' ),
        $target = $( 'nav a[href="' + ctx.path + '"]' ),
        dropdowns = $target.parents( '.dropdown' );

    $active.removeClass( 'active' );
    
    if ( dropdowns.length > 0 ) {
      dropdowns.addClass( 'active' );
    }
    else {
      $target.addClass( 'active' );
    }

    $target.parent().addClass( 'active' );
    
    //  Continue down callback chain
    if ( !!next ) {
      next();
    }
  }

  function showPage ( ctx, next ) {
    if ( tmpls.hasOwnProperty( ctx.page ) ) {
      if ( !!$container ) {
        $container.html( tmpls[ ctx.page ]( {} ) );
      }
    }

    //  Stops the chain of callbacks
  }

  $( document ).ready( function () {
    $container = $( '#latest-news .container' );

    accumulatePosts();

    //  Setup routing
    page( '*', setPage, setActiveLinkBasedOnPath, showPage );

    page( {
      hashbang: true
    } );
  } );
})();