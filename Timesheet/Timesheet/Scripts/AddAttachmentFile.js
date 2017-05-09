'use strict';

//ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");//adicionar na pagina de novo TS e tbm na pagina de edicao de TS
ExecuteOrDelayUntilScriptLoaded(getWebProperties, "SP.js");//adicionar na pagina de edicao de timesheet

function attachFileToMyTimesheet(userId, monthSubmit, yearSubmit) {

    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('MyTimesheet');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<Where>' +
                                    '<And>' +
                                        '<And>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'Title\'/>' +
                                                '<Value Type=\'Text\'>' + monthSubmit + '</Value>' +
                                            '</Eq>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'Year\'/>' +
                                                '<Value Type=\'Text\'>' + yearSubmit + '</Value>' +
                                            '</Eq>' +
                                        '</And>' +
                                         '<Eq>' +
                                             '<FieldRef Name=\'ReportOwner\' LookupId=\'TRUE\'/>' +
                                             '<Value Type=\'User\'>' + userId + '</Value>' +
                                         '</Eq>' +
                                     '</And>' +
                                '</Where>' +
                            '<OrderBy>' +
                                '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
                                '</OrderBy>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceededAddFileToListMyTimesheet),
    Function.createDelegate(this, window.onQueryFailedToTakeId));
}
function onQueryFailedToTakeId(sender, args) {
    //alert('Query failed. Error: ' + args.get_message());
}

function onQuerySucceededAddFileToListMyTimesheet() {
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var itemId = oListItem.get_id();
    }
    addFileToListMyTimesheet(itemId);
}


