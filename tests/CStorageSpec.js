describe("CStorage functionality - ", function() {
  beforeEach(function(){
  })
  describe("On read/write", function(){
    var vRandom = {}
    beforeEach(function(){
      vRandom["js"] = Math.random()
      vRandom["flash"] = Math.random()
      
    })
    it("should store and read values to from different cstorages", function(){
      CStorage.configure({ onload: function(){
        CStorage.Put( "test_value", vRandom, 1000 );
        console.info( JSON.stringify( vRandom, null, '\t' )  );
        vRandomExpected = CStorage.Get( "test_value" )
        expect( vRandomExpected["js"] ).toBe( vRandom["js"] )
        expect( vRandomExpected["flash"] ).toBe( vRandom["flash"] )
        console.info( JSON.stringify( vRandomExpected, null, '\t' )  );
      }})
    })
  })
})
