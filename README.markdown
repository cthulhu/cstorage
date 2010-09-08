#cstorage

  A small javascript+flash mixed toolset for storing client side information. 
  It uses brawser cookies and flash's SharedObject. 
  Can be useful if you need to store client iformation even if cookies are disabled.

##In development
  
  * html5's storage
  * silverlight's storage

##Getting Started

  The main files are cstorage.js, swfobject.js and FlashCookies.swf.
  The best approach to use the cstorage is:

  Include in head section:

	<script src="path/to/swfobject.js" type="text/javascript"></script>
	<script src="path/to/cstorage.js" type="text/javascript"></script>

  On the page do:

  <script type="text/javascript">
    CStorage.configure({});
    CStorage.Put( "key", "Value", 1 ); // writes the value by key
    CStorage.Get( "key" ); // reads the value by key
    CStorage.Delete( "key" ); // removes the value by key
  </script>

More examples can be found in the examples directory.

Copyright (c) 2010 Stanislav O. Pogrebnyak, released under the MIT license

