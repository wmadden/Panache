/**
 * Creates a class, given a class definition.
 */
const Class = function() {
  
  // Pseudo-keywords used in the definition
  const PUBLIC      = "public";
  const PROTECTED   = "protected";
  const PRIVATE     = "private";
  const CONSTRUCTOR = "init";
  const EVENTS      = "events";
  const SUBCLASS    = "subclass";
  const MIXIN       = "mixin";
  const KEYWORDS    = [ PUBLIC, PROTECTED, PRIVATE, CONSTRUCTOR, EVENTS, SUBCLASS, MIXIN ];
  
  /**
   * Creates a class from a definition.
   */
  function createClass( def )
  {
    return createSubClass( def );
  }
  
  /**
   * Creates a child class from a parent.
   */
  function createSubClass( def, protectedContext, publicContext )
  {
    // If given parent contexts, create contexts for the subclass that extend the parent's.
    // (Private context will never extend the parent's private context.)
    if( protectedContext )
      protectedContext = Utils.newProto( protectedContext );
    else
      protectedContext = {};
    
    if( publicContext )
      publicContext = Utils.newProto( publicContext );
    else
      publicContext = {};
    
    // Create objects for the different context levels of the class
    var publicContext     = createContext( PUBLIC, def, publicContext );
    var protectedContext  = createContext( PROTECTED, def, protectedContext );
    var privateContext    = createContext( PRIVATE, def, Utils.newProto(protectedContext) );
    
    // Interpret root-level properties and methods as public
    for( var property in def )
    {
      if( KEYWORDS.indexOf(property) != -1 )
        continue;
      
      publicContext[property] = def[property];
    }
    
    // Return a function which, when invoked on a blank object, will turn that object into an
    // instance of the class described by 'def'.
    var result = function()
    {
      // 'this' will hold a copy of publicContext, if we were invoked with the new operator
      if( !(this instanceof result) )
        throw( "'this' is not derived from the class prototype, did you forget the new keyword?" );
      
      // Create a private instance context
      var privateInstanceContext = Utils.clone( privateContext, this );
      
      applyMethodContext( this, privateInstanceContext );
      
      // Call its constructor, if any
      if( def[CONSTRUCTOR] && typeof(def[CONSTRUCTOR]) == "function" )
        def[CONSTRUCTOR].apply( privateInstanceContext, arguments );
    };
    
    // Add the subclass method to the class constructor
    result[SUBCLASS] = function( subclassDef )
    {
      return createSubClass( subclassDef, protectedContext, publicContext );
    };
    
    // Add the mixin method to the class constructor
    result[MIXIN] = function( mixinDef )
    {
      return mixin( mixinDef, privateContext, protectedContext, publicContext );
    }
    
    result.prototype = publicContext;
    return result;
  }
  
  function mixin( def, privateContext, protectedContext, publicContext )
  {
    // TODO
  }
  
  /**
   * Creates a context object of the given level (PRIVATE, PROTECTED or PUBLIC) from 'def'. If
   * provided, it will use the object in 'result' instead of creating a new one.
   */
  function createContext( level, def, result )
  {
    if( !result )
      result = {};
    
    if( def[level] && typeof(def[level]) == "object" )
    {
      Utils.copyProperties( def[level], result );
    }
    
    return result;
  }
  
  /**
   * Applies the given internal context to all methods on the given external context (i.e. ensures
   * that their 'this' variable will be set to 'internalContext'.
   */
  function applyMethodContext( externalContext, internalContext )
  {
    for( var prop in externalContext )
    {
      if( typeof(externalContext[prop]) == "function" )
      {
        externalContext[prop] = executeInContext( internalContext, externalContext[prop] );
      }
    }
  }
  
  /**
   * Returns a new function that will execute the given method in the given context.
   */
  function executeInContext( context, method )
  {
    return function() {
      return method.apply( context, arguments );
    };
  }
  
  return createClass;
}();
