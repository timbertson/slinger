<img src="http://gfxmonk.net/dist/status/project/slinger.png">

# Overview:

Slinger was born out of [shellshape](https://github.com/timbertson/shellshape/), a Gnome Shell extension I created for automatically tiling windows. Shellshape is useful, but it's also buggy and has a lot of ugly interactions with the window system (which itself has plenty of bugs).

Slinger is a simpler layout utility, which maintains many of the window manipulation shortcuts but explicitly does not do any automatic window management - it only does something when you tell it to.

In practice, I've found that slinger is slightly slower than shellshape, but allows me more control (it never gets in my way, and I end up with windows just as I want them rather than "close enough").

Truthfully, slinger was created because shellshape is not worth my time to maintain. There are many unfixable bugs due to the interaction with gnome-shell, and there is a frustrating amount of bookkeeping state and workarounds that need to be maintained so shellshape has an accurate view of the world at all time. Slinger was designed to be stateless, which makes for a simpler codebase with less bugs.

# OSX version

Another benefit of a stateless app is that it's more easily portable to different window systems. There is an OSX version [here](https://github.com/timbertson/Slinger.app), which lacks a few features, but mostly works.

### Global hotkeys

 - win+a: show slinger
 - win+shift+8 (asterisk): splat windows - applies a basic tiling layout so you can see all windows
 - win+z: toggle maximize
 - win+j: next window
 - win+k: previous window
 - win+shift+j: swap with next
 - win+shift+k: swap with previous
 - win+alt+j: next workspace
 - win+alt+k: previous workspace
 - win+alt+shift+j: bring window to next workspace
 - win+alt+shift+k: bring window to previous workspace

### Slinger menu:

 - inner ring: maximize / minimize
 - sides: half screen (top/bottom/left/right)
 - diagonals: quarter screen

 - arrows / hjkl: select a preset
 - space/tab: enter modify mode

### Modify mode:

 - ctrl+move: move window
 - alt+move: resize closest corner

### Modifiers:

These can be uses as-is in "modify mode", or used globally (without showing slinger) by also holding down win (super)

 - equals: shrink
 - minus: grow
 - h: move left
 - l: move right
 - u: move down
 - i: move up
 - shift+h: shrink horizontal
 - shift+l: grow horizontal
 - shift+i: shrink vertical
 - shift+u: grow vertical


