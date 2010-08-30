#cstorage

##In development

##Getting Started

Include "cstorage.js" in your document, along with embedding the swf.  I use "swfobject.js":

	<script src="path/to/swfobject.js" type="text/javascript"></script>
	<script src="path/to/cstorage.js" type="text/javascript"></script>

  <div id="FlashCookies"></div>
  <script type="text/javascript">
	// this is a recommended way of embedding the swf file
	// although, you can use any method you like and the swf
	// when loaded will allow the above code to run in order.
	swfobject.embedSWF(
		"../swfs/amqp.swf",
		"FlashCookies",
		"1", "1", "9",
		"../swfs/expressInstall.swf",
		{},
		{
			allowScriptAccess: "always",
			wmode	: "opaque",
			bgcolor	: "#ff0000"
		},
		{},
		function() {
			console.log("Loaded");
		}		
	);
  </script>

Full examples can be found in the test diretory
