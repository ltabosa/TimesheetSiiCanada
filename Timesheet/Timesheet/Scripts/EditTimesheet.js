$(document).ready(function () {

    //take month, year and user to collect data
    timesheetId = GetUrlKeyValue('ID', false);
    month = GetUrlKeyValue('Month', false);
    year = GetUrlKeyValue('Year', false);
    sumCol = 0;
    count = 0;
    array = new Array();
    //console.log("Month: " + month);
    //console.log("Year: " + year);

    //go back to beginning if take url without month and year 
    if (!month || !year) {
        window.location.href = 'Default.aspx';
    }
    
    //Show Month and Year In the Input
    $('#txtMonth').val(month);
    $('#txtYear').val(year);

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', takeCurrentUser);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', fillArrayAndTakeCount);

    //otherProject
    $("#otherProject").click(function () {
        newLineOfProject1();
    });
    
    //Delete Selected Lines
    $("#deleteLine").click(function () {
        deleteLineOfProject();
    });

    $("#Submit").click(function () {
        //delete old draft
        console.log(sumCol);
        console.log(currentUser);
        //save info in list
        updateListMyTimesheet();
        //updateTimesheetList();
    });
   

});
//get current logged in user
function takeCurrentUser() {
    var clientContext = SP.ClientContext.get_current();
    var website = clientContext.get_web();
    currentUser = website.get_currentUser();
    clientContext.load(website);
    clientContext.load(currentUser);
    clientContext.executeQueryAsync(onRequestSucceeded, onRequestFailed);

    function onRequestSucceeded() {
        //alert(currentUser.LoginName);
        
    }

    function onRequestFailed(sender, args) {
        alert('Error: ' + args.get_message());
    }
}


