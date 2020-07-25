'use strict';

const vscode = require('vscode');
/**
 * Runs on sort-tabs extension activation
 * @param {vscode.ExtensionContext} context
 * @since 1.0.0
 */
function activate(context) {

    let openFiles = [];
    let openFilesByExt = {};
    let alreadyPositioned = [];
    let statusBarTimeOut;

    /**
     * Sorts filenames alphabetically. Used on openFilesByExt.
     * @since 1.0.0
     */
    function sortFileNames(filenamesWithoutExt) {
        filenamesWithoutExt.sort(
            (a, b) => a.localeCompare(b, undefined, { numeric: true })
        );
        return filenamesWithoutExt;
    }

    /**
     * Gets array key by value.
     * @since 1.0.0
     */
    function getArrayKey(arr, val) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i] === val)
                return i;
        return false;
    }

    /**
     * Gets file extension from file path
     * @since 1.0.0
     */
    function getExtension(path) {
        var a = path.split(".");
        if (a.length === 1 || (a[0] === "" && a.length === 2)) {
            // if file has no extension
            return "";
        }
        // return extension
        return a.pop();
    }

    /**
     * Splits file path into parts
     * @since 1.0.0
     */
    function splitPath(fullPath) {
        let orgFullPath = fullPath;
        let extension = getExtension(fullPath);
        // if file has no extension
        if (extension == '') {
            // assign placeholder extension
            extension = 'tempext';
            // update fullPath
            fullPath = fullPath + '.' + extension;
        }
        let fileNameWithExt = fullPath.split('\\').pop().split('/').pop();
        // if file has no name. set name to  current date in milliseconds
        if (fileNameWithExt == '.' + extension) {
            // tempFileName = orgFullPath without extension and with all non alpha numeric characters removed
            let tempFileName = orgFullPath.replace(/\.[^/.]+$/, "").replace(/\W/g, '');
            fileNameWithExt = tempFileName + '.' + extension;
        }
        let filenameWithoutExt = fileNameWithExt.replace(/\.[^/.]+$/, "");
        let pathInfo = {
            orgFullPath: orgFullPath,
            fullPath: fullPath,
            fileNameWithExt: fileNameWithExt,
            filenameWithoutExt: filenameWithoutExt,
            extension: extension
        };
        return pathInfo;
    }

    // get user defined statusbarMessageAlignment setting
    let statusbarMessageAlignment = vscode.workspace.getConfiguration().get('sort-tabs.statusbarMessageAlignment');

    // make sure first letter of statusbarMessageAlignment is capitalized
    statusbarMessageAlignment = statusbarMessageAlignment[0].toUpperCase() + statusbarMessageAlignment.slice(1);

    // get user defined statusbarMessagePriority setting
    let statusbarMessagePriority = vscode.workspace.getConfiguration().get('sort-tabs.statusbarMessagePriority');

    // create statusbar item for statusbar message
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment[statusbarMessageAlignment], statusbarMessagePriority);

    // on text tab close
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(
            (editor) => {
                let pathInfo = splitPath(editor.fileName.toLowerCase());
                // let pathInfo = splitPath(editor[0]._documentData._document.fileName.toLowerCase());
                let position = openFiles.indexOf(pathInfo.filenameWithoutExt + '.' + pathInfo.extension);
                if (position > -1) {
                    // remove file from openFiles
                    openFiles.splice(getArrayKey(openFiles, pathInfo.filenameWithoutExt + '.' + pathInfo.extension), 1);
                    // remove file from alreadyPositioned
                    let removed = alreadyPositioned.splice(getArrayKey(alreadyPositioned, pathInfo.fullPath), 1);
                    // remove file from openFilesByExt
                    openFilesByExt[pathInfo.extension].splice(getArrayKey(openFilesByExt[pathInfo.extension], pathInfo.filenameWithoutExt), 1);
                }
            }
        )
    );

    // on text tab open 
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((editor) => {
        if (editor != undefined) {
            let positionFinderVal;
            let newPosition = 1;
            let pathInfo = splitPath(editor.fileName.toLowerCase());
            // only sort newly opened tabs
            if (alreadyPositioned.indexOf(pathInfo.fullPath) == -1) {
                alreadyPositioned.push(pathInfo.fullPath);
                if (openFiles.length > 0) {
                    // create and add to openFilesByExt obj
                    if (typeof openFilesByExt[pathInfo.extension] == 'undefined') {
                        // create new array
                        openFilesByExt[pathInfo.extension] = [];
                        openFilesByExt[pathInfo.extension].push(pathInfo.filenameWithoutExt);
                    } else {
                        // add to array
                        openFilesByExt[pathInfo.extension].push(pathInfo.filenameWithoutExt);
                    }

                    if (openFilesByExt[pathInfo.extension].length > 1) {
                        // sort extension array alphabetically
                        openFilesByExt[pathInfo.extension] = sortFileNames(openFilesByExt[pathInfo.extension]);

                        // get position in extension array. +1 to account for zero indexed array
                        let openFilesByExtNewPosition = getArrayKey(openFilesByExt[pathInfo.extension], pathInfo.filenameWithoutExt) + 1;

                        if (openFilesByExtNewPosition == 1) {
                            // if at start of extension array
                            // get val to right
                            positionFinderVal = openFilesByExt[pathInfo.extension][1] + '.' + pathInfo.extension;
                            // position before positionFinderVal
                            newPosition = getArrayKey(openFiles, positionFinderVal) + 1;
                        } else if (openFilesByExtNewPosition == openFilesByExt[pathInfo.extension].length) {
                            // if at end of extension array
                            // get val to left
                            positionFinderVal = openFilesByExt[pathInfo.extension][openFilesByExt[pathInfo.extension].length - 2] + '.' + pathInfo.extension;
                            // position after positionFinderVal
                            newPosition = getArrayKey(openFiles, positionFinderVal) + 2;
                        } else {
                            // if in middle of extension array
                            // get val to left
                            positionFinderVal = openFilesByExt[pathInfo.extension][openFilesByExtNewPosition] + '.' + pathInfo.extension;
                            // position after positionFinderVal
                            newPosition = getArrayKey(openFiles, positionFinderVal) + 1;
                        }
                    } else {
                        // position at end of tabs
                        newPosition = openFiles.length + 1;
                    }

                    // add fileNameWithExt to openFiles
                    openFiles.splice(newPosition - 1, 0, pathInfo.fileNameWithExt);

                    // move tab
                    vscode.commands.executeCommand('moveActiveEditor', { to: "position", value: parseInt(newPosition) })
                        .then(() => {
                            // get user defined showStatusbarMessage setting
                            let showStatusbarMessage = vscode.workspace.getConfiguration().get('sort-tabs.showStatusbarMessage');
                            if (showStatusbarMessage == true) {
                                // clear timeout for possible previous status bar message
                                clearTimeout(statusBarTimeOut);
                                // get user defined statusBarMessageColor from settings
                                let statusBarMessageColor = vscode.workspace.getConfiguration().get('sort-tabs.statusbarMessageColor');
                                if (statusBarMessageColor === null) {
                                    // if statusBarMessageColor is unset. Revert to default
                                    statusBarItem.color = '';
                                } else {
                                    // set user defined statusBarMessageColor
                                    statusBarItem.color = statusBarMessageColor;
                                }
                                // set status bar message text
                                statusBarItem.text = 'Tab Sorted: ' + pathInfo.orgFullPath;
                                // show status bar message after tab is sorted
                                statusBarItem.show();
                                // get user defined showStatusbarDuration setting
                                let statusbarMessageDuration = vscode.workspace.getConfiguration().get('sort-tabs.statusbarMessageDuration');
                                if (!statusbarMessageDuration) {
                                    statusbarMessageDuration = 4000;
                                }
                                // hide status bar message after user defined length in milliseconds
                                statusBarTimeOut = setTimeout(function () {
                                    statusBarItem.hide();
                                }, statusbarMessageDuration);
                            }
                        });

                } else {
                    // push first opened file into openFiles and openFilesByExt
                    openFiles.push(pathInfo.fileNameWithExt);
                    openFilesByExt[pathInfo.extension] = [];
                    openFilesByExt[pathInfo.extension].push(pathInfo.filenameWithoutExt);
                }
            }
        }
    }));

}
exports.activate = activate;

/**
 * Runs on sort-tabs extension deactivation
 * @since 1.0.0
 */
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
