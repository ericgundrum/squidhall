import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
os.chdir( "../" )
server = HTTPServer(('', 8000), SimpleHTTPRequestHandler)
server.serve_forever()
