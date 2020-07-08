"""## cleanbabylon.py – SQS Filter Module for cleaning .babylon files

Removes unhelpful or unneeded data sections from .babylon files. 

Besides the standard filter() and filterFileExtensions() functions there are 
two API functions:

* cleanData(data) - Cleans a Python dictionary containing a parsed .babylon file

* processDirectory(pathIn, pathOut, recurse) - Cleans all .babylon files in 
  the directory specified with pathIn, writing the files out to pathOut. If
  pathIn and pathOut are the same it will operate destructively, overwriting
  the files.

Options: None.

Data: None.

File Extensions:

* in – .babylon

* out – .babylon"""


copyright = """SquidSpace.js, the associated tooling, and the documentation are copyright 
Jack William Bell 2020 except where noted. All other content, including HTML files and 3D 
assets, are copyright their respective authors."""


import sys
import os
import json
from sqslogger import logger
from common import PathCardinality
    
def cleanData(data):
    dirty = False
    
    # Check for other unwanted sections and clean them.
    
    if "cameras" in data:
        #del data["cameras"]
        if len(data["cameras"]) > 0:
            data["cameras"] = [] # Make it an empty list.
            dirty = True
        
    if "activeCameraID" in data:
        del data["activeCameraID"]
        dirty = True

    if "gravity" in data:
        del data["gravity"]
        dirty = True

    if "lights" in data:
        #del data["lights"]
        if len(data["lights"]) > 0:
            data["lights"] = [] # Make it an empty list.
            dirty = True
        
    # Add other sections we want to remove here.
    
    # Done!
    return dirty

def filterFile(pathIn, pathOut, options, data):
    # NOTE: Currently supports no options. 
    # Assume failure.
    result = False
    
    # Is it a .babylon file?
    name, ext = os.path.splitext(pathIn)
    if ext == ".babylon":
        try:
            # Load Babylon file
            with open(pathIn, 'r') as babFile:
                data = json.load(babFile)
                close(babFile)
            
            # Try to clean the data.
            if cleanData(data):
                logger.debug("Babylon file was cleaned.")
            else:
                logger.debug("Babylon file did not require cleaning.")
            try:
                # Write it back out.
                # TODO: This writes it packed, do we want a 'pretty print' option?
                with open(pathOut, 'w') as babFile:
                    json.dump(data, babFile)
                    close(babFile)
                logger.debug("Babylon file written out.")
                result = True
            except:
                logger.exception("cleanbablyon.filterFile() - Command '{command}' failed to write output.".format(command))
        except:
            logger.exception("cleanbablyon.filterFile() - Command '{command}' failed to parse the .babylon file.".format(command))
    else:
        logger.error("cleanbablyon.filterFile() - Path in not a .babylon file.")
    
    return result

def filterFileExtensions(options, data):
    return (".babylon", ".babylon")


def filterPathCardinality(options, data):
    return (OneToOne, DirToDir)


def filter(pathIn, pathOut, options, data):
    # NOTE: Currently supports no options. Currently no support for directory recursion.
    logger.debug("cleanbabylon.filter() - Processing pathIn: {pathIn} pathOut: {pathOut} options: options".format(pathIn, pathOut, options))
    
    # Are we filtering one file or a whole directory? (See filterPathCardinality() above.)
    if os.path.isdir(pathIn) and os.path.isdir(pathOut):
        for item in os.listdir(path):
            if not os.path.isdir(item):
                if not filterFile(os.path.join(pathIn, item), os.path.join(pathOut, item)):
                    return False;
    elif os.path.isdir(pathIn) or os.path.isdir(pathOut):
        logger.error("cleanbablyon.filter() - Paths must both be single files or both be directories.")
        return False;
    
   # Just filtering the one file.
   return filterFile(pathIn, pathOut, options, data)