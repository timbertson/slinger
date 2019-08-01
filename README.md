
# Slinger

![Slinger Extension](http://gfxmonk.net/dist/status/project/slinger.png)

![Slinger Icon](img/icon.png){:height="128px" width="128px"}

### Overview

Slinger is a simple app for window manipulation. It provides multiple methods (via both mouse and keyboard) for moving and sizing windows quickly. 
The main interface is a circular popup menu which allows quick selection of various presets (half screen + quarter screen), plus plenty of mouse + keyboard shortcuts for moving & resizing.
[**Here's a quick screencast**](https://www.youtube.com/watch?v=JnZDxHSlQKM).

---

### Global hotkeys

| Category | Slinger Shotcut                                               | Action                              |
|----------|:-------------------------------------------------------------:|-------------------------------------|
| Arrange  | <kbd>Win</kbd>+<kbd>W</kbd>                                   | Show arrange window menu            |
|          | <kbd>Win</kbd>+<kbd>G</kbd>                                   | Distribute/tile/splat windows       |
|          | <kbd>Win</kbd>+<kbd>F</kbd>                                   | Fill available space with window    |
| Move     | <kbd>Win</kbd>+<kbd>Ctrl</kbd>+<kbd>Right</kbd>               | Move window right                   |
|          | <kbd>Win</kbd>+<kbd>Ctrl</kbd>+<kbd>Left</kbd>                | Move window left                    |
|          | <kbd>Win</kbd>+<kbd>Ctrl</kbd>+<kbd>Up</kbd>                  | Move window up                      |
|          | <kbd>Win</kbd>+<kbd>Ctrl</kbd>+<kbd>Down</kbd>                | Move window down                    |
| Swap     | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Right</kbd>                | Swap with next window               |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Left</kbd>                 | Swap with previous window           |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Up</kbd>                   | Swap with largest window            |
| Resize   | <kbd>Win</kbd>+<kbd>Plus</kbd>                                | Increase window's size              |
|          | <kbd>Win</kbd>+<kbd>Minus</kbd>                               | Decrease window's size              |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Plus</kbd>                 | Increase window's width             |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Minus</kbd>                | Decrease window's width             |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Multiply</kbd>             | Increase window's height            |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Divide</kbd>               | Decrease window's height            |
| State    | <kbd>Win</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd>                  | Un-minimize last window             |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>H</kbd>                    | Toggle windows maximized            |
| Focus    | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Tab</kbd>                  | Change focus to the next window     |
|          | <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Tab</kbd> | Change focus to the previous window |

### Slinger menu

| Menu Control                            | Action                              |
|-----------------------------------------|-------------------------------------|
| Inner ring                              | Maximize / minimize                 |
| Sides                                   | Half screen (top/bottom/left/right) |
| Diagonals                               | Quarter screen                      |
| <kbd>Arrows</kbd> / <kbd>H/J/K/L</kbd>  | Select a preset                     |
| <kbd>Space</kbd> / <kbd>Tab</kbd>       | Enter modify mode                   |

### Modify mode

|             Keyboard            |         Action        |
|:-------------------------------:|:---------------------:|
| <kbd>Ctrl</kbd>+<kbd>Move</kbd> |      Move window      |
|  <kbd>Alt</kbd>+<kbd>Move</kbd> | Resize closest corner |

### Modifiers

These can be uses as-is in "modify mode":

|            Keyboard           |       Action      |
|:-----------------------------:|:-----------------:|
|        <kbd>Plus</kbd>        |       Shrink      |
|        <kbd>Minus</kbd>       |        Grow       |
|          <kbd>H</kbd>         |     Move left     |
|          <kbd>L</kbd>         |     Move right    |
|          <kbd>U</kbd>         |     Move down     |
|          <kbd>I</kbd>         |      Move up      |
| <kbd>Shift</kbd>+<kbd>H</kbd> | Shrink horizontal |
| <kbd>Shift</kbd>+<kbd>L</kbd> |  Grow horizontal  |
| <kbd>Shift</kbd>+<kbd>I</kbd> |  Shrink vertical  |
| <kbd>Shift</kbd>+<kbd>u</kbd> |   Grow vertical   |

### Related gnome hotkeys

| Slinger Actions |         Key Combination        |              Hotkeys             | Gnome Related     |         Key Combination         |                             Hotkeys                            |
|-----------------|:------------------------------:|:--------------------------------:|-------------------|:-------------------------------:|:--------------------------------------------------------------:|
| Move Window     | <kbd>Win</kbd>+<kbd>Ctrl</kbd> | <kbd>Left</kbd> <kbd>Right</kbd> | Tile/Split Window |          <kbd>Win</kbd>         |                <kbd>Left</kbd> <kbd>Right</kbd>                |
| Swap Window     |  <kbd>Win</kbd>+<kbd>Alt</kbd> | <kbd>Left</kbd> <kbd>Right</kbd> | Move to Screen    |          <kbd>Win</kbd>         | <kbd>Left</kbd> <kbd>Right</kbd> <kbd>Up</kbd> <kbd>Down</kbd> |
| Move Window     | <kbd>Win</kbd>+<kbd>Ctrl</kbd> |   <kbd>Up</kbd> <kbd>Down</kbd>  | Move to Workspace | <kbd>Win</kbd>+<kbd>Shift</kbd> | <kbd>PgDn</kbd> <kbd>PgUp</kbd> <kbd>Home</kbd> <kbd>End</kbd> |
| Resize Window   |  <kbd>Win</kbd>+<kbd>Alt</kbd> | <kbd>Plus</kbd> <kbd>Minus</kbd> | Zoom              |  <kbd>Win</kbd>+<kbd>Alt</kbd>  |                <kbd>Plus</kbd> <kbd>Minus</kbd>                |
| Un-minimize     |         <kbd>Win</kbd>         |   <kbd>Shift</kbd>+<kbd>H</kbd>  | Minimize / Hide   |          <kbd>Win</kbd>         |                          <kbd>H</kbd>                          |

### Deprecated hotkeys

Hotkeys with similar functionality in gnome shell.

|                           Keyboard                          | Action                             |                                                  Gnome Similar                                                  |
|:-----------------------------------------------------------:|------------------------------------|:---------------------------------------------------------------------------------------------------------------:|
| <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> | Minimize window                    |                                            <kbd>Win</kbd><kbd>H</kbd>                                           |
|          <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>J</kbd>         | Next workspace                     |                  <kbd>Win</kbd>+<kbd>PgDn</kbd> <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Down</kbd>                  |
|          <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>K</kbd>         | Previous workspace                 |                   <kbd>Win</kbd>+<kbd>PgUp</kbd> <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Up</kbd>                   |
| <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> | Bring window to next workspace     | <kbd>Win</kbd>+<kbd>Shift</kbd>+<kbd>PgDn</kbd> <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Down</kbd> |
| <kbd>Win</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd> | Bring window to previous workspace |  <kbd>Win</kbd>+<kbd>Shift</kbd>+<kbd>PgUp</kbd> <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Up</kbd>  |

---

### Build/install instructions

Install required dependencies:

* `tsc` (typescript)

Compile:

```bash
tools/gup compile -v
```

Install:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/slinger@gfxmonk.net/schemas
cp  --verbose $PWD/extension/*.* ~/.local/share/gnome-shell/extensions/slinger@gfxmonk.net/
cp  --dereference --verbose $PWD/extension/schemas/*.* ~/.local/share/gnome-shell/extensions/slinger@gfxmonk.net/schemas/
```

---

### History

Slinger was born out of [shellshape](https://github.com/timbertson/shellshape/), a Gnome Shell extension I created for automatically tiling windows. Shellshape is useful, but it's also buggy and has a lot of ugly interactions with the window system (which itself has plenty of bugs).

Slinger is a simpler layout utility, which maintains many of the window manipulation shortcuts but explicitly does not do any automatic window management - it only does something when you tell it to.

In practice, I've found that slinger is slightly slower than shellshape, but allows me more control (it never gets in my way, and I end up with windows just as I want them rather than "close enough").

Truthfully, slinger was created because shellshape is not worth my time to maintain. There are many unfixable bugs due to the interaction with gnome-shell, and there is a frustrating amount of bookkeeping state and workarounds that need to be maintained so shellshape has an accurate view of the world at all time. Slinger was designed to be stateless, which makes for a simpler codebase with less bugs.

# OSX version

Another benefit of a stateless app is that it's more easily portable to different window systems. There is an OSX version [here](https://github.com/timbertson/Slinger.app), which lacks a few features, but mostly works.

<kbd>&nbsp;&nbsp;⊞&nbsp;&nbsp;</kbd>
<kbd>&nbsp;&nbsp;▲&nbsp;&nbsp;</kbd>
<kbd>&nbsp;&nbsp;▼&nbsp;&nbsp;</kbd>
<kbd>&nbsp;&nbsp;◀&nbsp;&nbsp;</kbd>
<kbd>&nbsp;&nbsp;▶&nbsp;&nbsp;</kbd>
<kbd>&nbsp;&nbsp;**+**&nbsp;&nbsp;</kbd>
<kbd>&nbsp;&nbsp;**-**&nbsp;&nbsp;</kbd>
