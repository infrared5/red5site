(function() {
  'use strict';

  var Handlebars  = require( 'handlebars' );
  var Templates   = require( './templates.js' );
  var Posts       = require( './posts.js' );
  var Post        = require( './post.js' );

  $( document ).ready( function () {
    var $container = $( '#latest-news .container' ),
        posts = [],
        isPostFormatRegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z-/,
        postSplitterRegEx = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)-(.*)$/;

    for ( var x in Handlebars.templates ) {
      if ( Handlebars.templates.hasOwnProperty ( x ) ) {
        if ( isPostFormatRegEx.test( x ) ) {
          var date = new Date( x.replace( postSplitterRegEx, '$1' ) ),
              name = x.replace( postSplitterRegEx, '$2' )
                      .replace( /\-{3}/g, ' - ' )
                      .replace( /([^\- ])\-([^\- ])/g, '$1 $2' );

          posts.push( new Post( date, name, Handlebars.templates[ x ]( {} ) ) );
        }
      }
    }

    //  Load up default index page
    $container.html( Handlebars.templates.index( {} ) );

    $( 'nav' ).on( 'click', 'a', function onLinkClick (e) {
      var dropdown = $( this ).parents( '.dropdown' ),
          page = e.currentTarget.className.replace( /page\-([A-Za-z\-]+)/i, '$1' );

      $( '.active' ).removeClass( 'active' );

      $( this ).parent().addClass( 'active' );

      if ( dropdown.length > 0 ) {
        dropdown.addClass( 'active' );
      }
      else {
        $( this ).addClass( 'active' );
      }

      if ( Handlebars.templates.hasOwnProperty( page ) ) {
        var data = {};

        if ( page === 'news' ) {
          data = {
            posts: posts
          };
        }

        $container.html( Handlebars.templates[ page ]( data ) );
      }
      else {
        $container.html( Handlebars.templates[ '404' ]( {} ) );
      }

      e.preventDefault();
      return false;
    } );
  } );
})();