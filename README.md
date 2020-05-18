# Squid Hall

This is a project to create a virtual 'exhibits hall' for ConZealand – based on the actual TSB Arena in Wellington New Zealand – for the ConZealand 2020 Science Fiction Worldcon. The TSB Arena is known to Worldcon staff as 'Squid Hall', thus the name of the project.

One of the main goals of the Squid Hall to enable the ability to 'data drive' the  exhibits in the hall from an external source, in this case a web site to which the exhibiters can upload pictures and 3D models. To this end the project has adopted a 'file driven' approach using JSON data input to generate Javascript files.

These files can either link to content or contain the content internally. In the latter case, this means you can open a Squid Hall HTML file from the file system and not have issues with CORS the way you would if the content was loaded from a link.

## Releases

* Tag: version-20200516.0 [Alpha 0.0] Initial Proof of Concept (PoC). 

## Developer notes

All Squid Hall specific code is locatated in the libs/squidhall.js module. 

There are three squidhall .html pages: 

1. squidhall.html is the main 'production' page

2. squidhalltest.html is the main test page, it is identical to squidhall.html except with extra debug functionality

3. squidhallexperiments.html is a template page for creating your own experiments; copy it and add your experimental code as needed

There is an index.html page referencing these pages and which may be modified to include links to other experimental pages.

Squid Hall uses the SquidSpace.js library and tools. (See SquidSpace.js below.)

### SquidSpace.js

The SquidSpace module provides a thin runtime controller wrapper around Babylon.js focused on
creating 'walkthrough simulations' of spaces; recreated from real spaces or imaginary. SquidSpace
is designed for high extensibility through events and hooks and is driven by 'pack files' containing
or referencing 3D content and runtime configuration. The pack file specification provides a Domain 
Specific Language (DSL) useful for applications using 3D content.

The SquidSpace library, documentation, and tools in this repo are periodically updated from stable releases of SquidSpace. The SquidSpace repo is [here](https://github.com/jackwilliambell/SquidSpace.js).

### Workflow for adding features

The most common workflow for adding features to Squid Hall is to create a feature branch. (See Branching and branch names below.) Then, inside the feature branch, copy the squidhallexperiments.html file and add your features to it. Test and debug until the feature is working properly. 

When your feature is ready to be moved into master (or some other integration branch) you refactor the new code from your experiments page into squidhall.js and/or some other javascript file, make any changes required to the three main .html files (ideally these files would not require changes), perform testing on the main .html files, and then submit a Pull Request.

### Playgrounds

Developers are encouraged to create 'playground' branches where they can experiment in the absense of a specific feature requirement. (See Branching and branch names below.)

### Branching and branch names

This project is using a strategy of making the master the latest integrated code. Version releases
are assigned to version named branches. The following naming rules and branch purposes apply:

* master - The main integration branch with the mainline code for the latest version, does not need to pass tests. Once we have a 'version' that does pass tests we create a version branch as described below.

* feature-[feature-name] - Feature-specific development branches. Branch names always start with 'Feature' and are followed with the name of the feature after a dash. Generally these branches should be merged to master once the feature is working. If we have more than one person working on a feature they can create sub-branches named feature-[feature-name]-[developer-name]-[purpose].

* bug-[issue-ID] - Bug/Issue-specific development branches. Branch names always start with 'Feature' and are followed with the name of the feature after a dash. Generally these branches should be merged to master once the bug is fixed. If we have more than one person working on a bug they can create sub-branches named bug-[issue-ID]-[developer-name]-[purpose].

* version-[date in yyymmdd format] - Version integration branches, created from master whenever we decide we have reached all goals for a particular version, using the date the decision was made as part of the name. Must pass all tests when being tagged. (See below.)

* Version branches themselves are separately versioned using tags named [version-name].[version-number] where version-number follows the version name and a dot (.), starting at 0 and incremented for each version tag. For example, a version branch created on July 1, 2020 would be named 'version-20200701' and would have an initial tag of 'version-20200701.0'. If we later fixed a couple of bugs and backported a feature we would create a new tag of 'version-20200701.1' once all tests are passed. Metadata about the version should be included in the tag description.

* [version-name]-['feature' or 'bug']-[feature name or issue ID] Version branches being worked on to fix bugs in or to backport features from later versions. Branch names always start with the version name and then follow the feature or bug naming convention. These should be merged back to the original version branch and a new version tag created once they pass all tests.

* [developer-name]-[purpose] - Dev playground branches. Branch names always start with the developer name and are followed with the purpose of the branch after a dash. Generally these branches should never be merged to another branch. In most cases code created in these branches should be moved and integrated into a feature branch by hand in order to avoid introducing unintended dependencies.

## Copyright

SquidSpace, which includes squidspace.js, the associated tooling, and the documentation are 
copyright Jack William Bell 2020. All other content, including HTML files and 3D assets, are 
copyright their respective authors.