///******************************************************************************
function addFileToListMyTimesheet(itemId) {

    var listTitle = 'MyTimesheet';
    //var itemId = 1;
    var fileInput = document.getElementById("customFileUploadControl");
    var file = fileInput.files[0];
    if (file != undefined) {
        processUpload(file, listTitle, itemId,
          function () {
              console.log('Attachment file has been uploaded');
              if (itCameFromNewTimesheet) {
                  window.location.href = '../Pages/EditTimesheet.aspx?ID=' + itemId + '&Status=InProgress&Month=' + monthSubmit + '&Year=' + yearSubmit + '';
              } else if (itCameFromApproverEdit) {
                  window.location.href = '../Pages/ApproverEdit.aspx?ID=' + timesheetId + '&Status=InProgress&User=' + userNameForUrl + '&Month=' + month + '&Year=' + year;
              } else if (itCameFromEditTimesheet) {
                  window.location.href = '../Pages/EditTimesheet.aspx?ID=' + timesheetId + '&Status=InProgress&Month=' + month + '&Year=' + year;
              }
              //location.reload();
          },
          function (sender, args) {
              console.log(args.get_message());
              //var errorMes = '<div class="alert alert-danger">' + args.get_message() + '</div>';
              //$("#warningMsg").html(errorMes);
              if (itCameFromNewTimesheet) {
                  setTimeout(function () {
                      window.location.href = '../Pages/EditTimesheet.aspx?ID=' + itemId + '&Status=InProgress&Month=' + monthSubmit + '&Year=' + yearSubmit + '';
                  }, 5000);
              } else if (itCameFromApproverEdit) {
                  setTimeout(function () {
                      window.location.href = '../Pages/ApproverEdit.aspx?ID=' + timesheetId + '&Status=InProgress&User=' + userNameForUrl + '&Month=' + month + '&Year=' + year;
                  }, 5000);
              } else if (itCameFromEditTimesheet) {
                  setTimeout(function () {
                      window.location.href = '../Pages/EditTimesheet.aspx?ID=' + timesheetId + '&Status=InProgress&Month=' + month + '&Year=' + year;
                  }, 5000);
              }
          });
    } else {
        if (itCameFromNewTimesheet) {
            window.location.href = '../Pages/EditTimesheet.aspx?ID=' + itemId + '&Status=InProgress&Month=' + monthSubmit + '&Year=' + yearSubmit + '';
        } else if (itCameFromApproverEdit) {
            window.location.href = '../Pages/ApproverEdit.aspx?ID=' + timesheetId + '&Status=InProgress&User=' + userNameForUrl + '&Month=' + month + '&Year=' + year;
        } else if (itCameFromEditTimesheet) {
            window.location.href = '../Pages/EditTimesheet.aspx?ID=' + timesheetId + '&Status=InProgress&Month=' + month + '&Year=' + year;
        }
    }
    function processUpload(fileInput, listTitle, itemId, success, error) {
        var reader = new FileReader();
        reader.onload = function (result) {
            var fileContent = new Uint8Array(result.target.result);
            performAttachmentUpload(listTitle, fileInput.name, itemId, fileContent, success, error);
        };
        reader.readAsArrayBuffer(fileInput);
    }

    function performAttachmentUpload(listTitle, fileName, itemId, fileContent, success, error) {

        ensureAttachmentFolder(listTitle, itemId,
           function (folder) {
               var attachmentFolderUrl = folder.get_serverRelativeUrl();
               uploadFile(attachmentFolderUrl, fileName, fileContent, success, error);
           },
           error);
    }

    function ensureAttachmentFolder(listTitle, itemId, success, error) {
        var ctx = SP.ClientContext.get_current();
        var web = ctx.get_web();
        var list = web.get_lists().getByTitle(listTitle);
        ctx.load(list, 'RootFolder');
        var item = list.getItemById(itemId);
        ctx.load(item);
        ctx.executeQueryAsync(
          function () {
              var attachmentsFolder;
              if (!item.get_fieldValues()['Attachments']) { /* Attachments folder exists? */
                  var attachmentRootFolderUrl = String.format('{0}/Attachments', list.get_rootFolder().get_serverRelativeUrl());
                  var attachmentsRootFolder = ctx.get_web().getFolderByServerRelativeUrl(attachmentRootFolderUrl);
                  //Note: Here is a tricky part. 
                  //Since SharePoint prevents the creation of folder with name that corresponds to item id, we are going to:   
                  //1)create a folder with name in the following format '_<itemid>'
                  //2)rename a folder from '_<itemid>'' into '<itemid>'
                  //This allow to bypass the limitation of creating attachment folders
                  var request;
                  if (window.XMLHttpRequest)
                      request = new XMLHttpRequest();
                  else
                      request = new ActiveXObject("Microsoft.XMLHTTP");
                  request.open('GET', attachmentRootFolderUrl + "/" + itemId, false);
                  request.send(); // there will be a 'pause' here until the response to come.
                  // the object request will be actually modified
                  if (request.status === 404) {
                      attachmentsFolder = attachmentsRootFolder.get_folders().add('_' + itemId);
                      attachmentsFolder.moveTo(attachmentRootFolderUrl + '/' + itemId);
                  } else {
                      var attachmentFolderUrl = String.format('{0}/Attachments/{1}', list.get_rootFolder().get_serverRelativeUrl(), itemId);
                      attachmentsFolder = ctx.get_web().getFolderByServerRelativeUrl(attachmentFolderUrl);
                  }
                  ctx.load(attachmentsFolder);
              }
              else {
                  var attachmentFolderUrl = String.format('{0}/Attachments/{1}', list.get_rootFolder().get_serverRelativeUrl(), itemId);
                  attachmentsFolder = ctx.get_web().getFolderByServerRelativeUrl(attachmentFolderUrl);
                  ctx.load(attachmentsFolder);
              }
              ctx.executeQueryAsync(
                   function () {
                       success(attachmentsFolder);
                   },
                   error);
          },
          error);
    }

    function uploadFile(folderUrl, fileName, fileContent, success, error) {
        var ctx = SP.ClientContext.get_current();
        var folder = ctx.get_web().getFolderByServerRelativeUrl(folderUrl);
        var encContent = new SP.Base64EncodedByteArray();
        for (var b = 0; b < fileContent.length; b++) {
            encContent.append(fileContent[b]);
        }
        var createInfo = new SP.FileCreationInformation();
        createInfo.set_content(encContent);
        createInfo.set_url(fileName);
        folder.get_files().add(createInfo);
        ctx.executeQueryAsync(success, error);
    }
    ///*******************************************************************************
}

