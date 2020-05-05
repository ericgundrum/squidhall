# Squid Hall

This is a project to create a virtual 'exhibits hall' for ConZealand.

Note for Developer
* master - The main branch with the mainline code for the latest version, does not need to pass tests. Once we have a 'version' that does pass tests we create a version branch as described below.

* feature-[feature-name] - Feature-specific development branches. Branch names always start with 'Feature' and are followed with the name of the feature after a dash. Generally these branches should be merged to master once the feature is working. If we have more than one person working on a feature they can create sub-branches named feature-[feature-name]-[developer-name]-[purpose].

* bug-[issue-ID] - Bug/Issue-specific development branches. Branch names always start with 'Feature' and are followed with the name of the feature after a dash. Generally these branches should be merged to master once the bug is fixed. If we have more than one person working on a bug they can create sub-branches named bug-[issue-ID]-[developer-name]-[purpose].

* version-[date in yyymmdd format] - Version branches, created from master whenever we decide we have reached all goals for a particular version, using the date the decision was made as part of the name. Must pass all tests when being tagged. (See below.)

* Version branches themselves are separately versioned using tags named [version-name].[version-number] where version-number follows the version name and a dot (.), starting at 0 and incremented for each version tag. For example, a version branch created on July 1, 2020 would be named 'version-20200701' and would have an initial tag of 'version-20200701.0'. If we later fixed a couple of bugs and backported a feature we would create a new tag of 'version-20200701.1' once all tests are passed.

* [version-name]-['feature' or 'bug']-[feature name or issue ID] Version branches being worked on to fix bugs in or to backport features from later versions. Branch names always start with the version name and then follow the feature or bug naming convention. These should be merged back to the original version branch and a new version tag created once they pass all tests.

* [developer-name]-[purpose] - Dev playground branches. Branch names always start with the developer name and are followed with the purpose of the branch after a dash. Generally these branches should never be merged to another branch. In most cases code created in these branches should be moved and integrated into other branches by hand in order to avoid introducing unintended dependencies.