//Take the current number of rows in the specific month
//Change the Where to accept the month, year and current user for the request
function fillArrayAndTakeCount() {
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('Timesheet');
    var camlQuery = new SP.CamlQuery();
    /*
    <Eq>
                 <FieldRef Name='Requester' />
                 <Value Type='User'>
                    <UserID />
                 </Value>
              </Eq>
    */
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<Where>' +
                                    '<And>'+
                                        '<Eq>' +
                                            '<FieldRef Name=\'Month\'/>' +
                                            '<Value Type=\'Text\'>' + month + '</Value>' +
                                        '</Eq>' +
                                        '<Eq>' +
                                            '<FieldRef Name=\'Year\'/>' +
                                            '<Value Type=\'Text\'>' + year + '</Value>' +
                                        '</Eq>' +
                                    '</And>'+
                                '</Where>' +
                                '<OrderBy>' +
                                    '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
                                '</OrderBy>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                                '<FieldRef Name=\'Title\' />' +
                                '<FieldRef Name=\'Project\' />' +
                                '<FieldRef Name=\'HourType\' />' +
                                '<FieldRef Name=\'_x001_\' />' +
                                '<FieldRef Name=\'_x002_\' />' +
                                '<FieldRef Name=\'_x003_\' />' +
                                '<FieldRef Name=\'_x004_\' />' +
                                '<FieldRef Name=\'_x005_\' />' +
                                '<FieldRef Name=\'_x006_\' />' +
                                '<FieldRef Name=\'_x007_\' />' +
                                '<FieldRef Name=\'_x008_\' />' +
                                '<FieldRef Name=\'_x009_\' />' +
                                '<FieldRef Name=\'_x0010_\' />' +
                                '<FieldRef Name=\'_x0011_\' />' +
                                '<FieldRef Name=\'_x0012_\' />' +
                                '<FieldRef Name=\'_x0013_\' />' +
                                '<FieldRef Name=\'_x0014_\' />' +
                                '<FieldRef Name=\'_x0015_\' />' +
                                '<FieldRef Name=\'_x0016_\' />' +
                                '<FieldRef Name=\'_x0017_\' />' +
                                '<FieldRef Name=\'_x0018_\' />' +
                                '<FieldRef Name=\'_x0019_\' />' +
                                '<FieldRef Name=\'_x0020_\' />' +
                                '<FieldRef Name=\'_x0021_\' />' +
                                '<FieldRef Name=\'_x0022_\' />' +
                                '<FieldRef Name=\'_x0023_\' />' +
                                '<FieldRef Name=\'_x0024_\' />' +
                                '<FieldRef Name=\'_x0025_\' />' +
                                '<FieldRef Name=\'_x0026_\' />' +
                                '<FieldRef Name=\'_x0027_\' />' +
                                '<FieldRef Name=\'_x0028_\' />' +
                                '<FieldRef Name=\'_x0029_\' />' +
                                '<FieldRef Name=\'_x0030_\' />' +
                                '<FieldRef Name=\'_x0031_\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, Project, HourType, _x001_, _x002_, _x003_, _x004_, _x005_, _x006_, _x007_, _x008_, _x009_, _x0010_, _x0011_, _x0012_, _x0013_, _x0014_, _x0015_, _x0016_, _x0017_, _x0018_, _x0019_, _x0020_, _x0021_, _x0022_, _x0023_, _x0024_, _x0025_, _x0026_, _x0027_, _x0028_, _x0029_, _x0030_, _x0031_)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}

//same function in two files
function onQueryFailed(sender, args) {
    SP.UI.Notify.addNotification('Request failed. ' + args.get_message() + '\n' +
    args.get_stackTrace(), true);
}

//take new count, fill array
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {
        //count number of rows in list
        count++;
        

        //update array
        var oListItem = listEnumerator.get_current();
        var temp = count - 1;
        var total=0;
        array[temp] = new Array(35);
        array[temp][1] = oListItem.get_item('Project');
        array[temp][2] = oListItem.get_item('HourType');

        for (var j = 4; j < 35; j++) {
                array[temp][j] = oListItem.get_item('_x00'+(j-3)+'_');
                total+=array[temp][j];
        }
        array[temp][3] = total;
        sumCol += total;
    }
    console.log(array);
    //Create lines off projects
    //console.log("Count:" + count);

    //Call this function to build the empty table.
    newLineOfProject(count);
    $('#totalHour').html(sumCol);

    //listInfo += "</table>";
   // $(".results").html(listInfo);
    //updateProjects();
}

function newLineOfProject(rows) {
    var newLine = "";
    console.log(rows);
    for (var i = 0; i < rows; i++) {
        newLine += '<tr id="row' + i + '">' +
                    '<td><input type="checkbox" id="col' + i + '0"></td>' +
                    '<td><select class="form-control results" id="col' + i + '1"></select></td>' +
                    '<td><select class="form-control" id="col' + i + '2">' +
                            '<option value="N" label="Normal Hour" selected="selected">N</option>' +
                            '<option value="S" label="Supplemental Hour">S</option>' +
                            '<option value="O" label="Overtime Hour">O</option>' +
                            '<option value="G" label="Gratuity Hour">G</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input type="text" value="" id="col' + i + '3" class="form-control" readonly/></td>' +
                    '<td><input type="text"  id="col' + i + '4" class="form-control" pattern = "[1-9][0-4]?"/></td>' +
                    '<td><input type="text"  id="col' + i + '5" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '6" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '7" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '8" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '9" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '10" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '11" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '12" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '13" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '14" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '15" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '16" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '17" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '18" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '19" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '20" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '21" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '22" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '23" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '24" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '25" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '26" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '27" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '28" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '29" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '30" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '31" class="form-control"/></td>' +
                    '<td class="month28Days"><input type="text"  id="col' + i + '32" class="form-control"/></td>' +
                    '<td class="month29Days"><input type="text"  id="col' + i + '33" class="form-control"/></td>' +
                    '<td class="month30Days"><input type="text"  id="col' + i + '34" class="form-control"/></td>' +
                    '<td><input type="hidden" id="col' + i + '35"></td>' +
                  '</tr>';
    }
    //fillArray();
    //count++;
    $("#newLine").html(newLine);
    //Update number of columns in table
    numberOfDaysInMonth();

    //Update dropdow of project
    lookupProject();

    //Update data in table


    //Update the total
    $(".form-control").focusout(function () {
        updateLineTotal();

    });
    //SP.SOD.executeFunc('sp.js', 'SP.ClientContext', lookupProject);
    

}

