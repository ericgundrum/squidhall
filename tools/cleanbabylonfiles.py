#!/usr/bin/env python3
"""Removes unhelpful or unneeded data sections from .babylon files."""

import sys
import os
import json

def cleanData(data):
    dirty = False
    
    # Check for unwanted sections and clean them.
    
    if "cameras" in data:
        #del data["cameras"]
        data["cameras"] = [] # Make it an empty list.
        dirty = True
        
    if "activeCameraID" in data:
        del data["activeCameraID"]
        dirty = True

    if "gravity" in data:
        del data["gravity"]
        dirty = True
        
    # Add other sections we want to remove here.
    
    # Done!
    return dirty

def processFile(filePath):
    # DEBUG: Comment out for production.
    #print("Processing file: " + filePath);print("")
    
    # Is it a .babylon file?
    name, ext = os.path.splitext(filePath)
    if ext == ".babylon":
        # DEBUG: Comment out for production.
        print("Babylon file: " + filePath);print("")
        
        try:
            # Load Babylon file
            with open(filePath, 'r') as babFile:
                data = json.load(babFile)
                
            # Try to clean the data.
            if cleanData(data):
                try:
                    # Write it back out.
                    with open(filePath, 'w') as babFile:
                        json.dump(data, babFile)
                except Exception:
                    # TODO: Upgrade error handling and pass exception up.
                    pass
        except json.JSONDecodeError:
            # TODO: Pass exception up, do not handle here.
            print("Error loading .babylon file:", sys.exc_info()[1])        
        

def processDirectory(path, recurse):
    # DEBUG: Comment out for production.
    print("Processing path: " + path);print("")

    for item in os.listdir(path):
        if os.path.isdir(item):
            if recurse:
                processDirectory(item, recurse)
        else:
            processFile(os.path.join(path, item))

    # DEBUG: Comment out for production.
    print("Path processing complete.")
    

def main(path, recurse):
    # Is the path a file or a directory?
    if os.path.isdir(path):
        processDirectory(path, recurse)
    else:
        processFile(path)
    
    
if __name__ == '__main__':
    # TODO: Support command line arguments for path and directory recursion.
    main("objects", False)