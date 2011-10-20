<html>
    <head>
        <title>jqcp</title>
		<!-- jQuery/jQueryUI (hosted) -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.js"></script>
		<script src="http://jqueryui.com/themeroller/themeswitchertool/"></script>
		<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/ui-lightness/jquery-ui.css" rel="stylesheet" type="text/css"/>
		<!--link href="aristo/Aristo.css" rel="stylesheet" type="text/css"/-->
        <style>
			body {
				font-family:	'Segoe UI', Verdana, Arial, Helvetica, sans-serif;
				font-size:		62.5%;
			}		
			
			#switcher {
				float: 			right;
				display: 		inline-block;
			}	
        </style>
		<script src="jquery.colorpicker-1.0.js"></script>        
		<link href="jquery.colorpicker-1.0.css" rel="stylesheet" type="text/css"/>        
        <script>
           	$( function() {			
				// For the documentation
				$('#switcher').themeswitcher();
                
                $('#cp').colorpicker({
					onClose: function(hex, rgba, inst) {
								
							},
					onSelect: function(hex, rgba, inst) {
								console.log(hex);
								console.log(rgba);
								console.log(inst);
							}
				});
				
                //$('#cp2').colorpicker({alpha: true});
            });
        </script>
    </head>
    <body>
        <div id="switcher"></div>
        Here it is: <span id="cp">KLIK!</span>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
		<br/>
        Here is more: <span id="cp2">KLIK!</span>	
    </body>
</html>