function getWebProperties() {

    var attachmentFiles;
    if (timesheetId) {
        var itemId = timesheetId;
    } else itemId = null;
    var ctx = new SP.ClientContext.get_current();

    var web = ctx.get_web();
    var attachmentFolder = web.getFolderByServerRelativeUrl('Lists/MyTimesheet/Attachments/' + itemId);
    attachmentFiles = attachmentFolder.get_files();
    ctx.load(attachmentFiles);

    ctx.executeQueryAsync(Function.createDelegate(this, onSuccess), Function.createDelegate(this, onFailed));

    function onSuccess(sender, args) {
        var i = 0;
        var html = "";
        var relativeUrl = "";
        for (var file in attachmentFiles) {
            $('#result').html(html);
            if (attachmentFiles.itemAt(i).get_serverRelativeUrl()) {
                relativeUrl = attachmentFiles.itemAt(i).get_serverRelativeUrl();
                var fileName = String(relativeUrl);
                fileName = fileName.split("/");
                fileName = fileName[fileName.length - 1];
                //fileName = fileName[9];
                html += "<p><a href='" + relativeUrl + "'>" + fileName + "</a>";
                html += "<a onclick='deleteAttach(\"" + fileName + "\")' href='/'> Delete</a></p>";
            }
            i++;
        }
    }

    function onFailed(sender, args) {
        //alert("sorry!");
    }
}

function deleteAttach(fileName) {
    var listTitle = 'MyTimesheet'
    var itemId = timesheetId;

    var ctx = SP.ClientContext.get_current();
    var list = ctx.get_web().get_lists().getByTitle(listTitle);
    var item = list.getItemById(itemId);
    var attachmentFile = item.get_attachmentFiles().getByFileName(fileName);
    attachmentFile.deleteObject();
    ctx.executeQueryAsync(
      function () {
          console.log('Attachment file has been deleted');
          location.reload();
      },
      function (sender, args) {
          console.log(args.get_message());
      });
}

//********************************************************************************************************
function getLastItemId(monthSubmit, yearSubmit) {
    var userId = _spPageContextInfo.userId;
    var caml = "<View><Query><Where>"
        + "<Eq><FieldRef Name='Author' LookupId='TRUE' /><Value Type='Integer'>"
        + userId + "</Value></Eq></Where>"
        + "<OrderBy><FieldRef Name='Created' Ascending='False' /></OrderBy>"
        + "</Query><RowLimit>1</RowLimit></View>";
    var ctx = SP.ClientContext.get_current()
    var web = ctx.get_web()
    var list = web.get_lists().getByTitle("MyTimesheet")
    var query = new SP.CamlQuery();
    query.set_viewXml(caml);
    var items = list.getItems(query);
    ctx.load(items)
    ctx.executeQueryAsync(function () {
        // success actions
        var count = items.get_count();
        //should only be 1
        if (count > 1) {
            throw "Something is wrong. Should only be one latest list item / doc";
        }

        var enumerator = items.getEnumerator();
        enumerator.moveNext();
        var item = enumerator.get_current();
        var id = item.get_id();
        itCameFromNewTimesheet = true;
        // do something with your result!!!!
        //window.location.href = '../Pages/EditTimesheet.aspx?ID=' + id + '&Status="In Progress"&Month=' + monthSubmit + '&Year=' + yearSubmit + '';
        //href='EditTimesheet.aspx?ID=" + oListItem.get_id() + "&Status=" + oListItem.get_item('Status') + "&Month=" + oListItem.get_item('Title') + "&Year=" + oListItem.get_item('Year') + "'
        //alert(id + monthSubmit + yearSubmit);
        addFileToListMyTimesheet(id);

    }, function () {
        //failure handling comes here
        //alert("failed");
    });
}

