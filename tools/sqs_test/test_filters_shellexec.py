import unittest
import sys
from os import path
from filecmp import cmp
sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
from sqs.filters.shellexec import filter
from sqs.common import ScratchDirManager

copyFilterOptions = {
    "command-template": "cp {pathIn} {pathOut}"
}

class TestFilterShellExec(unittest.TestCase):

    def test_copyfilter(self):
        # Create scratch dir and add file.
        sd = ScratchDirManager("sqs_test/scratch")
        fp1 = sd.getTempFilePath(".txt")
        fp2 = sd.getTempFilePath(".txt")
        file = open(fp1, "w") 
        file.write("This is a temporary test text file.") 
        file.close()
        
        # Execute the filter.
        self.assertTrue(filter(fp1, fp2, copyFilterOptions))
        
        # Double check the files are the same.
        self.assertTrue(cmp(fp1, fp2))
        
        # Clean up dir.
        sd.remove()

    def test_copyfilterNoFile(self):
        # Execute the filter.
        self.assertFalse(filter("sqs_test/scratch/test.md", "sqs_test/scratch/test1.md", copyFilterOptions))

    # TODO: More tests. Test 'command-arguments' option.

if __name__ == '__main__':
    unittest.main()

