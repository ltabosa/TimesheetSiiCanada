/**Query to shows all projects*/
$(document).ready(function () {
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
                                    '<FieldRef Name=\'Title\' Ascending=\'FALSE\' />' +
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
                "<th class='col-md-1'></th>" +
                "<th>Employee</th>" +
                "<th>Month</th>" +
                "<th>Year</th>" +
                "<th>Total</th>" +
                "<th>Status</th>" +
            "</tr>";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        listInfo += "<tr>";


        listInfo += "<td class='col-md-1'><a href='ApproverEdit.aspx?ID=" + oListItem.get_id() + "&Status=" + oListItem.get_item('Status') + "&User=" + oListItem.get_item('ReportOwner').get_lookupValue() + "&Month=" + oListItem.get_item('Title') + "&Year=" + oListItem.get_item('Year') + "'><img src='../Images/EditIcon.png' /></a></td>";

        listInfo += "<td id='attachment" + oListItem.get_id() + "'></td>";

        getAttachments(oListItem.get_id());

        listInfo +=
           "<td>" + oListItem.get_item('ReportOwner').get_lookupValue() + "</td>" +
           "<td>" + oListItem.get_item('Title') + "</td>" +
           "<td>" + oListItem.get_item('Year') + "</td>" +
           "<td>" + oListItem.get_item('Total') + "</td>" +
           "<td>" + oListItem.get_item('Status') + "</td>" +
        "</tr>";
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