//changed
function newLineOfProject1() {
    count++;
    var newLine = "";
    for (var i = 0; i < count; i++) {
        newLine += '<tr id="row' + i + '">' +
                    '<td><input type="checkbox" id="col' + i + '0"></td>' +
                    '<td><select class="form-control results" id="col' + i + '1"></select></td>' +
                    '<td><select class="form-control" id="col' + i + '2">' +
                            '<option value="N" label="Normal Hour" selected="selected">N</option>' +
                            '<option value="S" label="Supplemental Hour">S</option>' +
                            '<option value="O" label="Overtime Hour">O</option>' +
                            '<option value="G" label="Gratuity Hour">G</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input type="text" value="" id="col' + i + '3" class="form-control" readonly/></td>' +
                    '<td><input type="text"  id="col' + i + '4" class="form-control" pattern = "[1-9][0-4]?"/></td>' +
                    '<td><input type="text"  id="col' + i + '5" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '6" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '7" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '8" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '9" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '10" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '11" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '12" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '13" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '14" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '15" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '16" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '17" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '18" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '19" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '20" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '21" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '22" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '23" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '24" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '25" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '26" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '27" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '28" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '29" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '30" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + i + '31" class="form-control"/></td>' +
                    '<td class="month28Days"><input type="text"  id="col' + i + '32" class="form-control"/></td>' +
                    '<td class="month29Days"><input type="text"  id="col' + i + '33" class="form-control"/></td>' +
                    '<td class="month30Days"><input type="text"  id="col' + i + '34" class="form-control"/></td>' +
                    '<td><input type="hidden" id="col' + i + '35"></td>' +
                  '</tr>';
    }
    fillArray();
    

    //Delete old table and create new one empty
    $("#newLine").html(newLine);


    //Update the total
    $(".form-control").focusout(function () {
        updateLineTotal();

    });
    lookupProject();
    numberOfDaysInMonth();

}

//same
function fillArray() {
    if (count != 0) {
        var temp = count - 1;
        array[temp] = new Array(35);
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < 35; j++) {
                array[i][j] = $('#col' + i + '' + j).val();
            }
        }
    }
    console.log(array);
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
    
    function daysInMonth(m,y) {
        return new Date(y, m, 0).getDate();
    }
    
    if (numberOfDays == 30) {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").hide();
        //Delete day 31 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '34').val(0);
            console.log("numero de dias= " + numberOfDays);
        }
    } else if (numberOfDays == 29) {
        $(".month28Days").show();
        $(".month29Days").hide();
        $(".month30Days").hide();
        //Delete day 31 and 30 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '33').val(0);
            $('#col' + i + '34').val(0);
            console.log("numero de dias= " + numberOfDays);
        }
    } else if (numberOfDays == 28) {
        $(".month28Days").hide();
        $(".month29Days").hide();
        $(".month30Days").hide();
        //Delete day 31, 30 and 29 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '32').val(0);
            $('#col' + i + '33').val(0);
            $('#col' + i + '34').val(0);
            console.log("numero de dias= " + numberOfDays);
        }

    } else {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").show(); 
    }   
}

