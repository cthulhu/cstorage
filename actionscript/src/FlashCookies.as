package {
  import flash.display.*;
  import flash.text.TextField;
  import flash.events.Event;
  import flash.external.*;
  import flash.system.Security;
  
  public class FlashCookies extends MovieClip {
    private var output:TextField;

    // Construction
    public function FlashCookies() {
      Security.allowDomain("*");
      Security.allowInsecureDomain("*");
      
      ExternalInterface.marshallExceptions = true;
      
      // creating a new shape instance
      var circle:Shape = new Shape( ); 
      // starting color filling
      circle.graphics.beginFill( 0xff9933 , 1 );
      // drawing circle 
      circle.graphics.drawCircle( 0 , 0 , 100 );
      // repositioning shape
      circle.x = 100;                                 
      circle.y = 100;
      
      // adding displayobject to the display list
      addChild( circle );
      
      output = new TextField();
      output.y = 25;
      output.width = 450;
      output.height = 325;
      output.multiline = true;
      output.wordWrap = true;
      output.border = true;
      output.text = "Initializing...\n";
      addChild(output);

      try {
        if( ExternalInterface.available ) {
          ExternalInterface.addCallback( "IsAvailable", IsAvailable );
          ExternalInterface.addCallback( "Get", Get );
          ExternalInterface.addCallback( "Put", Put );
          ExternalInterface.addCallback( "Delete", Delete );
          ExternalInterface.call("CStorage.onLoad");
        }
      } catch (error:SecurityError) {
          output.appendText("A SecurityError occurred: " + error.message + "\n");
      } catch (error:Error) {
          output.appendText("An Error occurred: " + error.message + "\n");
      }
      var helloDisplay:TextField = new TextField();
      helloDisplay.text = "Hello World";
      addChild(helloDisplay);
    }

    private function Put( key:String, value:String ):void{
      // Implement me
    }
    
    private function Get( key:String ):String{
      return "The data"; // Implement me
    }
    
    private function Delete( key:String ):void{
      // Implement me
    }
    
    private function IsAvailable():Boolean {
      return true; // need to invent good method
    }
    
    private function onLogEntry(e:String):void {
       ExternalInterface.call("alert", e );
    }        
  }
  
}
