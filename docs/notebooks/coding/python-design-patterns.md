---
title: Python design patterns
description: none
date: 2019-01-01
thumbnail: /assets/images/resources/data-mesh-portrait.png
---

# Python design patterns

<div class='image-caption image-centered image-width-24' markdown>

- ![Margaret Hamilton in 1969](https://carlosgrande.me/wp-content/uploads/2021/12/MargaretHamilton.jpg)
- Margaret Hamilton in 1969
{ .caption }

</div>

I wanted to share a post with some notes from the **Jungwoo Ryoo** Python Design Patterns course. Dr. Jungwoo Ryoo educates people in the field of Software Security/cybersecurity, Computer networking, Data Science and others.

---

## 1. Creational Design Patterns

Creational patterns provides essential information regarding the Class instantiation or the object instantiation. Class Creational Pattern and the Object Creational pattern is the major categorization of the Creational Design Patterns. While class-creation patterns use inheritance effectively in the instantiation process, object-creation patterns use delegation effectively to get the job done.


### Factory class Method

![Factory pattern](https://carlosgrande.me/wp-content/uploads/2021/12/FactoryPattern.jpg)

> To create an object with a instanciated factory on the run with out knowing how, why or what parameters are you going to pass

Allows an interface or a class to create an object, but lets subclasses decide which class or object to instantiate. Using the Factory method, we have the best ways to create an object. Here, objects are created without exposing the logic to the client, and for creating the new type of object, the client uses the same common interface.

```python
class SocketH:
    """Class example object connection HTTP"""
    def __init__(self, name):
        self.name = name
        
    def action(self):
        return f"Connection: {self.name}"
    
class SocketF:
    """Class example object connection FTP"""
    def __init__(self, name):
        self.name = name
        
    def action(self):
        return f"Connection: {self.name}"

    
def get_connection(connection="http"):
    """The factory method"""
    connections = {'http': SocketH("http_connection"),
                   'ftp': SocketF('ftp_connection')}
    
    return connections[connection]


# Running factory function
http = get_connection('http')
print(f"object -> {http.action()}")

ftp = get_connection('FTP')
print(f"Object -> {ftp.action()}")
```

```python title="Output"
object -> Connection: http_connection
Object -> Connection: ftp_connection
```


### Abstract Factory Method

![Abstract Factory Pattern](https://carlosgrande.me/wp-content/uploads/2021/12/AbstractFactoryPattern.jpg)

Allows you to produce the families of related objects without specifying their concrete classes. Using the abstract factory method, we have the easiest ways to produce a similar type of many objects.

It provides a way to encapsulate a group of individual factories. When the user expectation yields multiple, related objects at a given time but don't need to know which family it is until runtime.

```python
class SocketH:
    """One of the objects to be returned"""
    
    def action(self):
        return f"Connection: http"
    
    def __str__(self):
        return "Socket_h"
    
    
class SocketHFactory:
    """Concrete factory"""
    
    def get_connection(self):
        """Returns a Connection object"""
        return SocketH()
        
    def get_request(self):
        """Returns a Get Request object"""
        return "get request"
    
class Connections:
    """Connections class houses our abstract factory"""
    
    def __init__(self, connection_factory = None):
        """Connections class is our abstract factory"""
        
        self._connection_factory = connection_factory

        
    def show_connection(self):
        """Utility method to display details of the objects returned
        by the Connection factory"""
        
        connection = self._connection_factory.get_connection()
        request = self._connection_factory.get_request()
        
        print(f"Connection: {connection}")
        print(f"Action {connection.action()}")
        print(f"Request: {request}")
    
# Create a Concrete Factory
factory_a = SocketHFactory()
factory_b = SocketHFactory()

# Create a connections, our Abstract Factory
connect = Connections(factory_a)

# Invoke the utility method to show the details
connect.show_connection()
```

```python title="Output"
Connection: Socket_h
Action Connection: http
Request: get request
```

### Singleton Method
[caption id="attachment_2062" align="aligncenter" width="267"]<a href="https://carlosgrande.me/wp-content/uploads/2021/12/SingletonPattern.jpg"><img src="https://carlosgrande.me/wp-content/uploads/2021/12/SingletonPattern.jpg" alt="Singleton Pattern" width="267" height="420" class="size-full wp-image-2062" /></a> Singleton Pattern[/caption]

Allows to keep information in a single object there is no need to extract the information every time. When you want to allow only one object to be instantiated from a class.

Singleton Design Pattern can be understood by a very simple example of Database connectivity. When each object creates a unique Database Connection to the Database, it will highly affect the cost and expenses of the project. So, it is always better to make a single connection rather than making extra irrelevant connections which can be easily done by Singleton Design Pattern.

````python
class Borg:
    """Borg class attributes global"""
    _shared_state = {} # Attribute dictionary
    
    def __init__(self):
        self.__dict__ = self._shared_state
    
class Singleton(Borg): # Inherits from the Borg class
    """This class now shares all its attributes among its various instances"""
    # This essentially makes the singleton objects an object-oriented
    def __init__(self, **kwargs):
        # Update the attribute dictionary by insrting a new key-value pair
        self._shared_state.update(kwargs)        
    
    def __str__(self):
        return str(self._shared_state)

# Create a singleton object and add our fiest acronym
singleton = Singleton(HTTP = "Hyper Text Transfer Protocol")

# Print the updated object
print(f"First print: {singleton}")

# Create another singleton object by adding another acronym
singleton = Singleton(SNMP = "Simple Network Management Protocol")

# Print the updated object
print(f"Second print: {singleton}")
```

```bash title="Output"
First print: {'HTTP': 'Hyper Text Transfer Protocol'}
Second print: {'HTTP': 'Hyper Text Transfer Protocol', 'SNMP': 'Simple Network Management Protocol'}
```


### Builder Method
[caption id="attachment_2067" align="aligncenter" width="571"]<a href="https://carlosgrande.me/wp-content/uploads/2021/12/BuilderPattern.jpg"><img src="https://carlosgrande.me/wp-content/uploads/2021/12/BuilderPattern.jpg" alt="Builder Pattern" width="571" height="174" class="size-full wp-image-2067" /></a> Builder Pattern[/caption]

Builder Method is a Creation Design Pattern which aims to “Separate the construction of a complex object from its representation so that the same construction process can create different representations.” It allows you to construct complex objects step by step. Here using the same construction code, we can produce different types and representations of the object easily.

To avoid telescoping constructor anti-pattern.
- Director: builds the project
- Abstract Builder: interfaces
- Concrete Builder: implements the interfaces
- Product: object being build

```python
class Director:
    """Director class"""
    def __init__(self, builder):
        self._builder = builder
        
    def construct_obj(self):
        self._builder.create_new_obj()
        self._builder.add_user()
        self._builder.add_connection()
        self._builder.add_name()
    
    def get_obj(self):
        return self._builder.obj
    
class Builder:
    """Abstract Builder"""
    def __init__(self):
        self.obj = None
        
    def create_new_obj(self):
        self.obj = Obj()
        
class ConcreteBuilder(Builder):
    """Concrete Builder --> Provides parts and tools to work on the parts"""
    
    def add_user(self):
        self.obj.user = "skwh"
        
    def add_connection(self):
        self.obj.connection = "HTTP"
        
    def add_name(self):
        self.obj.name = "Skyler White"
        
class Obj:
    """Product"""
    def __init__(self):
        self.user = None
        self.connection = None
        self.name = None
        
    def __str__(self):
        return f"{self.user} | {self.connection} | {self.name}"
        
builder = ConcreteBuilder()
director = Director(builder)
director.construct_obj()
obj = director.get_obj()

print(obj)
````

```bash title="Output"
skwh | HTTP | Skyler White
```


### Prototype Method
[caption id="attachment_2069" align="aligncenter" width="429"]<a href="https://carlosgrande.me/wp-content/uploads/2021/12/PrototypePattern.jpg"><img src="https://carlosgrande.me/wp-content/uploads/2021/12/PrototypePattern.jpg" alt="Prototype Pattern" width="429" height="302" class="size-full wp-image-2069" /></a> Prototype Pattern[/caption]

Prototype Method is a Creational Design Pattern which aims to reduce the number of classes used for an application. It allows you to copy existing objects independent of the concrete implementation of their classes. Generally, here the object is created by copying a prototypical instance during run-time.

It is highly recommended to use Prototype Method when the object creation is an expensive task in terms of time and usage of resources and already there exists a similar object. This method provides a way to copy the original object and then modify it according to our needs.

```python
import copy

class Prototype:
    
    def __init__(self):
        self._objects = {}
        
    def register_object(self, name, obj):
        """Register an object"""
        self._objects[name] = obj
        
    def unregister_object(self, name):
        """Unregister an object"""
        del self._objects[name]
        
    def clone(self, name, **attr):
        """Clone a registered object"""
        obj = copy.deepcopy(self._objects[name])
        obj.__dict__.update(attr)
        return obj
    
class Api:
    def __init__(self):
        self.name = "api_name"
        self.ip = "192.168.23.85"
        self.option = True
        
    def __str__(self):
        return f"api -> {self.name} | {self.ip} | {self.option}"
    
api = Api()
prototype = Prototype()
prototype.register_object("api_name", api)

api_cloned = prototype.clone("api_name", ip = "232.0.0.1")
print(api_cloned)
```

```bash title="Output"
api -> api_name | 232.0.0.1 | True
```

## 2. Structural Design Patterns
Structural design patterns are about organizing different classes and objects to form larger structures and provide new functionality while keeping these structures flexible and efficient. Mostly they use Inheritance to compose all the interfaces. It also identifies the relationships which led to the simplification of the structure.

### Decorator Method
Decorator Method is a Structural Design Pattern which allows you to dynamically attach new behaviors to objects without changing their implementation by placing these objects inside the wrapper objects that contains the behaviors.

It is much easier to implement Decorator Method in Python because of its built-in feature. It is not equivalent to the Inheritance because the new feature is added only to that particular object, not to the entire subclass.

```python
from functools import wraps

def make_blink(function):
    """Defines the decorator"""
    
    # This makes the decoratos transparent in terms of its name and docstring
    @wraps(function)
    
    def decorator():
        # Grab the return value of the function being decorated
        ret = function()
        
        # Add new funcionality to the function being decorated
        return f"<blink> {ret} </blink>"
    
    return decorator
    
# Apply the decorator here!
@make_blink
def hello_world():
    """Original function!"""
    return "Hello, World!"
# Check the result of decorating
print(hello_world())

# Check if the function name is still the same name of the function being decorated.
print(hello_world.__name__)

# Check if the docstring is still the same as that of the function being decorated.
print(hello_world.__doc__)
```

```bash title="Output"
&lt;blink&gt; Hello, World! &lt;/blink&gt;
hello_world
Original function!
```

### Proxy Method
The Proxy method is Structural design pattern that allows you to provide the replacement for an another object. Here, we use different classes to represent the functionalities of another class. The most important part is that here we create an object having original object functionality to provide to the outer world.

The meaning of word Proxy is “in place of” or “on behalf of” that directly explains the Proxy Method. Proxies are also called surrogates, handles, and wrappers. They are closely related in structure, but not purpose, to Adapters and Decorators.

```python
import time

class Producer:
    """Define the 'resource-intensive' object to instantiate"""
    def produce(self):
        print("Producer is working hard!")
    
    def meet(self):
        print("Producer has time to meet you now!")
        
class Proxy:
    """Define the relatively 'less resource-intensive proxy' to instatiate as a middleman"""
    def __init__(self):
        self.occupied = False
        self.producer = None # Instance of the producer class
        
    def produce(self):
        """Check if Producer is available"""
        print("Artist checking if Producer is available...")
        
        if self.occupied == False:
            # If the Producer is available, create a producer object
            self.producer = Producer()
            time.sleep(2)
            
            # Make the producer meet the guest
            self.producer.meet()
            
        else:
            # Otherwise, don't instantiate a producer
            time.sleep(2)
            print("Producer is busy!")
            
# Instantiate a Proxy
proxy = Proxy()

# Make the Proxy: Artist produce until Producer is available
proxy.produce()

# Change the state to 'Occupied'
proxy.occupied = True

# Make the Producer produce
proxy.produce()
```

```bash title="Output"
Artist checking if Producer is available...
Producer has time to meet you now!
Artist checking if Producer is available...
Producer is busy!
```

### Adapter Method
Adapter method is a Structural Design Pattern which helps us in making the incompatible objects adaptable to each other. The Adapter method is one of the easiest methods to understand because we have a lot of real-life examples that show the analogy with it. The main purpose of this method is to create a bridge between two incompatible interfaces. This method provides a different interface for a class. We can more easily understand the concept by thinking about the Cable Adapter that allows us to charge a phone somewhere that has outlets in different shapes.
Using this idea, we can integrate the classes that couldn’t be integrated due to interface incompatibility.`

```python
class Spanish:
    """Korean speaker"""
    def __init__(self):
        self.name = "Spanish"
        
    def speak_spanish(self):
        return "Hola!"
    
class British:
    """British speaker"""
    def __init__(self):
        self.name = "British"
        
    # Make the difference method name here!
    def speak_english(self):
        return "Hello!"
        
class Adapter:
    """This changes the generic method name to individualized method names"""
    def __init__(self, object, **adapter_method):
        """Change the name of the method"""
        self._object = object
        
        # add a new dictionary item that establishes the mapping between the generic method name: speak() and the concrete method
        # for example, speak() will be translated to speak_korean() if the mapping says so
        self.__dict__.update(adapter_method)
        
    def __getattr__(self, attr):
        """Simply return the rest of the attributes!"""
        return getattr(self._object, attr)
        
        
# List to store speaker objects
objects = []

# Create Spanish object
spanish = Spanish()

# Create British object
british = British()

# Append the objects to the objects list
objects.append(Adapter(spanish, speak = spanish.speak_spanish))
objects.append(Adapter(british, speak=british.speak_english))

for obj in objects:
    print(f"{obj.name} says {obj.speak()}\n")
```

```bash title="Output"
Spanish says Hola!

British says Hello!
```

### Composite Method
Composite Method is a Structural Design Pattern which describes a group of objects that is treated the same way as a single instance of the same type of the objects. The purpose of the Composite Method is to Compose objects into Tree type structures to represent the whole-partial hierarchies.

Composite Method is a Structural Design Pattern which describes a group of objects that is treated the same way as a single instance of the same type of the objects. The purpose of the Composite Method is to Compose objects into Tree type structures to represent the whole-partial hierarchies.

```python
class Component(object):
    """Abstract class"""
    
    def __init__(self, *args, **kwargs):
        pass
    
    def component_function(self):
        pass

class Child(Component): # Inherits from the abstract class Component
    """Concrete class"""
    
    def __init__(self, *args, **kwargs):
        Component.__init__(self, *args, **kwargs)
        
        # This is where we store the name of your child item!
        self.name = args[0]
        
    def component_function(self, tabs):
        """Print the name of your child item here"""
        tab_spaces = "\t"*tabs
        print(f"{tab_spaces}{self.name}")
    
class Composite(Component): # Inherits from the abstract class Component
    """Concrete class and mantains the tree recursive structure"""
    
    def __init__(self, *args, **kwargs):
        Component.__init__(self, *args, **kwargs)
        
        # This is where we store the name of composite object!
        self.name = args[0]
        
        # This is where we keep ur child items
        self.children = []
        
    def append_child(self, child):
        """Method to add a new child item"""
        self.children.append(child)
        
    def remove_child(self, child):
        """Method to remove a new child item"""
        self.children.remove(child)
        
    def component_function(self, tabs = 0):
        
        # Print the name of the composite object
        tab_spaces = "\t"*tabs
        print(f"{tab_spaces}{self.name}")
        tabs += 1
        
        # Iterate through the child objects and invoke theircomponent function printing their names
        for i in self.children:
            i.component_function(tabs = tabs)
        

# Build a composite submenu 1
sub1 = Composite("submenu1")

# Create a new child sub_menu 11
sub11 = Child("sub_menu 11")
# Create a new child sub_menu 12
sub12 = Child("sub_menu 12")

# Add the sub_menu 11 to submenu 1
sub1.append_child(sub11)
# Add the sub_menu 12 to submenu 1
sub1.append_child(sub12)

# Build a top-level composite menu
top = Composite("top_menu")

# Build a submenu 2 that is not a composite
sub2 = Composite("submenu2")
sub2.append_child(sub11)

# Add the composite submenu 1 to the top-level composite menu
top.append_child(sub1)

# Add the plain submenu 2 to the top-level composite menu
top.append_child(sub2)

# Let's test if our composite pattern works!
top.component_function()
```

```bash title="Output"
top_menu
&emsp;submenu1
&emsp;&emsp;sub_menu 11
&emsp;&emsp;sub_menu 12
&emsp;submenu2
&emsp;&emsp;sub_menu 11
```

### Bridge Method
Bridge method is a Structural Design Pattern which allows us to separate the Implementation Specific Abstractions and Implementation Independent Abstractions from each other and can be developed considering as the single entities.
Bridge Method is always considered as one of the best methods to organize the class hierarchy.

Elements of Bridge Design Pattern:
- **Abstraction:** It is the core of the Bridge Design Pattern and it provides the reference to the implementer.
- **Refined Abstraction:** It extends the abstraction to the new level where it takes the finer details one level above and hides the finer element from the implementors.
- **Implementer:** It defines the interface for implementation classes. This interface does not need to correspond directly to the abstraction interface and can be very different.
- **Concrete Implementation:** Through the concrete implementation, it implements the above implementer.

```
class DrawingAPIOne(object):
    """Implementation-specific abstraction: concrete class one"""
    def draw_circle(self, x, y, radius):
        print(f"API 1 drawing a circle at ({x}, {y} with radius {radius}!)")

class DrawingAPITwo(object):
    """Implementation-specific abstraction: concrete class two"""
    def draw_circle(self, x, y, radius):
        print(f"API 2 drawing a circle at ({x}, {y} with radius {radius}!)")

class Circle(object):
    """Implementation-independent abstraction: for example, there could be a rectangle class"""
    def __init__(self, x, y, radius, drawing_api):
        """Initialize the necessary attributes"""
        self._x = x
        self._y = y
        self._radius = radius
        self._drawing_api = drawing_api

    def draw(self):
        """Implementation-specific abstraction taken care of by another class: DrawingAPI"""
        self._drawing_api.draw_circle(self._x, self._y, self._radius)

    def scale(self, percent):
        """Implementation independent"""
        self._radius *= radius


# Build the first circle object using API One
circle1 = Circle(1, 2, 3, DrawingAPIOne())

# Build the 
circle1.draw()

# Build the second circle object using API One
circle2 = Circle(2, 3, 4, DrawingAPITwo())

circle2.draw()
```

```bash title="Output"
API 1 drawing a circle at (1, 2 with radius 3!)
API 2 drawing a circle at (2, 3 with radius 4!)
```


## 3. Behavioral Design Patterns
Behavioral patterns are all about identifying the common communication patterns between objects and realize these patterns. These patterns are concerned with algorithms and the assignment of responsibilities between objects.

### Observer Method
The observer method is a Behavioral design Pattern which allows you to define or create a subscription mechanism to send the notification to the multiple objects about any new event that happens to the object that they are observing. The subject is basically observed by multiple objects. The subject needs to be monitored and whenever there is a change in the subject, the observers are being notified about the change. This pattern defines one to Many dependencies between objects so that one object changes state, all of its dependents are notified and updated automatically.

One-two many relationships between a subject and multiple observers.
Example: Core temperatures monitored by observers.

- Subject: abstract class (Attach Detach Notify)
- Concrete subjects
  
```python
class Subject(object):  # Represents what is being 'observed'
    """This is where references to all the observers
    are being kept. Note that this is a one-to-
    many relationship: there will be one subject
    to be observed by multiple observers."""
    def __init__(self):
        self._observers = []
        
    def attach(self, observer):
        """If the observer is not already in the observers list
        append the observer to the list"""
        if observer not in self._observers:
            self._observers.append(observer)     
        
    def detach(self, modifier=None):
        """Simply remove the observer"""
        try:
            self._observers.remove(observer)
        except ValueError:
            pass

    def notify(self, modifier = None):
        """For all the observers in the list. Don't notify the observer
        who is actually updating the temperature of the core"""
        for observer in self._observers:
            if modifier != observer:
                observer.update(self)
class Core(Subject): # Inherits from the Subject class
    def __init__(self, name = ""):
        Subject.__init__(self)
        self._name = name # Set the name of the core
        self._temp = 0 # Initiaize the temperature of the core
   
    @property # Getter that gets the core temperature
    def temp(self):
        return self._temp
    
    @temp.setter # Setter that sets the core temperature
    def temp(self, temp):
        """Notify the observers whenever somebody changes the core temperature"""
        self._temp = temp
        self.notify()
class TempViewer:
    """A printer for the temperature"""
    def update(self, subject):
        """Alert method that is invoked when the notify()
        method in a concrete subject is invoked"""
        print(f"Temperature Viewer: {subject._name} has temperature {subject._temp}")

# CODE
# Let's create our subjects
c1 = Core("Core 1")
c2 = Core("Core 2")

# Let's create our observers
v1 = TempViewer()
v2 = TempViewer()

# Let's attach our observers to the first core
c1.attach(v1)
c1.attach(v2)

# Let's change the temperature of our first core
c1.temp = 80
c1.temp = 90
```

```bash title="Output"
Temperature Viewer: Core 1 has temperature 80
Temperature Viewer: Core 1 has temperature 80
Temperature Viewer: Core 1 has temperature 90
Temperature Viewer: Core 1 has temperature 90
```

### Visitor Method
Visitor Method is a Behavioral Design Pattern which allows us to separate the algorithm from an object structure on which it operates. It helps us to add new features to an existing class hierarchy dynamically without changing it. All the behavioral patterns proved as the best methods to handle the communication between the objects. Similarly, it is used when we have to perform an operation on a group of similar kinds of objects.

```python
class House(object):
    """The class being visited"""
    def accept(self, visitor):
        """Interface to accept a visitor, triggers the visiting operation!"""
        visitor.visit(self)
        
    def work_on_hvac(self, hvac_specialist):
        """Reference to the hvac specialist object in the house object"""
        print(f"{self} worked on by {hvac_specialist}")
        
    def work_on_electricity(self, electrician):
        """Reference to the electrician object in the house object"""
        print(f"{self} worked on by {electrician}")
        
    def __str__(self):
        """Simply return the class name when the House object is printed"""
        return self.__class__.__name__
    
class Visitor(object):
    """Abstract visitor"""
    def __str__(self):
        """Simply return the class name when the visitor object is printed"""
        return self.__class__.__name__
    
class HvacSpecialist(Visitor):
    """Concrete visitor: electrician
    Inherits from the parent class, Visitor"""
    def visit(self, house):
        house.work_on_hvac(self)
        
class Electrician(Visitor):
    """Concrete visitor: electrician
    Inherits from the parent class, Visitor"""
    def visit(self, house):
        house.work_on_electricity(self)
        

# CODE
# Create an HVAC especialist
hvac_specialist = HvacSpecialist()

# Create an electritian
electrician = Electrician()

# Create a House
house = House()

# Let the house accept the HVAC specialist and work on the house
# by invokation the visit() method
house.accept(hvac_specialist)

# Let the house accept the HVAC specialist and work on the house
# by invokation the visit() method
house.accept(electrician)
```

```bash title="Output"
House worked on by HvacSpecialist
House worked on by Electrician
```


### Iterator Method
Iterator method is a Behavioral Design Pattern that allows us to traverse the elements of the collections without taking the exposure of in-depth details of the elements. It provides a way to access the elements of complex data structure sequentially without repeating them.

According to GangOfFour, Iterator Pattern is used ” to access the elements of an aggregate object sequentially without exposing its underlying implementation”.`

```python
def count_to(count):
    """Our iterator implementation"""
    
    # Our list
    numbers_in_spanish = ['uno', 'dos', 'tres', 'cuatro', 'cinco',
                         'seis', 'siete', 'ocho', 'nueve', 'diez']
    
    # Our build in iterator
    # Creates a tuple such as (1, "uno")
    iterator = zip(range(count), numbers_in_spanish)
    
    # Iterate thourgh our iterable list
    # Extract the Spanish numbers
    # put them in a generator called number
    for position, number in iterator:
        # Returns a 'generator' containing numbers in Spanish
        yield number

# CODE
# Lest's test the generator returned by our iterator
for i in count_to(8):
    print(f"The number is: {i}.")
```

```bash title="Output"
The number is: uno.
The number is: dos.
The number is: tres.
The number is: cuatro.
The number is: cinco.
The number is: seis.
The number is: siete.
The number is: ocho.
```

### Strategy Method
The strategy method is Behavioral Design pattern that allows you to define the complete family of algorithms, encapsulates each one and putting each of them into separate classes and also allows to interchange there objects. It is implemented in Python by dynamically replacing the content of a method defined inside a class with the contents of functions defined outside of the class. It enables selecting the algorithm at run-time. This method is also called as Policy Method.

```python
import types # Types module

class Strategy:
    """The Strategy Pattern class"""
    def __init__(self, function = None):
        self.name = "Default Strategy"
        
        # If a reference to a function is provided, replace the execute() method with the given function.
        if function:
            self.execute = types.MethodType(function, self)
        
    def execute(self):
        """The default method that prints the name of the strategy being used"""
        print(f"{self.name} is used!")
            

# Replacement method 1
def strategy_one(self):
    print(f"{self.name} is used to execute method 1")
    
def strategy_two(self):
    print(f"{self.name} is used to execute method 2")

# CODE
# Let's create our default strategy
s0 = Strategy()
# Let's execute our default strategy
s0.execute()

# Let's create our first variation of our default strategy by providing a new behavior
s1 = Strategy(strategy_one)
# Let's set its name
s1.name = "Strategy_one"
# Let's execute the strategy
s1.execute()

# Let's create our first variation of our default strategy by providing a new behavior
s2 = Strategy(strategy_two)
# Let's set its name
s2.name = "Strategy_two"
# Let's execute the strategy
s2.execute()  
```

```bash title="Output"
Default Strategy is used!
Strategy_one is used to execute method 1
Strategy_two is used to execute method 2
```


### Chain of Responsability Method
Chain of Responsibility method is Behavioral design pattern and it is the object-oriented version of if … elif … elif … else and make us capable to rearrange the condition-action blocks dynamically at the run-time. It allows us to pass the requests along the chain of handlers. The processing is simple, whenever any handler received the request it has two choices either to process it or pass it to the next handler in the chain. 
This pattern aims to decouple the senders of a request from its receivers by allowing the request to move through chained receivers until it is handled. 

```python
class Handler:
    """Abstract Handler"""
    def __init__(self, succesor):
        """Define who is the next handler"""
        self._succesor = succesor
    
    def handle(self, request):
        handled = self._handle(request)
        
        if not handled:
            self._succesor.handle(request)
        
    def _handle(self, request):
        raise NotImplementedError("Must provide implementation in subclass!")

class ConcreteHandler1(Handler):
    """Concrete handler 1"""
    def _handle(self, request):
        if 0 < request <= 10: # Provide a condition for handling
            print(f"Request {request} handled in handeler 1")
            return True # Indicates the request have been handled
        
class DefaultHandler(Handler):
    """Default handler"""
    def _handle(self, request):
        """If ther is no handler available. No condition checking since
        this is a default handler"""
        print(f"End of chain, no handler for {request}")
        return True # Indicates that the request has been handled
    
class Client:
    """Using handlers"""
    def __init__(self):
        """Create handlers and use them in a sequence you want"""
        self.handler = ConcreteHandler1(DefaultHandler(None))
    
    def delegate(self, requests):
        """Send your requestas one at a time for handlers to handle"""
        for request in requests:
            self.handler.handle(request)
            
# CODE
# Create a client
client = Client()

# Create requests
requests = [2, 5, 30]

# Send requests
client.delegate(requests)
```

```bash title="Output"
Request 2 handled in handeler 1
Request 5 handled in handeler 1
End of chain, no handler for 30
```


### Command Method
Command Method is Behavioral Design Pattern that encapsulates a request as an object, thereby allowing for the parameterization of clients with different requests and the queuing or logging of requests. Parameterizing other objects with different requests in our analogy means that the button used to turn on the lights can later be used to turn on stereo or maybe open the garage door. It helps in promoting the “invocation of a method on an object” to full object status. Basically, it encapsulates all the information needed to perform an action or trigger an event.

```python
#Use built-in abc to implement Abstract classes and methods
from abc import ABC, abstractmethod

class Command(ABC):
"""Class Dedicated to Command"""
      
    def __init__(self, receiver):
	"""constructor method"""
        self.receiver = receiver
      

    def process(self):
	"""process method"""
        pass
  
class CommandImplementation(Command):
"""Class dedicated to Command Implementation"""
      

    def __init__(self, receiver):
	"""constructor method"""
        self.receiver = receiver
  
    
    def process(self):
	"""process method"""
        self.receiver.perform_action()
  

class Receiver:
"""Class dedicated to Receiver"""      
    def perform_action(self):
	"""perform-action method"""
        print('Action performed in receiver.')
  
class Invoker:
"""Class dedicated to Invoker"""
      
    def command(self, cmd):
	"""command method"""
        self.cmd = cmd
  
    def execute(self):
	"""execute method"""
        self.cmd.process()
  

if __name__ == "__main__":      
    # create Receiver object
    receiver = Receiver()
    cmd = CommandImplementation(receiver)
    invoker = Invoker()
    invoker.command(cmd)
    invoker.execute()
```

```bash title="Output"
Action performed in receiver.
```


### Mediator Method
Mediator Method is a Behavioral Design Pattern that allows us to reduce the unordered dependencies between the objects. In a mediator environment, objects take the help of mediator objects to communicate with each other. It reduces coupling by reducing the dependencies between communicating objects. The mediator works as a router between objects and it can have it’s own logic to provide a way of communication.

Design Components:
- **Mediator:** It defines the interface for communication between colleague objects.
- **Concrete Mediator:** It implements the mediator interface and coordinates communication between colleague objects.
- **Colleague:** It defines the interface for communication with other colleagues
- **Concrete Colleague:** It implements the colleague interface and communicates with other colleagues through its mediator.
  
```python
class Course(object):
    """Mediator class."""
 
    def displayCourse(self, user, course_name):
        print("[{}'s course ]: {}".format(user, course_name))
 
 
class User(object):
    '''A class whose instances want to interact with each other.'''
 
    def __init__(self, name):
        self.name = name
        self.course = Course()
 
    def sendCourse(self, course_name):
        self.course.displayCourse(self, course_name)
 
    def __str__(self):
        return self.name
 
# main method
if __name__ == "__main__":
 
    mayank = User('Mayank')   # user object
    lakshya = User('Lakshya') # user object
    krishna = User('Krishna') # user object
 
    mayank.sendCourse("Data Structures and Algorithms")
    lakshya.sendCourse("Software Development Engineer")
    krishna.sendCourse("Standard Template Library")
```

### Memento Method
Memento Method is a Behavioral Design pattern which provides the ability to restore an object to its previous state. Without revealing the details of concrete implementations, it allows you to save and restore the previous version of the object. It tries not to disturb the encapsulation of the code and allows you to capture and externalize an object’s internal state.

```python
"""Memento class for saving the data"""
 
class Memento:
 
    def __init__(self, file, content):
	"""Constructor function"""
 
        """put all your file content here"""
         
        self.file = file
        self.content = content
 
"""It's a File Writing Utility"""
 
class FileWriterUtility:
 
    def __init__(self, file):
	"""Constructor Function"""
 
        """store the input file data"""
        self.file = file
        self.content = ""
 
    """Write the data into the file"""
 
    def write(self, string):
        self.content += string
 
    """save the data into the Memento"""
 
    def save(self):
        return Memento(self.file, self.content)
 
    """UNDO feature provided"""
 
    def undo(self, memento):
        self.file = memento.file
        self.content = memento.content
 
"""CareTaker for FileWriter"""
 
class FileWriterCaretaker:
 
    """saves the data"""
 
    def save(self, writer):
        self.obj = writer.save()
 
    """undo the content"""
 
    def undo(self, writer):
        writer.undo(self.obj)
 
 
if __name__ == '__main__':
 
    """create the caretaker object"""
    caretaker = FileWriterCaretaker()
 
    """create the writer object"""
    writer = FileWriterUtility("GFG.txt")
 
    """write data into file using writer object"""
    writer.write("First vision of GeeksforGeeks\n")
    print(writer.content + "\n\n")
 
    """save the file"""
    caretaker.save(writer)
 
    """again write using the writer """
    writer.write("Second vision of GeeksforGeeks\n")
 
    print(writer.content + "\n\n")
 
    """undo the file"""
    caretaker.undo(writer)
 
    print(writer.content + "\n\n")
```

### State Method
State method is Behavioral Design Pattern that allows an object to change its behavior when there occurs a change in its internal state. It helps in implementing the state as a derived class of the state pattern interface. If we have to change the behavior of an object based on its state, we can have a state variable in the Object and use if-else condition block to perform different actions based on the state. It may be termed as the object-oriented state machine. It implements the state transitions by invoking methods from the pattern’s superclass.

```python
class State:
"""State class: Base State class"""
  
    def scan(self):
        """Scan the dial to the next station"""
        self.pos += 1
  
        """check for the last station"""
        if self.pos == len(self.stations):
            self.pos = 0
        print("Visiting... Station is {} {}".format(self.stations[self.pos], self.name))
  

class AmState(State):
"""Separate Class for AM state of the radio"""  

    def __init__(self, radio):
	"""constructor for AM state class"""
        self.radio = radio
        self.stations = ["1250", "1380", "1510"]
        self.pos = 0
        self.name = "AM"
  

    def toggle_amfm(self):
	"""method for toggling the state"""
        print("Switching to FM")
        self.radio.state = self.radio.fmstate
  
class FmState(State):
"""Separate class for FM state"""
  
    def __init__(self, radio):
	"""Constriuctor for FM state"""
        self.radio = radio
        self.stations = ["81.3", "89.1", "103.9"]
        self.pos = 0
        self.name = "FM"
  
    def toggle_amfm(self):
	"""method for toggling the state"""
        print("Switching to AM")
        self.radio.state = self.radio.amstate
  
class Radio:
"""Dedicated class Radio"""
  
    """A radio. It has a scan button, and an AM / FM toggle switch."""
  
    def __init__(self):
          
        """We have an AM state and an FM state"""
        self.fmstate = FmState(self)
        self.amstate = AmState(self)
        self.state = self.fmstate
  
    def toggle_amfm(self):
	"""method to toggle the switch"""
        self.state.toggle_amfm()
  
    def scan(self):
	"""method to scan """
        self.state.scan()
  
# main method
if __name__ == "__main__":
  
    # create radio object
    radio = Radio()
    actions = [radio.scan] * 3 + [radio.toggle_amfm] + [radio.scan] * 3
    actions *= 2
  
    for action in actions:
        action()
```

```bash title="Output"
Visiting... Station is 89.1 FM
Visiting... Station is 103.9 FM
Visiting... Station is 81.3 FM
Switching to AM
Visiting... Station is 1380 AM
Visiting... Station is 1510 AM
Visiting... Station is 1250 AM
Visiting... Station is 1380 AM
Visiting... Station is 1510 AM
Visiting... Station is 1250 AM
Switching to FM
Visiting... Station is 89.1 FM
Visiting... Station is 103.9 FM
Visiting... Station is 81.3 FM
```


### Template Method
The Template method is a Behavioral Design Pattern that defines the skeleton of the operation and leaves the details to be implemented by the child class. Its subclasses can override the method implementations as per need but the invocation is to be in the same way as defined by an abstract class. It is one of the easiest among the Behavioral design pattern to understand and implements. Such methods are highly used in framework development as they allow us to reuse the single piece of code at different places by making certain changes. This leads to avoiding code duplication also.

```python
def get_text():
    """ method to get the text of file"""
    return "plain_text"
 
def get_xml():
    """ method to get the xml version of file"""
     
    return "xml"
 

def get_pdf():
    """ method to get the pdf version of file"""
     
    return "pdf"
 

def get_csv():
    """method to get the csv version of file"""
    return "csv"
 

def convert_to_text(data):
    """method used to convert the data into text format"""
     
    print("[CONVERT]")
    return "{} as text".format(data)
 

def saver():
    """method used to save the data"""
     
    print("[SAVE]")
 

def template_function(getter, converter = False, to_save = False):
    """helper function named as template_function"""
 
    """input data from getter"""
    data = getter()
    print("Got {}".format(data))
 
    if len(data) <= 3 and converter:
        data = converter(data)
    else:
        print("Skip conversion")
     
    """saves the data only if user want to save it"""
    if to_save:
        saver()
 
    print("{} was processed".format(data))
 
 
"""main method"""
if __name__ == "__main__":
 
    template_function(get_text, to_save = True)
 
    template_function(get_pdf, converter = convert_to_text)
 
    template_function(get_csv, to_save = True)
 
    template_function(get_xml, to_save = True)
```

```bash title="Output"
Got plain_text
Skip conversion
[SAVE]
plain_text was processed
Got pdf
[CONVERT]
pdf as text was processed
Got csv
Skip conversion
[SAVE]
csv was processed
```

---

## References and links

- Download the Jupyter notebook from: [github.com/charlstown/Python-Design-Patterns](https://github.com/charlstown/Python-Design-Patterns)
- [Python Design Patterns course from Jungwoo Ryoo](https://www.linkedin.com/learning/python-design-patterns-2015)
- [Jungwoo Ryoo LinkedIn profile](https://www.linkedin.com/in/jungwooryoo/)
- [More Notebooks like this here](https://carlosgrande.me/category/myworks/notebooks/)