Panache
=======

Panache is a Javascript class framework. It provides methods to create classes with
public, private and protected members and full inheritance.

Quick Intro
-----------

Classes are defined as follows::
  
  const SomeClass = new Class({
    
    priv: {
      propertyName: initial_value,
      methodName: function,
      ...
    },
    
    prot: {
      propertyName: initial_value,
      methodName: function,
      ...
    },
    
    pub: {
      propertyName: initial_value,
      methodName: function,
      ...
    },
    
    propertyName: initial_value,
    methodName: function,
    ...
    
    init: function
    
  });
 
  var sc = new SomeClass(...);

Subclasses are defined similarly::
  
  const ChildClass = new SomeClass.subclass({
    ...
  });
  
Where the definition is in the same form as above.

Root-level members are considered public, and will override members of the same name that are
explicitly marked public.

Project Goals
-------------

The goals of this project are:

* To be able to create traditional classes with simple, concise syntax
* Public, private, protected members
* Class-based inheritance

Some things it can't do, which may or may not be worthwhile:

* Mixins
* Interfaces
* Abstract classes
* Event dispatching/handling