function updateLineTotal() {
    console.log(count);
    if (count > 0) { //Changed this line
        sumCol = 0;
        var error = "";
        for (var i = 0; i < (count) ; i++) {//Changed this line
            var sumLine = 0;
           
            for (var j = 4; j < 36; j++) {
                var temp = Number($('#col' + i + ''+j).val());
                //console.log("Valor cada coluna: " + $('#col' + i + ''+j).val());
                console.log("Temp= "+ temp);
                if (temp >= 0 && temp < 25) {
                    //error = "";
                    //alert($('#col' + i + '3').val());
                    sumLine += temp;
                    $('#col' + i + '3').val(sumLine);
                    //console.log("Soma= " + sumLine);
                } else if (!$('#col' + i + ''+j).val()==""){
                    $('#col' + i + '' + j).val(0);
                    //error = '<tr ><td colspan="35" class="bg-danger"><span id="errorMsg">Please fill field with a number between 0 and 24</span></td></tr>';
                }
            }
            if(array[i][35]!="Deleted"){
                sumCol += sumLine;
            }
        }
    }
    //totalHour $("#newLine").html(newLine);
    $('#totalHour').html(sumCol);
    $('#msg').html(error);
    //console.log("Total= " + sumCol);
}

//Same functions in the two filles
function lookupProject() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://leonardotabosa.sharepoint.com/';
    var context = new SP.AppContextSite(ctx, siteUrl);
    ctx.load(context.get_web());
    var oList = context.get_web().get_lists().getByTitle('Projets');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name=\'Title\' Ascending=\'TRUE\' /></OrderBy></Query><ViewFields><FieldRef Name=\'Id\' /><FieldRef Name=\'Title\' /><FieldRef Name=\'ActiveTitle\' /></ViewFields></View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, ActiveTitle)');
    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryLookupSucceeded),
    Function.createDelegate(this, window.onQueryFailed));

}

//Same functions in the two filles
function onQueryLookupSucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    var listInfo = "";
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        if (oListItem.get_item('ActiveTitle')) {
            listInfo += "<option>" + oListItem.get_item('ActiveTitle') + "</option>";
        }
    }
    //listInfo += "</table>";
    $(".results").html(listInfo);
    updateProjects();
}


function updateProjects() {
    console.log(count);

        for (var i = 0; i < count ; i++) {//changed this line
            //console.log("Count - 1: " + (count - 1));
            for (var j = 0; j < 36; j++) {
                $('#col' + i + '' + j).val(array[i][j]);
            }
        }
        //HOUR TYPE AND PROJECT DEFAULT 
        for (var i = 0; i < count ; i++) {//changed this line
            if (!$('#col' + i + '2').val()) {
                $('#col' + i + '2').val("N");
            }
            if (array[i][35] == "Deleted") {
                $('#row' + i).hide();
            }
            document.getElementById('col' + i + '1').value = array[i][1];
            console.log("Nome do Projeto: " + array[i][1]);

        }

    
}

//same
function deleteLineOfProject() {
    for (var i = 0; i < count; i++) {
        if ($('#col' + i + '0').is(':checked')) {
            $("#row" + i).hide();
            array[i][35] = "Deleted";
            updateLineTotal();
            console.log("delete the line: " + i);
        }
    }
}


function updateListMyTimesheet() {
    //if (colCreated == (count - 1)) {

    //update My Timesheet list
    var clientContext = new SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle('MyTimesheet');

    this.oListItem = oList.getItemById(timesheetId);

    //var itemCreateInfo = new SP.ListItemCreationInformation();
    //this.oListItem = oList.addItem(itemCreateInfo);

    oListItem.set_item('Title', month);
    oListItem.set_item('Year', year);
    oListItem.set_item('Total', sumCol);
    oListItem.set_item('Status', "In Progress");
    oListItem.set_item('ReportOwner', currentUser);


    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateMyTimesheet), Function.createDelegate(this, this.onQueryCreateFailed));

    function onQueryCreateMyTimesheet() {
        // return to MyTimesheet
    }
    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    //window.location.href = '../Pages/File.aspx?ID=' + projectId + '&Title=' + projectTitle;
    // }
}