//***************************************************************************
//******************************SAME FONCTIONS*******************************
//***************************************************************************
function lookupProject() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/';
    //var siteUrl = 'https://leonardotabosa.sharepoint.com/Direction/';
    var context = new SP.AppContextSite(ctx, siteUrl);
    ctx.load(context.get_web());
    var oList = context.get_web().get_lists().getByTitle('Project-List');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<Where>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'Status\'/>' +
                                                '<Value Type=\'Calculated\'>1-LAUNCHED</Value>' +
                                            '</Eq>' +
                                '</Where>' +
                                '<OrderBy>' +
                                    '<FieldRef Name=\'Final_x0020_Client\' Ascending=\'TRUE\' />' +
                                '</OrderBy>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                                '<FieldRef Name=\'Title\' />' +
                                '<FieldRef Name=\'Cat\' />' +
                                '<FieldRef Name=\'Final_x0020_Client\' />' +
                                '<FieldRef Name=\'Details\' />' +
                                '<FieldRef Name=\'PNum\' />' +
                                '<FieldRef Name=\'Amdt0\' />' +
                                '<FieldRef Name=\'Bench\' />' +
                                '<FieldRef Name=\'Department\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, Cat, Final_x0020_Client, Details, PNum, Amdt0, Bench, Department)');
    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryLookupSucceeded),
    Function.createDelegate(this, window.onQueryFailed));

}

function onQueryFailed(sender, args) {
}
/**
 * On the query succeeded. Lists all the projects
 * @param {type} sender - The sender.
 * @param {type} args - The arguments.
 */
function onQueryLookupSucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listInfo = "";
    var countProjects = 0;
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        listInfo += "<option value='" + oListItem.get_id() + "' label='" + oListItem.get_item('Final_x0020_Client').Label + " " + oListItem.get_item('Title') + " " + oListItem.get_item('PNum') + "-" + oListItem.get_item('Amdt0') + "'>" + oListItem.get_id() + "</option>";
        projectList[countProjects] = new Array();
        projectList[countProjects][0] = oListItem.get_item('PNum');
        projectList[countProjects][1] = oListItem.get_item('Amdt0');
        projectList[countProjects][2] = oListItem.get_item('Title');
        projectList[countProjects][3] = oListItem.get_item('Cat');
        projectList[countProjects][4] = oListItem.get_item('Final_x0020_Client').Label;
        projectList[countProjects][5] = oListItem.get_item('Details');
        projectList[countProjects][6] = oListItem.get_item('Bench');
        projectList[countProjects][7] = oListItem.get_id();
        projectList[countProjects][8] = oListItem.get_item('Department');
        

        countProjects++;

    }
    projectList[0][9] = listInfo;
    $(".results").html(listInfo);
    updateProjects();
    holiday();
    $("#newDeleteButtons").show();
    //$.getScript(hostweburl + "/_layouts/15/" + "SP.RequestExecutor.js", holiday);

}

//Same functions in the two filles
function numberOfDaysInMonth() {
    var txtMonth = $('#txtMonth').val();
    var txtYear = $('#txtYear').val();

    txtMonth = getMonthFromString(txtMonth);
    function getMonthFromString(txtMonth) {
        return new Date(Date.parse(txtMonth + " 1, 2012")).getMonth() + 1
    }

    var numberOfDays = daysInMonth(txtMonth, txtYear);

    function daysInMonth(m, y) {
        return new Date(y, m, 0).getDate();
    }

    if (numberOfDays == 30) {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").hide();
        //Delete day 31 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '-35').val(0);
        }
    } else if (numberOfDays == 29) {
        $(".month28Days").show();
        $(".month29Days").hide();
        $(".month30Days").hide();
        //Delete day 31 and 30 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '-34').val(0);
            $('#col' + i + '-35').val(0);
        }
    } else if (numberOfDays == 28) {
        $(".month28Days").hide();
        $(".month29Days").hide();
        $(".month30Days").hide();
        //Delete day 31, 30 and 29 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '-33').val(0);
            $('#col' + i + '-34').val(0);
            $('#col' + i + '-35').val(0);
        }

    } else {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").show();
    }
}

