(function() {
  'use strict';

  var Handlebars  = require( 'handlebars' );
  var Templates   = require( './templates.js' );

  $( document ).ready( function() {
    $( 'nav' ).on( 'click', 'a', function onLinkClick(e) {
      var dropdown = $( this ).parents( '.dropdown' );

      $( '.active' ).removeClass( 'active' );

      $( this ).parent().addClass( 'active' );

      if ( dropdown.length > 0 ) {
        dropdown.addClass( 'active' );
      } else {
        $( this ).addClass( 'active' );
      }

      //  Load up template page
      //  Inject into page

      e.preventDefault();
      return false;
    } );
  } );
})();