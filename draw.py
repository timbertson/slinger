#!/usr/bin/env python3
import os, sys, subprocess
useful_paths = [
	'/usr/lib64/mutter',
	'/usr/lib64/gnome-shell',
]

for key in ['GI_TYPELIB_PATH', 'GJS_PATH', 'LD_LIBRARY_PATH']:
	os.environ[key] = ':'.join(useful_paths)
try:
	subprocess.check_call(['gup', '-u', 'extension/clutter_test.js'])
except subprocess.CalledProcessError:
	sys.exit(1)
os.execvp('gjs', ['gjs', 'extension/clutter_test.js'])