function deleteLineOfProject() {
    for (var i = 0; i < count; i++) {
        if ($('#col' + i + '-0').is(':checked')) {
            $("#row" + i).hide();
            array[i][36] = "Deleted";
            $('#col' + i + '-36').val(array[i][36]);
            updateLineTotal();
        }
    }
}

function getProjectInfo() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/';
    //var siteUrl = 'https://leonardotabosa.sharepoint.com/Direction/';
    var context = new SP.AppContextSite(ctx, siteUrl);
    ctx.load(context.get_web());
    var oList = context.get_web().get_lists().getByTitle('Project-List');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<Where>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'ID\'/>' +
                                                '<Value Type=\'Number\'>' + array[projectCount][1] + '</Value>' +
                                            '</Eq>' +
                                '</Where>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                                '<FieldRef Name=\'Title\' />' +
                                '<FieldRef Name=\'Cat\' />' +
                                '<FieldRef Name=\'Final_x0020_Client\' />' +
                                '<FieldRef Name=\'Details\' />' +
                                '<FieldRef Name=\'PNum\' />' +
                                '<FieldRef Name=\'Amdt0\' />' +
                                '<FieldRef Name=\'Bench\' />' +
                                '<FieldRef Name=\'Department\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, Cat, Final_x0020_Client, Details, PNum, Amdt0, Bench, Department)');
    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryGetProjectInfo),
    Function.createDelegate(this, window.onQueryFailed));




}

function newLineOfProject1() {
    count++;

    var newLine = "";
    for (var i = 0; i < count; i++) {
        newLine += '<tr id="row' + i + '">' +
                    '<td><input type="checkbox" id="col' + i + '-0"></td>' +
                    '<td><select class="form-control results" id="col' + i + '-1"></select></td>' +
                    '<td><select class="form-control" id="col' + i + '-2">' +
                            '<option value="N" label="Normal" selected="selected">N</option>' +
                            '<option value="T" label="Training">T</option>' +
                            '<option value="PH" label="Public Holiday">PH</option>' +
                            '<option value="PL" label="Paid leave">PL</option>' +
                            '<option value="PSL" label="Paid Sick leave">PSL</option>' +
                            '<option value="UL" label="Unpaid leave">UL</option>' +
                            '<option value="USL" label="Unpaid Sick leave">USL</option>' +
                            '<option value="CL" label="Compensation leave">CL</option>' +
                            '<option value="STB" label="Contract pause">STB</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><select class="form-control" id="col' + i + '-3">' +
                            '<option value="N" label="Normal" selected="selected">N</option>' +
                            '<option value="S" label="Supplemental">S</option>' +
                            '<option value="O" label="Overtime">O</option>' +
                            '<option value="NF" label="Non-Invoiced">NF</option>' +
                            '<option value="G" label="Gratuity">G</option>' +
                            '<option value="B" label="Bench">B</option>' +
                            '<option value="BO" label="Opportunity">BO</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input type="text" value="" id="col' + i + '-4" class="form-control" readonly/></td>' +
                    '<td><input type="text"  id="col' + i + '-5" class="form-control" pattern = "[1-9][0-4]?"/></td>' +
                    '<td><input type="text"  id="col' + i + '-6" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-7" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-8" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-9" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-10" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-11" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-12" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-13" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-14" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-15" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-16" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-17" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-18" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-19" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-20" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-21" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-22" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-23" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-24" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-25" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-26" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-27" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-28" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-29" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-30" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-31" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-32" class="form-control"/></td>' +
                    '<td class="month28Days"><input type="text"  id="col' + i + '-33" class="form-control"/></td>' +
                    '<td class="month29Days"><input type="text"  id="col' + i + '-34" class="form-control"/></td>' +
                    '<td class="month30Days"><input type="text"  id="col' + i + '-35" class="form-control"/></td>' +
                    '<td><input type="hidden" id="col' + i + '-36"></td>' +
                  '</tr>';
    }
    fillArray();

    //Delete old table and create new one empty
    $("#newLine").html(newLine);

    //Update the total
    $(".form-control").focusout(function () {
        updateLineTotal();

    });

    numberOfDaysInMonth();

    if (projectList.length > 0) {
        $(".results").html(projectList[0][9]);
        updateProjects();
        holiday();

    } else {
        lookupProject();
    }

    weekendDay();



}

