# Pack Files

Pack Files let you specify one or more modules, which are then used to generate
Javascript modules that are loaded into the simulation controller. (See also, 
Code Generation below.)

A Pack File consists of JSON data containing the following top-level sections:

1. "doc" – [optional] – Documentation for the file, use to describe what the file is for 

2. "config" – [required] – Configuration details for the entire file, currently 
   supported configuration values include:
	 - "outdir" – [required] – Directory to write output modules to
	 
3. "modules" – [required] – A specification for each module to be generated (see also, 
	Module Section below)
	
Pack File example:

	{
		"doc": "Example pack file.",
		"config": {
			"outdir": "libs/objects/"
		},
		"modules": [
			{
			    "name": "world",
				"doc": "example module.",
				"config": {
					"pretty-print": true,
					"pretty-offset": 3
				},
				"data": {
					"doc": "Data values are arbitrary and simulation-controller dependent.",
					"some-thing": "some value",
					"foo": {
						"bar": 1,
						"baz": true,
						"boo": "some value",
					},
					"world-origin": [32, 0, -20]
				},
				"objects": [
					{
						"name": "arena",
						"doc": "Example object.",
						"action": "insert",
						"file": "objects/arena.babylon",
						"config": {
							"space-object": true
						}
					},
					{
						"name": "beam",
						"action": "link",
						"root": "objects/"
						"file": "beam.babylon"
					}
				],
				"textures": [],
				"materials": [],
				"lights": [],
				"area-layouts": [
					{
						"area": "artshow",
						"origin": [10, 0, 30]
						"object-placements": [
							{
								"name": "floorsection",
								"object": "floor",
								"material": "marble",
								"placements": [
									{
										"placer": "single",
										"position": [0, 0.01, 0]
									}
								]
							}
						]
					}
				],
				"hooks": {
				},
				"events": [
				]
			}
		]
	}
	

## Module Section

The Module Section of a Packfile is a list of one or more modules to generate. Each module 
list item consists of a specification for a single module to generate output for. 

A module specification consists of JSON data containing the following top-level sections:

1. "name" – [required] – The name of the module, used for both the module file name and the 
   variable name the module is assigned to (see also, Code Generation below)

2. "doc" – [optional] – Documentation for the module, use to describe what the module is for 

3. "config" – [required] – Configuration details for the module, currently 
   supported configuration values include:
	 - "pretty-print" – [optional, default is false] – If true, the module is formatted to
	   be readable, using the 'pretty-offset' value for formatting; if false the module
	   is 'packed'
	 - "pretty-offset" – [optional, default is '3'] – The number of spaces to offset when
	   pretty printing

4. "data" – [optional] – A dictionary of arbitrary values to pack into the file for use
   by the simulation controller at runtime (see also, Data below)

5. "objects" – [optional] – A list of one or more objects to pack into the file (see also, Objects below)

6. "textures" – [optional] – A list of one or more textures to pack into the file (see also, Textures below)

7. "materials" – [optional] – A list of one or more materials to pack into the file (see also, Materials below)

8. "lights" – [optional] – A list of one or more lights to pack into the file (see also, Lights below)

9. "area-layouts" – [optional] – A list of one or more area layouts to pack into the file (see also, Area Layouts below)

### Objects

The Objects Section of a Module is a list of one or more objects to add to the generated module. 
Each object list item consists of a specification for a single object, including the actual 
object geometry. 

1. "name" – [required] – The name of the object, used for the object name in the generated 
   module (see also, Code Generation below) and used as the ID value for all the loaded meshes
   contained in the object at runtime

2. "doc" – [optional] – Documentation for the object, use to describe what the object is for 

3. "config" – [optional] – Configuration details for the module, currently 
   supported configuration values include:
	- "space-object" – [optional, default is false] – Specifies that the object is 
	  made visible in the space at startup using the object's own position data; 
	  otherwise the object is a 'layout object' and is made invisible in the space 
	  at startup and must be placed into the space using a layout (see also, Area 
	  Layouts below)

4. "action" – [required] – Specifies the packing action to take (see also, Packing Actions), 
   must be one of the following action values:
	- "insert" – The object data will be inserted into the generated module from the specifed
	  file or from the specified data
	- "link" – The object data will be loaded at runtime using the specified root and file
	- "builtin" - The object is a Babylon.js built-in mesh using the specified data (see also, 
	  Object Builtins below) 

5. "root" – [required if action is 'link', otherwise do not use] – Specifies the URL root 
   to insert into the module

6. "file" – [required if action is 'link', required if action is 'insert' and no 'data' is
   specified, otherwise do not use] – Specifies the file containing object data to insert 
   into the module if the action is 'include' or the file name to fetch at the root location 
   if the action is 'link'

7. "data" – [required if action is 'builtin' or the action is 'insert' and no 'file' is 
   specified, otherwise do not use] – Contains the actual object data; as a string if 
   'insert' or as a builtin spec if 'builtin' (see also, Object Data and Object Builtins below)

8. "loader" – [required if the action is 'insert' or 'link' and the Object file type 
   is not '.babylon', otherwise do not use] – Used to specify the object loading plugin
   to use with the file name extension; currently supported loader values include:
	 - ".obj"
	 - TODO: Research what filename extensions Babylon.js loaders support and add here


#### Object Examples

TODO: Document.

#### Object Data

TODO: Implement and Document.

#### Object Builtins

TODO: Implement and Document.

### Textures

TODO: Document.

### Materials

TODO: Document.

### Lights

TODO: Document.

### Area Layouts

TODO: Document.

### Hooks

TODO: Implement and Document.

### Events

TODO: Implement and Document.

## Code Generation

TODO: Document.
