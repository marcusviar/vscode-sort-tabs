# Deprecated

This VScode extension is no longer maintained do to the lack of VScode API features needed to make it work correctly.

# sort-tabs

Sort tabs alphabetically and group by file extension.

## Only tabs opened after installing this extension will be sorted

Tabs are sorted on open only. After installing this extension please close all open tabs and reopen them to allow the extension to sort them.

## Please see the Know Issues section below

This extension does the best it can to sort tabs. However, it is limited by what the VS Code API makes available to it. Which isn't much in regards to sorting tabs.

## Features

* Sorts opened files (tabs) alphabetically and groups them by file extension.
* Works with all files that VS Code deems to be a text file.
* Works with files with no extension.
* Works with files with no name. Example: .htaccess
* Optional status bar message informing you when tab sorting is done. Usually instantaneous.

## Demo

![sort-tabs](https://user-images.githubusercontent.com/36222663/88467787-74ed0100-cea0-11ea-94be-7c45372d3a66.gif)

## Extension Settings

sort-tabs contributes the following settings:

* `sort-tabs.showStatusbarMessage`: `True` show statusbar message after a tab is sorted. `False` don't show statusbar message
* `sort-tabs.statusbarMessageAlignment`: Changes to this value require a VScode reload. `Left` to display statusbar message on the left. `Right` to display the statusbar message on the right.
* `sort-tabs.statusbarMessagePriority`: Changes to this value require a VScode reload. Higher value means the statusbar message should be shown more to the left. Example: With a `sort-tabs.statusbarMessageAlignment` set to `Left` and a `sort-tabs.statusbarMessagePriority` set to `1000` the statusbar message will be displayed on the left side of the statusbar on the left side of other, left aligned, statusbar items (unless another statusbar item has a priority higher than 1000).
* `sort-tabs.statusbarMessageColor`: Hex or RGB color code for the status bar message text
* `sort-tabs.statusbarMessageDuration`: Duration in milliseconds to display the status bar message

## Known Issues

> Most of these issues exist because of limitations with the VS Code API.

* It's important to let tab sorting finish before interacting with the editor. The optional statusbar message tells you when sorting is done. This is usually instantaneous for most files.

* If you open a file that will have other actions done to it by other extensions, the tab will not be sorted until after all other extension's actions are finished. The problem with this happens if you click to a different tab before the other actions are finished. The currently active tab will be moved to the position the original tab was suppose to get. Currently the only solution for this is to close and reopen both tabs and not switch tabs until the opened tab is moved into it's correct position. This usually only happens with very large files.

* Tabs can only be sorted if they are opened after this extension is enabled. This is because the VS Code API allows an extension to access only the currently active tab. The alternative would be to have the extension visibly cycle through all open tabs with a delay in between each tab allowing it time to load, which sort-tabs does not do. The solution is close and reopen all tabs after enabling this extension.

* If a file is already open in a different window, it can not be sorted in the new window because the VS Code API will not notify the extension that it is opened again.

* If you manually move tabs around it can make subsequent opened tabs not sort correctly. This is because the extension keeps an internal array containing the order of tabs. The VS Code API does not have an "on tab move" event. So there is no way for the extension to know that you moved a tab.

* Currently, if you switch to a different project in the same window and back again, subsequent opened tabs will not sort correctly. This is because the internal array tracking tab order is not persisted between projects. To bypass this problem you could open a new VS Code window for each project. Or close all tabs and reopen them.

* If you use an extension that limits the number of tabs you can have open at a time it may interfere with sorting tabs.

* Tabs are only sorted if opened one at a time.

* Only text documents are sorted. Other files such as images are not sorted.

## Bugs

**Please note: Most bugs can not be fixed unless the VS Code API changes to allow more access to tabs and open files other than the currently active file.**

If you think a bug is fixable please open an [issue](https://github.com/marcusviar/vscode-sort-tabs/issues) on GitHub.

## Source

[Open source on GitHub](https://github.com/marcusviar/vscode-sort-tabs)

## Release Notes

### 1.0.0

Initial release of sort-tabs

## License

MIT License

Copyright (c) 2020 marcusviar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