function newLineOfProject(rows) {
    var newLine = "";
    for (var i = 0; i < rows; i++) {
        newLine += '<tr id="row' + i + '">' +
                    '<td><input type="checkbox" id="col' + i + '-0"></td>' +
                    '<td><select class="form-control results" id="col' + i + '-1"></select></td>' +
                    '<td><select class="form-control" id="col' + i + '-2">' +
                            '<option value="N" label="Normal" selected="selected">N</option>' +
                            '<option value="T" label="Training">T</option>' +
                            '<option value="PH" label="Public Holiday">PH</option>' +
                            '<option value="PL" label="Paid leave">PL</option>' +
                            '<option value="PSL" label="Paid Sick leave">PSL</option>' +
                            '<option value="UL" label="Unpaid leave">UL</option>' +
                            '<option value="USL" label="Unpaid Sick leave">USL</option>' +
                            '<option value="CL" label="Compensation leave">CL</option>' +
                            '<option value="STB" label="Contract pause">STB</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><select class="form-control" id="col' + i + '-3">' +
                            '<option value="N" label="Normal" selected="selected">N</option>' +
                            '<option value="S" label="Supplemental">S</option>' +
                            '<option value="O" label="Overtime">O</option>' +
                            '<option value="NF" label="Non-Invoiced">NF</option>' +
                            '<option value="G" label="Gratuity">G</option>' +
                            '<option value="B" label="Bench">B</option>' +
                            '<option value="BO" label="Opportunity">BO</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input type="text" value="" id="col' + i + '-4" class="form-control" readonly/></td>' +
                    '<td><input type="text"  id="col' + i + '-5" class="form-control" pattern = "[1-9][0-4]?"/></td>' +
                    '<td><input type="text"  id="col' + i + '-6" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-7" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-8" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-9" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-10" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-11" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-12" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-13" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-14" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-15" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-16" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-17" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-18" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-19" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-20" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-21" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-22" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-23" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-24" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-25" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-26" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-27" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-28" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-29" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-30" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-31" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '-32" class="form-control"/></td>' +
                    '<td class="month28Days"><input type="text"  id="col' + i + '-33" class="form-control"/></td>' +
                    '<td class="month29Days"><input type="text"  id="col' + i + '-34" class="form-control"/></td>' +
                    '<td class="month30Days"><input type="text"  id="col' + i + '-35" class="form-control"/></td>' +
                    '<td><input type="hidden" id="col' + i + '-36"></td>' +
                  '</tr>';
    }
    $("#newLine").html(newLine);


    //Update number of columns in table
    numberOfDaysInMonth();

    //Update dropdow of project
    if (projectList.length>0) {
        $(".results").html(projectList[0][9]);
        updateProjects();
        holiday();

    } else {
        lookupProject();
    }
    //Update data in table


    //Update the total
    $(".form-control").focusout(function () {
        updateLineTotal();

    });

    weekendDay();
}

