#!/usr/bin/env python3
"""Reads in a 'pack' file containing JSON data and, using that data, generates
a Javascript module."""

import sys
import os
import json
from enum import Enum


class ElementAction(Enum):
    """Enumeration of supported pack actions."""
    INSERT = 1
    LINK = 2


class ElementSource(Enum):
    """Enumeration of supported pack sources."""
    DATA = 1
    FILE = 2
    URL = 3
    LOCAL = 4
    EMPTY = 99
    
    
class ModuleConfiguration(object):
    """Contains a module configuration."""
    def __init__(self, configData):
        """Sets the module configuration to match the passed configuration data."""
        # Set defaults
        self.pp = True; # TODO: Add 'pretty-print' to config.
        self.offset = "   " # TODO: Add 'offset' to config as number of chars.
        self.defaultFileLoader = "TODO: loader functions not currently supported." # TODO
        self.defaultUrlLoader = "TODO: loader functions not currently supported." # TODO
        
        # Get values from passed configuration, if any.
        if not configData is None and isinstance(configData, dict):
            if "pretty-print" in configData:
                self.pp = configData["pretty-print"]
            if "pretty-offset" in configData:
                self.offset = " " * configData["pretty-offset"]
            if "default-file-loader-func" in configData:
                self.defaultFileLoader = configData["default-file-loader-func"]
            if "default-url-loader-func" in configData:
                self.defaultUrlLoader = configData["default-url-loader-func"]


## TODO: insertBinary() and insertBinaryFile(), doing some kind of binary-to-text conversion.


def insertTextFile(inFilePath, outFile, singleLine = True):
    """Inserts the contents of a text file specified by the in file path into the out file."""
    
    inFile = open(inFilePath, "r")
    for line in inFile:
        if singleLine:
            outFile.write(line.replace('\n', '\\n'))
        else:
            outFile.write(line)
    inFile.close()


def insertText(text, outFile, singleLine = True):
    """Inserts the passed text into the out file."""
    
    if singleLine:
        outFile.write(text.replace('\n', '\\n').replace('"', '\\"'))
    else:
        outFile.write(text.replace('"', '\\"'))

    
def insertReturnLinkLoaderFunc(func, link, outFile, config, singleLine = True):
    """ TODO """
    pass


def insertValue(value, outFile, config, baseOffset, singleLine = True):
    """Inserts a value into the out file."""
    
    if isinstance(value, str): # String
        outFile.write('"')
        outFile.write(value)
        outFile.write('"')
    elif isinstance(value, bool): # Boolean
        if value:
            outFile.write("true")
        else:
            outFile.write("false")
    elif isinstance(value, (int, float)): # Float
        outFile.write(str(value))
    elif isinstance(value, dict): # Dictionary
        insertDict(value, outFile, config, baseOffset + config.offset)
    elif isinstance(value, list): # List
        insertList(value, outFile, config, baseOffset + config.offset)
    

def insertList(list, outFile, config, baseOffset):
    """Insertes the contents of a list into the out file."""

    outFile.write("[")
    
    ft = False
    for value in list:
        if ft:
            outFile.write(",")
        else:
            ft = True
        if config.pp: outFile.write("\n" + baseOffset + config.offset)
        insertValue(value, outFile, config, baseOffset, singleLine = True)

    if config.pp: outFile.write("\n" + baseOffset)
    outFile.write("]")
    

def insertDict(dict, outFile, config, baseOffset):
    """Insertes the contents of a dictionary into a Module file."""

    outFile.write("{")
    
    ft = False
    for key in dict:
        if ft:
            outFile.write(",")
        else:
            ft = True
        if config.pp: outFile.write("\n" + baseOffset + config.offset)
        outFile.write('"' + key + '": ')
        insertValue(dict[key], outFile, config, baseOffset, singleLine = True)

    if config.pp: outFile.write("\n" + baseOffset)
    outFile.write("}")
    
        
def insertReturnElement(element, source, outFile, config, baseOffset, singleLine = True):
    """Inserts a return statement into the out file that returns a dictionary 
    consisting of the element data and configuration."""
    
    # Write return prefix. 
    if config.pp: outFile.write("\n" + baseOffset + config.offset)
    outFile.write("return {")

    # Write data.
    # TODO: Support link loader func here.
    if config.pp: outFile.write("\n" + baseOffset + config.offset + config.offset)
    outFile.write("\"data\": '")
    if source == ElementSource.DATA:
        insertText(element["data"], outFile, singleLine)
    elif source == ElementSource.FILE:
        insertTextFile(element["file"], outFile, singleLine)
    outFile.write("'")
        
    # Write element config, if present.
    if "config" in element:
        outFile.write(",")
        if config.pp: outFile.write("\n" + baseOffset + config.offset + config.offset)
        outFile.write('"config": ')
        insertDict(element["config"], outFile, config, baseOffset + config.offset + config.offset)
    
    # Write return suffix.
    if config.pp: outFile.write("\n" + baseOffset + config.offset)
    outFile.write("};")


