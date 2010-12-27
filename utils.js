/**
 * Defines some utility functions.
 */

const Utils = (function(){
  
  function emptyFunction() {};
  
  /**
   * Copies all properties on the source object onto the target object.
   */
  function copyProperties( src, target )
  {
    for( var prop in src )
    {
      target[prop] = src[prop];
    }
  }
  
  /**
   * Creates and returns a copy of the given object.
   */
  function clone( obj, proto ) {
    var result = newProto(proto);
    
    copyProperties( obj, result );
    
    return result;
  }
  
  /**
   * Returns a new object with the internal [[prototype]] property of the object set to 'proto'.
   */
  function newProto( proto ) {
    emptyFunction.prototype = proto;
    return new emptyFunction();
  }
  
  return {
    copyProperties: copyProperties,
    clone: clone,
    newProto: newProto
  };
  
})();