function fillArray() {

    if (count != 0) {
        var temp = count - 1;
        array[temp] = new Array(37);
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < 37; j++) {
                array[i][j] = $('#col' + i + '-' + j).val();
            }
        }
    }
}

function updateLineTotal() {
    if (count > 0) {
        sumCol = 0;
        var error = "";
        for (var i = 0; i < (count) ; i++) {
            var sumLine = 0;

            for (var j = 5; j < 36; j++) {
                var temp = Number($('#col' + i + '-' + j).val());
                if (temp >= 0 && temp < 25) {
                    sumLine += temp;
                    $('#col' + i + '-4').val(sumLine);
                } else if (!$('#col' + i + '-' + j).val() == "") {
                    $('#col' + i + '-' + j).val(0);
                }
            }
            if (array[i][36] != "Deleted") {
                sumCol += sumLine;
            }
        }
    }
    $('#totalHour').html(sumCol);
    $('#msg').html(error);
}

function updateProjects() {

    for (var i = 0; i < count ; i++) {
        for (var j = 0; j < 37; j++) {
            $('#col' + i + '-' + j).val(array[i][j]);
        }
    }
    //HOUR TYPE AND PROJECT DEFAULT 
    for (var i = 0; i < count ; i++) {
        if (!$('#col' + i + '-2').val()) {
            $('#col' + i + '-2').val("N");
        }
        if (!$('#col' + i + '-3').val()) {
            $('#col' + i + '-3').val("N");
        }
        if (array[i][36] == "Deleted") {
            $('#row' + i).hide();
        }
        document.getElementById('col' + i + '-1').value = array[i][1];
    }
    if (status == "Approved") {
        $("input").prop("readonly", true);
    }
}

function weekendDay() {
    var month = $("#txtMonth").val();
    var year = $("#txtYear").val();
    var m = getMonthFromString(month);
    for (var i = 0; i < count; i++) {
        for (var j = 1; j < 32; j++) {
            var d = new Date(year, m, j);
            var day = d.getDay();
            if ((day == 6) || (day == 0)) {
                $("#col" + i + "-" + (j + 4)).css("background-color", "#D3D3D3");
            } else $("#col" + i + "-" + (j + 4)).css("background-color", "#FFF");
        }
    }

}

function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth()
}

function holiday() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/mysii/';
    //var siteUrl = 'https://leonardotabosa.sharepoint.com/';
    var context = new SP.AppContextSite(ctx, siteUrl);
    ctx.load(context.get_web());
    var oList = context.get_web().get_lists().getByTitle('Holiday List');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
            '<Query>' +
                '<OrderBy>' +
                '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
                '</OrderBy>' +
            '</Query>' +
            '<ViewFields>' +
                '<FieldRef Name=\'Id\' />' +
                '<FieldRef Name=\'Title\' />' +
                '<FieldRef Name=\'HolidayDate\' />' +
            '</ViewFields>' +
        '</View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, HolidayDate)');
    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryHolidaySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}

function onQueryHolidaySucceeded(sender, args) {
    var month = $("#txtMonth").val();
    var year = $("#txtYear").val();
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        var holidayDate = oListItem.get_item('HolidayDate');
        var holidayDay = holidayDate.getDate();
        var holidayMonth = holidayDate.getMonth();
        var holidayYear = holidayDate.getFullYear();
        holidayDate = new Date(holidayYear, holidayMonth, holidayDay);
        var m = getMonthFromString(month);
        for (var i = 0; i < count ; i++) {
            for (var j = 5; j < 36; j++) {
                var d = new Date(year, m, (j - 4));
                if ((holidayYear == d.getFullYear()) && (holidayMonth == d.getMonth()) && (holidayDay == d.getDate())) {
                    $("#col" + i + "-" + j).css("background-color", "#F5F5DC");
                }
            }
        }

    }
}