def insertFetchElementFunc(elem, outFile, config, public=True):
    """Inserts a function that fetches an element into the out file, where 
    the element returned is a dictionary consisting of the element data and configuration."""
    
    offset = config.offset
    baseOffset = offset
    if public:
        baseOffset = offset + offset
    
    # TODO: Currently only implemented to write public section elements, will need to modify  
    # to support private elements, which use a different syntax.
    
    # TODO: Verify element has all required fields with expected values. Error if not.
    
    # Determine action requested.
    # TODO: Decide if we want to throw exception if action not specified or invalid.
    # Currently defaults to 'insert'.
    action = ElementAction.INSERT
    if "action" in elem:
        if elem["action"].lower() == "link":
            action = ElementAction.LINK
            
    # Determine element source.
    # TODO: Decide if we want to throw exception if source not specified or invalid or
    # if more than one source is specified. Currently defaults to empty data.
    source = ElementSource.EMPTY
    if "data" in elem:
        source = ElementSource.DATA
    elif "file" in elem:
        source = ElementSource.FILE
    elif "url" in elem:
        source = ElementSource.URL
    elif "local" in elem:
        source = ElementSource.LOCAL

    # Write the element fetch prefix
    if config.pp: outFile.write("\n" + baseOffset)
    outFile.write(elem["name"] + ": function(){") # TODO: This is different for private section.
    
    # Write the element fetch action.
    if action == ElementAction.INSERT:
        if source == ElementSource.DATA:
            insertReturnElement(elem, ElementSource.DATA, outFile, config, baseOffset, singleLine = True)
        elif source == ElementSource.FILE:
            insertReturnElement(elem, ElementSource.FILE, outFile, config, baseOffset, singleLine = True)
        elif source == ElementSource.URL:
            # TODO: Implement URL packing.
            raise NotImplementedError("Action 'insert' with source 'url' not currently supported.")
            pass
        elif source == ElementSource.LOCAL:
            # TODO: Implement locals.
            raise NotImplementedError("Action 'insert' with source 'local' not currently supported.")
            pass
        else:
            raise ValueError("Cannot implement action 'insert' with no specified source.")
    elif action == ElementAction.LINK:
        if source == ElementSource.DATA:
            raise ValueError("Cannot implement action 'link' with source 'data'.")
        elif source == ElementSource.FILE:
            # TODO: Implement File loading.
            raise NotImplementedError("Action 'link' with source 'file' not currently supported.")
            pass
        elif source == ElementSource.URL:
            # TODO: Implement URL loading.
            raise NotImplementedError("Action 'link' with source 'url' not currently supported.")
            pass
        elif source == ElementSource.LOCAL:
            # TODO: Implement locals.
            raise NotImplementedError("Action 'link' with source 'local' not currently supported.")
        else:
            raise ValueError("Cannot implement action 'link' with no specified source.")
    
    # Write the element fetch suffix. 
    if config.pp: outFile.write("\n" + baseOffset)
    outFile.write("},") # TODO: This is different for private section.
    
    
def processModule(outDir, module):
    """Processes one module's elements and generates a module file."""
    
    # TODO: Error handling. Need to decide if we wrap everything in a try-catch or
    # do it line-by-line. 
    
    # DEBUG: Comment out for production.
    #print(module);print("")
    print("Writing module: " + module["name"]);print("")

    # Get configuration and set up for processing.     
    config = ModuleConfiguration(module["config"])
    offset = config.offset
    
    # TODO: make sure outdir is a proper path with a trailing slash and/or
    # use Python dir functions to generate full module path. Note that outdir
    # may be passed in as None, meaning use local dir.
    
    # Open module output file.
    mf = open(outDir + module["name"] + ".js", "w")
    
    # Write module start.
    mf.write("var " + module["name"] + " = (function(){")
    if config.pp: mf.write("\n")
    
    # Process private javascript.
    # TODO.
    
    # Write module publics.
    if config.pp: mf.write("\n" + offset)
    mf.write("return {")
    
    # Process objects.
    if "objects" in module:
        for obj in module["objects"]:
            insertFetchElementFunc(obj, mf, config, public=True)
            
    # Process lights.
    if "lights" in module:
        for light in module["lights"]:
            insertFetchElementFunc(light, mf, config, public=True)
        
    # Process textures.
    if "textures" in module:
        for texture in module["textures"]:
            insertFetchElementFunc(texture, mf, config, public=True)
        
    # Process public javascript.
    # TODO.
    
    # Write module end.
    if config.pp: mf.write("\n" + offset)
    mf.write("};")
    if config.pp: mf.write("\n")
    mf.write("})();")
    
    # Clean up.
    mf.close()
    
    
def processPackData(packData):
    """Processes the Pack Data to generate module files."""
    # TODO: Document pack data.
    
    # DEBUG: Comment out for production.
    print("Processing Pack Data.");print("")
    #print(packData);print("")
    
    # Get configuration and set up for processing.
    outDir = None
    if "config" in packData:
        config = packData["config"]
        
        if "outdir" in config and not config["outdir"] == "":
            outDir = config["outdir"]
    
    # Write Modules.
    if "modules" in packData:
        for module in packData["modules"]:
            processModule(outDir, module)

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
        print("Error loading pack file:", sys.exc_info()[1])
        
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
    main("squidhall.pack.json")