"""## SquidSpace.js Build Command

The SquidSpace.js 'build' command reads in a 'build' file containing JSON data meeting the 
SquidSpace.js Build File Specification. Then, with that data, it TODO: document.

For more information on Build Files and SquidSpace.js, please refer to the documentation 
located in the project repo at https://github.com/jackwilliambell/SquidSpace.js"""


copyright = """SquidSpace.js, the associated tooling, and the documentation are copyright 
Jack William Bell 2020 except where noted. All other content, including HTML files and 3D 
assets, are copyright their respective authors."""


import sys
import os
import json


from common import getFilterModule, ModuleConfiguration, ResourceFlavor, ResourceAction, ScratchDirManager, lookAheadIterator
from sqslogger import logger

def buildIt(buildFilePath):
    pass


def runBuild(defaultConfig, filterProfile, outDir, fileNames):
    """SQS build command."""
    # Assume Failure.
    fileToBuld = None
    
    # We expect to process a list of file names.
    if not isinstance(fileNames, list):
        fileNames = [fileNames] # Force list.
        
    # Create the module processing configuration.
    modConfig = ModuleConfiguration(defaultConfig, {})
        
    for buildFilePath in fileNames:
        if not buildFilePath is None and not buildFilePath == "":
            # Use passed file name.
            logger.info("filterfile.runBuild() - Building '{0}'.".format(buildFilePath))
            
            # Filter the file.
            if not buildIt(buildFilePath):
                logger.error("filterfile.runBuild() - Unable to build '{0}'.".format(buildFilePath))
        else:
            # Use stdin if no file name.
            # TODO: Fix here and elsewhere - this won't be reached because we are 
            #       iterating a possibly empty list.
            # TODO: Copy STDIN to scratch directory before starting
            #logger.info("filterfile.runBuild() - Reading file data from STDIN.")
            logger.error("filterfile.runBuild() - Currently STDIN not supported.")
            source = sys.stdin
