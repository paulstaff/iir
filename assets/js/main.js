
$(document).ready(function() {
    testItems();
});

function addItem() {

    var title = "Add Item";

    var content =   '<div class="modalBody">' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>Title</label>' +
                    '           <input type="text" id="itemTitle">' +
                    '           <div class="formWarning" id="itemTitleWarning">Please enter a Title</div> ' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>Request Type</label>' +
                    '           <select class="psDropdown" id="itemType">' +
                    '               <option value="GET">GET</option>' +
                    '               <option value="POST">POST</option>' +
                    '           </select>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>URI</label>' +
                    '           <input type="text" id="itemURI">' +
                    '           <div class="formWarning" id="itemURIWarning">Please enter the URI</div> ' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="modalFooter">' +
                    '   <div class="modalBtn" onclick="processItem(\'addItem\')">Add Item</div>' +
                    '   <div class="modalBtn" onclick="psModal.close()">Cancel</div>' +
                    '</div>';

    var options = {
        width: 600
    };

    psModal.open(title, content, options);
}

function editItem(itemId, itemTitle, itemType, itemURI) {

    var title = "Edit Item";

    var content =   '<div class="modalBody">' +
                    '   <input type="hidden" id="itemId" value="' + itemId + '">' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>Title</label>' +
                    '           <input type="text" id="itemTitle" value="' + itemTitle + '">' +
                    '           <div class="formWarning" id="itemTitleWarning">Please enter a Title</div> ' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>Request Type</label>' +
                    '           <select class="psDropdown" id="itemType">' +
                    '               <option value="GET">GET</option>' +
                    '               <option value="POST">POST</option>' +
                    '           </select>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>URI</label>' +
                    '           <input type="text" id="itemURI" value="' + itemURI + '">' +
                    '           <div class="formWarning" id="itemURIWarning">Please enter the URI</div> ' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="modalFooter">' +
                    '   <div class="modalBtn" onclick="processItem(\'editItem\')">Save Item</div>' +
                    '   <div class="modalBtn" onclick="psModal.close()">Cancel</div>' +
                    '</div>';

    var options = {
        width: 600
    };

    psModal.open(title, content, options);
}

function processItem(action) {

    var itemTitle = $("#itemTitle").val();
    var itemType = $("#itemType").val();
    var itemURI = $("#itemURI").val();

    var itemTitleWarning = $("#itemTitleWarning");
    var itemURIWarning = $("#itemURIWarning");

    var err = false;

    itemTitleWarning.hide();
    itemURIWarning.hide();

    if(itemTitle.length <= 0) {
        itemTitleWarning.show();
        err = true;
    }

    if(itemURI.length <= 0) {
        itemURIWarning.show();
        err = true;
    }

    if(!err) {

        var request = {
            action: action,
            payload: {
                title: itemTitle,
                type: itemType,
                uri: itemURI
            }
        };

        if(action == "editItem") {
            request.payload.id = $("#itemId").val();
        }

        var success = function() {
            psModal.close();
            testItems();
        };

        apiRequest(request, success);
    }
}

function removeItem(itemId) {

    var request = {
        action: "removeItem",
        payload: {
            id: itemId
        }
    };

    var success = function() {
        testItems();
    };

    apiRequest(request, success);
}

function testItems() {

    var request = {
        action: "testItems"
    };

    var success = function(data) {

        var itemList = data.body;

        var list = $("#list");

        list.empty();

        for(var key in itemList) {

            var code = itemList[key].error == true ? "Err" : itemList[key].response.http_code;
            var codeClass = "";

            if (code >= 200 && code < 300) {
                codeClass = "good";
            } else if (code >=300 && code < 400) {
                codeClass = "ok";
            } else {
                codeClass = "bad";
            }

            var item =  '<div class="item" id="' + key + '">' +
                        '   <div class="status ' + codeClass + '">' + code + '</div>' +
                        '   <div class="info">' +
                        '       <div class="title">' + itemList[key].title + '</div>' +
                        '       <div class="uri"><strong>' + itemList[key].type + '</strong> <a href="' + itemList[key].uri + '">' + itemList[key].uri + '</a></div>' +
                        '   </div>' +
                        '   <div class="btn btnAction" onclick="toggleDetails(\'' + key + '\')">&#xf412</div>' +
                        '   <div class="btn btnAction" onclick="editItem(\'' + key + '\', \'' + itemList[key].title + '\', \'' + itemList[key].type + '\', \'' + itemList[key].uri + '\')">&#xf411</div>' +
                        '   <div class="btn btnAction" onclick="removeItem(\'' + key + '\')">&#xf407</div>' +
                        '</div>';

            list.append(item);

            var details = "";

            if (itemList[key].error == true) {
                details =   '<div class="item details" id="' + key +'-details">' +
                            '   <div class="info"><strong>Error Code:</strong> ' + itemList[key].response.code + '</div>' +
                            '   <div class="info"><strong>Error Text:</strong> ' + itemList[key].response.text + '</div>' +
                            '</div>';
            } else {
                details =   '<div class="item details" id="' + key + '-details">' +
                            '   <div class="info"><strong>Content Type:</strong> ' + itemList[key].response.content_type + '</div>' +
                            '   <div class="info"><strong>Total Time:</strong> ' + itemList[key].response.total_time + '</div>' +
                            '   <div class="info"><strong>Size:</strong> ' + itemList[key].response.size_download + '</div>' +
                            '   <div class="info"><strong>Download Speed:</strong> ' + itemList[key].response.speed_download + '</div>' +
                            '   <div class="info"><strong>IP Address:</strong> ' + itemList[key].response.primary_ip + '</div>' +
                            '   <div class="info"><strong>Port:</strong> ' + itemList[key].response.primary_port + '</div>' +
                            '   <div class="info"><strong>Original URL:</strong> ' + itemList[key].response.url + '</div>' +
                            '   <div class="info"><strong>Redirect URL:</strong> ' + itemList[key].response.redirect_url + '</div>' +
                            '</div>';
            }

            list.append(details);
        }

        if(itemList.length == 0) {

            var empty = '<div class="text">No items to test =(.</div><div class="text"> Why don\'t you <a onclick="addItem()">Add One</a>?</div>';
            list.append(empty);
        }
    };

    var loading = '<div class="text">Loading...</div>';
    var list = $("#list");

    list.empty();
    list.append(loading);

    apiRequest(request, success);
}

function apiRequest(request, success) {
    $.post("api.php", {request: JSON.stringify(request) }, success, "json");
}

function toggleDetails(itemId) {
    $("#" + itemId + "-details").toggle();
}

function toggleAllDetails() {
    $(".item.details").toggle();
}

function updateSettings() {

    var title = "Settings";

    var content =   '<div class="modalBody">' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>Password</label>' +
                    '           <input type="text" id="pass">' +
                    '           <div class="formWarning" id="passWarning">Please enter a Password</div> ' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="formRow">' +
                    '       <div class="formItem">' +
                    '           <label>Confirm Password</label>' +
                    '           <input type="text" id="passConfirm">' +
                    '           <div class="formWarning" id="passConfirmWarning">Passwords do not match</div> ' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="modalFooter">' +
                    '   <div class="modalBtn" onclick="processItem(\'addItem\')">Add Item</div>' +
                    '   <div class="modalBtn" onclick="psModal.close()">Cancel</div>' +
                    '</div>';

    var options = {
        width: 600
    };

    psModal.open(title, content, options);

}