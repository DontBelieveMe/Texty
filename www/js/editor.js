var addSelected = function(element) {
    if(element.className.indexOf(' btn-selected') > 0) {
        return;
    }
    
    element.className += ' btn-selected';
};
    
var removeSelected = function(element) {
    if(element.className.indexOf(' btn-selected') < 0) {
        return;
    }
    
    element.className = element.className.replace(' btn-selected', '');
};

var isSelected = function(element) {
    return element.className.indexOf(' btn-selected') > 0;
};

function subscribeItemBarButtonEvents() {
    var subscribe = function(elementId, opName, callback) {
        var element = document.getElementById(elementId);
        element.onclick = function() {
            if(callback) {
                callback(element);
            }
            
            document.execCommand(opName, false, null);
            document.getElementById('text-edit').focus();
        };
    };
    
    var subscribeToggleBtn = function(elementId, opName, callback) {
        
        subscribe(elementId, opName, function(element){
            if(callback) {
                callback(element);
            }
            if(isSelected(element)) {
                removeSelected(element);
            } else {
                addSelected(element);
            }
        });
    };
    
    var singleActiveItems = [];
    var subscribeSingleActive = function(elementId, opName, callback) {
        singleActiveItems.push(document.getElementById(elementId));
        
        var clearSingleItemSelection = function() {
            singleActiveItems.forEach(function(item, index, array) {
               removeSelected(item);
            });
        };
        
        subscribe(elementId, opName, function(element){
            if(callback) {
                callback(element);
            }
            
            clearSingleItemSelection();
            addSelected(element);
        });
    };
    
    subscribeToggleBtn('btn-list', 'insertUnorderedList');
    subscribeToggleBtn('btn-num-list', 'insertOrderedList');
    
    
    subscribeToggleBtn('btn-bold', 'bold');
    subscribeToggleBtn('btn-emp', 'italic');
    subscribeToggleBtn('btn-underline', 'underline');
    
    addSelected(document.getElementById('btn-left'));
    
    subscribeSingleActive('btn-center', 'justifyCenter');
    subscribeSingleActive('btn-left', 'justifyLeft');
    subscribeSingleActive('btn-right', 'justifyRight');
    subscribeSingleActive('btn-full', 'justifyFull');
};

function subscribeKeyEvents() {
    var toggleBtn = function(elementId) {
        var element = document.getElementById(elementId);
        if(isSelected(element)) {
            removeSelected(element);
        }
        else {
            addSelected(element);
        }
    };
    
    var KEY_B = 66,
        KEY_U = 85,
        KEY_I = 73;
    
    var shortcutMap = new Map();
    shortcutMap.set(KEY_B, 'btn-bold');
    shortcutMap.set(KEY_U, 'btn-underline');
    shortcutMap.set(KEY_I, 'btn-emp');
    
    document.onkeydown = function(e) {
        e = e || window.event;
        if(e.ctrlKey && shortcutMap.has(e.keyCode)) {
            toggleBtn(shortcutMap.get(e.keyCode));
        }
    };
};

function getSelectionParentElement() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var tag = range.startContainer.parentNode;
    return tag;
}

function subscribeUpdateButtonSelectionsOnClick() {
    var textEdit = document.getElementById('text-edit');
    var nodeMap = new Map();
    
    nodeMap.set('B', 'btn-bold');
    nodeMap.set('I', 'btn-emp');
    nodeMap.set('U', 'btn-underline');
    nodeMap.set('UL', 'btn-list');
    nodeMap.set('OL', 'btn-num-list');
    
    var removeSelectionById = function(id) {
        removeSelected(document.getElementById(id));
    };
    
    var selectItem = function(tag, doLiChecks) {
        var tmpTag = tag.parentNode;
        while(nodeMap.has(tmpTag.tagName) || tmpTag.tagName == 'LI') {
            selectItem(tmpTag);
            tmpTag = tmpTag.parentNode;
        }
        
        if(tag.tagName == 'LI') return;
        
        if(tag.tagName == 'UL' || tag.tagName == 'OL') {
            removeSelectionById('btn-list');
            removeSelectionById('btn-num-list');
        }
        
        var btnId = nodeMap.get(tag.tagName);
        addSelected(document.getElementById(btnId));
    };
    
                    
    var showSelectedStyles = function() {
        var tag = getSelectionParentElement();
        if(tag != null) {
            if(nodeMap.has(tag.tagName) || tag.tagName == 'LI') {
                selectItem(tag, true);
            } else {
                nodeMap.forEach(function(value, key, map) {
                    removeSelectionById(value);
                });
            }
        }
    };
    
    textEdit.onclick = function() {
        showSelectedStyles();
    };
    
    var navKeys = [
        38, 39, 40, 37, 13
    ];
    
    textEdit.onkeyup = function(e) {
        e = e || window.event;
        if(navKeys.includes(e.keyCode)) {
            showSelectedStyles();
        }
    }
};

window.onload = function() {
    subscribeItemBarButtonEvents();
    subscribeKeyEvents();
    subscribeUpdateButtonSelectionsOnClick();
};