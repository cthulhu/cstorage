package {
  import flash.display.*;
  import flash.text.TextField;
  import flash.events.Event;
  import flash.external.*;
  import flash.system.Security;
  import flash.net.SharedObject;
  import flash.net.SharedObjectFlushStatus;  
  
  public class FlashCookies extends Sprite {
    private var output       :TextField = new TextField();
    private var current_date :Date      = new Date();
    private static const millisecondsPerMinute:int = 1000 * 60; 

    // Construction
    public function FlashCookies() {
      Security.allowDomain("*");
      Security.allowInsecureDomain("*");
      
      ExternalInterface.marshallExceptions = true;
      addChild( output );
      try {
        if( ExternalInterface.available ) {
          ExternalInterface.addCallback( "IsAvailable", api_is_available );
          ExternalInterface.addCallback( "Get",         api_get );
          ExternalInterface.addCallback( "Put",         api_put );
          ExternalInterface.addCallback( "Delete",      api_delete );
          ExternalInterface.addCallback( "SetLogLevel", api_set_log_level );
          ExternalInterface.addCallback( "LoadPolicy",  api_load_policy );
          ExternalInterface.call("CStorage.onLoad");
        }
      } catch (error:SecurityError) {
          output.appendText("A SecurityError occurred: " + error.message + "\n");
      } catch (error:Error) {
          output.appendText("An Error occurred: " + error.message + "\n");
      }
    }

    private function api_put( key:String, value:String, expire_minutes:uint ):void{
      var storage:SharedObject = SharedObject.getLocal( key ,"/" );
      storage.data.value = value;
      storage.data.expired_at = expire_minutes * millisecondsPerMinute + current_date.valueOf();
      storage.flush();
    }
    
    private function api_get( key:String ):String{
      var storage:SharedObject = SharedObject.getLocal( key ,"/" );
      if( current_date.valueOf() < storage.data.expired_at ) 
      {
        return storage.data.value;
      }
      else
      {
        return "";
      }
    }
    
    private function api_delete( key:String ):void{
      var storage:SharedObject = SharedObject.getLocal( key ,"/" );
      storage.clear();
    }
    
    private function api_is_available():Boolean {
      return true; // need to invent good method
    }
    
	  private function api_set_log_level(lvl:uint):void {
	  }
		
  	private function api_load_policy(url:String):void {
			Security.loadPolicyFile(url);
		}
    
		private function onLogEntry(e:String):void {
			ExternalInterface.call( "CStorage.onLogEntry", e );
  	}
  }
  
}
