/** @module squidspace */

/** The squidspace module provides a runtime for a simulated
space. It allows you to define a 'world' and will then run
that world as a simulation using the world's settings and 
allowing the user to move around it in similar to how they 
navigate through a real world. 

In most cases the physics used are simplified, but broadly similar 
to the real-world. However, some physics parameters may 
be changed. For example, gravity can be increased or decreased;
affecting how far you can jump and how fast you move.

TODO: JS 6 modules have CORS issues. Rework as an older-style module 
      so we can load locally.
*/
export const name = 'squidspace';

/** Something loaded from a world spec. */
class WorldThing {
	#spec;
	#objSpecLoadFunc;
	
	constructor(objSpecLoadFunc, configOverride) {
		// TODO: Add exception handling.
		this.#spec = objSpecLoadFunc();
		this.#objSpecLoadFunc = objSpecLoadFunc;
		// TODO: Implement config override.
	}
	
	get id() {
		return this.#spec.id;
	}
	
	get data() {
		if (this.#spec.data == null) {
			// TODO: Add exception handling.
			sp = this.#objSpecLoadFunc();
			this.#spec.data = sp.data;
		}
		
		return this.#spec.data;
	}
	
	get config() {
		return this.#spec.config;
	}
	
	get prompts() {
		return this.#spec.prompts;
	}
	
	/** Clears the internal data cache to reduce memory requirements.
	
	This function should only be invoked after the data is no longer required.
	In most cases, if this function is called and then the data getter is invoked,
	the getter will attempt to reload and recache the data. However it is possible 
	the data will no longer be available for a variety of reasons. 
	*/
	purgeData() {
		this.#spec.data = null;
	}
}


/** Provides a helpful wrapper around a worldspec. */
class World {
	constructor(worldSpec, configOverride)  {
		
	}
	
	get config() {
		
	}	
	
	get worldObjects() {
		
	}

	get worldTextures() {
		
	}

	get worldMaterials() {
		
	}
	
	get layouts() {
		
	}
	
	/**
	Returns a dictionary of script functions.
	
	Each script function must expect and handle *only* the following 
	arguments:
	
	1. prompt – A dictionary containing data specific to this script function
	
	2. simulationThing – An instance of a SimulationThing or one of its subclasses
	
	3. simulation – An instance of the simulation containing the simulationThing
	
	4. engine – The runtime engine
	*/
	get worldScripts() {
		
	}	
	
}

class Box {
	
}

/** Something in a currently running simulation. */
class SimulationThing {
	#worldThing;
	
	constructor(worldThing, configOverride) {
		this.#worldThing = worldThing;
	}

}

class SimObject extends SimulationThing {
	makeObjectInstance(simulation, engine) {
		
	}
	
	getBox(simulation, engine) {
		
	}
}

class Simulation {
	#world;
	#running = false;
	constructor(world, configOverride)  {
		this.#world = world;
	}
		
	runSim(engine, config) {
		
	}
	
	get running() {
		return this.#running
	}
}

export {WorldThing, World, Box, SimulationThing, SimObject, Simulation};

export function simulateWorld(worldSpec, engine, worldConfig, simConfig, runConfig) {
	let s = new Simulation(new World(worldSpec, worldConfig), simConfig);
	s.runSim(engine, runConfig);
	return s;
} 
