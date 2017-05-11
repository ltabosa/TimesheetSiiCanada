/**Query to shows all projects*/
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', monthYearFieldFill);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieve);

});
/**
 * Retrieves the DGD project.
 */
function retrieve() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('MyTimesheet');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<OrderBy>' +
                                   '<FieldRef Name=\'Year\' Ascending=\'FALSE\' />' +
                                   '<FieldRef Name=\'MonthNumber\' Ascending=\'FALSE\' />' +
                                   '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
                                   '<FieldRef Name=\'ReportOwner\' Ascending=\'TRUE\' />' +
                                '</OrderBy>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                                '<FieldRef Name=\'Title\' />' +
                                '<FieldRef Name=\'Year\' />' +
                                '<FieldRef Name=\'Total\' />' +
                                '<FieldRef Name=\'Status\' />' +
                                '<FieldRef Name=\'ReportOwner\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, Title, Year, Total, Status, ReportOwner)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}
/**
 * On the query succeeded. Lists all the projects
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();

    var listInfo =
        "<table class='table table-striped'>" +
            "<tr>" +
                "<th class='col-md-1'></th>" +
                "<th>Employee</th>" +
                "<th>Year</th>" +
                "<th>Month</th>" +
                "<th>Total</th>" +
                "<th>Status</th>" +
                "<th class='col-md-1'></th>" +
            "</tr>";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        listInfo += "<tr>";

        listInfo += "<td class='col-md-1'><a href='ApproverEdit.aspx?ID=" + oListItem.get_id() + "&Status=" + oListItem.get_item('Status') + "&User=" + oListItem.get_item('ReportOwner').get_lookupValue() + "&Month=" + oListItem.get_item('Title') + "&Year=" + oListItem.get_item('Year') + "'><img src='../Images/EditIcon.png' /></a></td>";

        listInfo +=
           "<td>" + oListItem.get_item('ReportOwner').get_lookupValue() + "</td>" +
           "<td>" + oListItem.get_item('Year') + "</td>" +
           "<td>" + oListItem.get_item('Title') + "</td>" +
           "<td>" + oListItem.get_item('Total') + "</td>" +
           "<td>" + oListItem.get_item('Status') + "</td>" +
           "<td id='attachment" + oListItem.get_id() + "'></td>" +
        "</tr>";
        getAttachments(oListItem.get_id());
    }
    listInfo += "</table>";
    $("#results").html(listInfo);
}


function getAttachments(itemId) {
    var attachmentFiles;
    var htmlAttachment = "<span class='glyphicon glyphicon-paperclip' aria-hidden='true'></span>";
    var ctx = new SP.ClientContext.get_current();
    var web = ctx.get_web();
    var attachmentFolder = web.getFolderByServerRelativeUrl('Lists/MyTimesheet/Attachments/' + itemId);
    attachmentFiles = attachmentFolder.get_files();
    ctx.load(attachmentFiles);

    ctx.executeQueryAsync(function () {
        var i = 0;
        for (var file in attachmentFiles) {
            var attachmentUrl = attachmentFiles.itemAt(i).get_serverRelativeUrl();
            i++;
            $("#attachment" + itemId).html(htmlAttachment);
        }

    }, function () {
        //alert("sorry!");
    });
}

function monthYearFieldFill() {
    $('#txtMonth').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'MM',
        onClose: function (dateText, inst) {
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));
        }
    });
    $("#txtMonth").focus(function () {
        $(".ui-datepicker-year").hide();
    });
    $('#txtYear').datepicker({
        changeYear: true,
        dateFormat: 'yy',
        onClose: function (dateText, inst) {
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, 1));
        }
    });
    $("#txtYear").focus(function () {
        $(".ui-datepicker-month").hide();
    });
    var d = new Date();
    var n = d.getFullYear();
    document.getElementById('txtYear').value = n;
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('txtMonth').value = monthNames[d.getMonth()];
};

function downloadMonthFiles() {
    month = $('#txtMonth').val();
    year = $('#txtYear').val();

    var userId = _spPageContextInfo.userId;
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('MyTimesheet');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                "<Where><And><Eq><FieldRef Name='Attachments' /><Value Type='Attachments'>1</Value></Eq><And><Eq><FieldRef Name='Title' /><Value Type='Text'>" + month + "</Value></Eq><Eq><FieldRef Name='Year' /><Value Type='Text'>" + year + "</Value></Eq></And></And></Where>" +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceededDownload),
    Function.createDelegate(this, window.onQueryFailed));
}
function onQueryFailed(sender, args) {
    alert(args.get_message());
}

//take new count, fill array
function onQuerySucceededDownload(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {

        //update array
        var oListItem = listEnumerator.get_current();
        var itemId = oListItem.get_id();

        getWebProperties(itemId);

        ////save the number of lines to be deleted
        //deleteLineArray[count] = oListItem.get_id();
        ////count number of rows in list
        //count++;
        //var temp = count - 1;
        //var total = 0;
        //array[temp] = new Array(37);
        //array[temp][1] = oListItem.get_item('Project');
        //array[temp][2] = oListItem.get_item('DayType');
        //array[temp][3] = oListItem.get_item('HourType');

        //for (var j = 5; j < 36; j++) {
        //    array[temp][j] = oListItem.get_item('_x00' + (j - 4) + '_');
        //    total += array[temp][j];
        //}
        //array[temp][4] = total;
        //sumCol += total;

    }

    //Call this function to build the empty table.
    //newLineOfProject(count);
    //$('#totalHour').html(sumCol);
}

function getWebProperties(itemId) {

    var attachmentFiles;

    var ctx = new SP.ClientContext.get_current();

    var web = ctx.get_web();
    var attachmentFolder = web.getFolderByServerRelativeUrl('Lists/MyTimesheet/Attachments/' + itemId);
    attachmentFiles = attachmentFolder.get_files();
    ctx.load(attachmentFiles);

    ctx.executeQueryAsync(Function.createDelegate(this, onSuccess), Function.createDelegate(this, onFailed));

    function onSuccess(sender, args) {
        var zip = new JSZip();
        var i = 0;
        var html = "";
        var relativeUrl = "";
        for (var file in attachmentFiles) {
            $('#result').html(html);
            if (attachmentFiles.itemAt(i) != null) {
                if (attachmentFiles.itemAt(i).get_serverRelativeUrl()) {
                    relativeUrl = attachmentFiles.itemAt(i).get_serverRelativeUrl();
                }
                var fileName = String(relativeUrl);
                fileName = fileName.split("/");
                fileName = fileName[fileName.length - 1];
                //fileName = fileName[9];
                //html += "<p><a href='" + relativeUrl + "'>" + fileName + "</a>";
                //html += "<a onclick='deleteAttach(\"" + fileName + "\")' href='/'> Delete</a></p>";
                //window.location.href = relativeUrl;
                zip.file(fileName, "https://leonardotabosa-781f56b7558750.sharepoint.com" + relativeUrl);
            }
            i++;
        }
        zip.generateAsync({ type: "blob" })
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, month+year+ ".zip");
        });
    }

    function onFailed(sender, args) {
        //alert("sorry!");
    }
}