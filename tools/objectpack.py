#!/usr/bin/env python3

import sys
import os
import json

def insertTextFile(inFilePath, outFile, singleLine = True):
    """Inserts the contents of a text file specified by the in file path into the out file."""
    
    # TODO: Error handling.
    inFile = open(inFilePath, "r")
    for line in inFile:
        # TODO: If singleLine is true, strip out newlines or convert them to '\n' escapes.
        outFile.write(line)
    inFile.close()

def processModule(outDir, moduleName, moduleData):
    """Processes one module data."""
    
    # DEBUG: Comment out for production.
    #print(moduleData);print("")
    print("Writing module: " + moduleName);print("")

    # Get configuration and set up for processing. (No module config currently supported.)
    pp = True; # TODO: Add 'pretty-print' to config.
    offset = "   " # TODO: Add 'offset' to config as number of chars.
    # TODO: make sure outdir is a proper path with a trailing slash and/or
    # use Pythong dir functions to generate full module path. Note that outdir
    # may be passed in as None.
    # TODO: Error handling.
    mf = open(outDir + moduleName + ".js", "w")
    
    # Write module start.
    # TODO: Currently not doing the module properly because having Javascript load issues. 
    # Figure out why and fix back to commented out versions.
    #mf.write("var " + moduleName + " = (function () {")
    mf.write("var " + moduleName + " = {")
    if pp: mf.write("\n")
    
    # Process objects.
    if not moduleData["objects"] is None:
        for obj in moduleData["objects"]:
            if pp: mf.write(offset)
            #mf.write("var " + obj["name"] + " = '")
            mf.write(obj["name"] + ": '")
            insertTextFile(obj["file"], mf, singleLine = True)
            #mf.write("';")
            mf.write("',")
            if pp: mf.write("\n")
    
    # Process textures.
    # TODO.
    
    # Process javascript inserts.
    # TODO.
        
    # Write module end.
    if pp: mf.write("\n")
    #mf.write("})();")
    mf.write("};")
    
    # Clean up.
    mf.close()
    
    
def processPackData(packData):
    """Processes Pack Data to generate output modules."""
    # TODO: Document pack data.
    
    # DEBUG: Comment out for production.
    print("Processing Pack Data.");print("")
    #print(packData);print("")
    
    # Get configuration and set up for processing.
    outDir = None
    if not packData["config"] is None:
        config = packData["config"]
        
        if not config["outdir"] is None and not config["outdir"] == "":
            outDir = config["outdir"]
    
    # Write Modules.
    if not packData["modules"] is None:
        for module in packData["modules"]:
            processModule(outDir, module, packData["modules"][module])

    # DEBUG: Comment out for production.
    print("Processing complete.");print("")


def processPackString(packString):
    """Loads JSON Pack Data from a string and processes it."""

    # Assume failure.
    packData = None
    
    try:
        packData = json.loads(processPackString)
    except json.JSONDecodeError:
        # TODO: Pass exception up, do not handle here.
        print("Could not load pack string.")
        
    if not packData is None:    
        processPackData(packData)


def processPackFile(packFile):
    """Loads JSON Pack Data from a file and processes it."""
        
    # Assume failure.
    packData = None
    
    try:
        packData = json.load(packFile)
    except json.JSONDecodeError:
        # TODO: Pass exception up, do not handle here.
        print("Could not load pack file.")
        
    if not packData is None:    
        processPackData(packData)


def main(packFileName):
    # Assume Failure.
    packFile = None
    
    if not packFileName is None and not packFileName == "":
        # Use passed packFile name.
        print("Pack File: " + packFileName);print("")
        try:
            packFile = open(packFileName)
        except:
            print("Error reading pack file:", sys.exc_info()[1])
    else:
        # Use stdin if no file name.
        print("Pack Data from STDIN.");print("")
        packFile = sys.stdin

    if not packFile is None:    
        processPackFile(packFile)
    
    
if __name__ == '__main__':
    # TODO: Support command line arguments for pack file name.
    main("world.pack.json")