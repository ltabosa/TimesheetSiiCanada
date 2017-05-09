$(document).ready(function () {

    //take month, year and user to collect data
    timesheetId = GetUrlKeyValue('ID', false);
    month = GetUrlKeyValue('Month', false);
    year = GetUrlKeyValue('Year', false);
    status = GetUrlKeyValue('Status', false);
    user = GetUrlKeyValue('User', false);
    userNameForUrl = user;
    projectInfo = new Array();
    projectCount = 0;
    sumCol = 0;
    count = 0;
    countLinesToDelete = 0;
    numberOfLinesInArray = 0;
    array = new Array();
    deleteLineArray = new Array();
    submitClicked = true;
    projectList = new Array();
    itCameFromEditTimesheet = false;
    itCameFromApproverEdit = false;
    itCameFromNewTimesheet = false;

    //go back to beginning if take url without month and year 
    if (!month || !year) {
        window.location.href = 'ApproverView.aspx';
    }
    if (status == "InProgress") {
        var sucess = '<div class="alert alert-success">' +
                            '<strong>Sucess!</strong> The Timesheet for ' + userNameForUrl + ' in ' + month + ' ' + year + ' is approved.' +
                        '</div>';
        $("#sucessMsg").html(sucess);
    }

    //Show Month and Year In the Input
    $('#txtMonth').val(month);
    $('#txtYear').val(year);
    $('#txtUser').val(user);

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveUserData);

    //otherProject
    $("#otherProject").click(function () {
        newLineOfProject1();
    });

    //Delete Selected Lines
    $("#deleteLine").click(function () {
        deleteLineOfProject();
    });


    $("#Reject").click(function () {
        myTimesheetReject();
    });

    $("#Submit").click(function () {
        itCameFromApproverEdit = true;
        //addFileToListMyTimesheet(timesheetId);

        //prevent multiple clicks
        if (submitClicked) {
            submitClicked = false;

            //update array with the newest info
            fillArray();

            var errorMes = "";

            for (var i = 0; i < count ; i++) {
                if (((array[i][1] == null) || (array[i][1] == undefined)) && (array[i][36] !== "Deleted")) {
                    errorMes = '<div class="alert alert-danger">' +
                            '<strong>Atention!</strong> Please fill the field <strong>Project</strong>.' +
                        '</div>';
                    submitClicked = true;

                } else if ((array[i][4] == 0) && (array[i][36] !== "Deleted")) {
                    errorMes = '<div class="alert alert-danger">' +
                            '<strong>Atention!</strong> You must have at least one hour in each project.' +
                        '</div>';
                    submitClicked = true;
                }
                if (i > 0) {
                    for (var k = 0; k < i; k++) {
                        if (((array[i][1] == array[k][1]) && (array[i][2] == array[k][2]) && (array[i][3] == array[k][3])) && (array[i][36] !== "Deleted") && (array[k][36] !== "Deleted")) {
                            errorMes = '<div class="alert alert-danger">' +
                                            '<strong>Atention!</strong> You already have this project and day type and hour type.' +
                                        '</div>';
                            submitClicked = true;
                        }
                    }
                }
            }
            if (sumCol == 0) {
                errorMes = '<div class="alert alert-danger">' +
                               '<strong>Atention!</strong> You can not send this project empty.' +
                           '</div>';
                submitClicked = true;
            }
            $("#errorMsg").html(errorMes);
            if (errorMes == "") {
                var warning = "";
                warning = '<div class="alert alert-warning">' +
                               '<strong>Wait!</strong> Your form is being submitted...' +
                           '</div>';
                $("#warningMsg").html(warning);
                colCreated = 0;
                getProjectInfo();
            }
        }
    });
});

//*************************************************************************************
//                                   Load User Data
//*************************************************************************************

//Take the current number of rows in the specific month
//Change the Where to accept the month, year and current user for the request
function retrieveUserData() {
    //take user Id
    getUserId(user);
}
function fillArrayAndTakeCount(userId) {
    //Take list info for the selected user
    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('Timesheet');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<Where>' +
                                    '<And>' +
                                        '<And>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'Month\'/>' +
                                                '<Value Type=\'Text\'>' + month + '</Value>' +
                                            '</Eq>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'Year\'/>' +
                                                '<Value Type=\'Text\'>' + year + '</Value>' +
                                            '</Eq>' +
                                        '</And>' +
                                         '<Eq>' +
                                             '<FieldRef Name=\'AssignedTo\' LookupId=\'TRUE\'/>' +
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
                                '<FieldRef Name=\'Title\' />' +
                                '<FieldRef Name=\'Project\' />' +
                                '<FieldRef Name=\'Month\' />' +
                                '<FieldRef Name=\'Year\' />' +
                                '<FieldRef Name=\'DayType\' />' +
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
    context.load(collListItem, 'Include(Id, Project, Month, Year, DayType, HourType, _x001_, _x002_, _x003_, _x004_, _x005_, _x006_, _x007_, _x008_, _x009_, _x0010_, _x0011_, _x0012_, _x0013_, _x0014_, _x0015_, _x0016_, _x0017_, _x0018_, _x0019_, _x0020_, _x0021_, _x0022_, _x0023_, _x0024_, _x0025_, _x0026_, _x0027_, _x0028_, _x0029_, _x0030_, _x0031_)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
    Function.createDelegate(this, window.onQueryFailed));
}

function onQueryFailed(sender, args) {
}

//take new count, fill array
function onQuerySucceeded(sender, args) {
    var listEnumerator = collListItem.getEnumerator();
    while (listEnumerator.moveNext()) {



        //update array
        var oListItem = listEnumerator.get_current();
        //save the number of lines to be deleted
        deleteLineArray[count] = oListItem.get_id();
        //count number of rows in list
        count++;
        var temp = count - 1;
        var total = 0;
        array[temp] = new Array(37);
        array[temp][1] = oListItem.get_item('Project');
        array[temp][2] = oListItem.get_item('DayType');
        array[temp][3] = oListItem.get_item('HourType');

        for (var j = 5; j < 36; j++) {
            array[temp][j] = oListItem.get_item('_x00' + (j - 4) + '_');
            total += array[temp][j];
        }
        array[temp][4] = total;
        sumCol += total;

    }

    //Call this function to build the empty table.
    newLineOfProject(count);
    $('#totalHour').html(sumCol);
}

//function newLineOfProject(rows) {
//    var newLine = "";
//    for (var i = 0; i < rows; i++) {
//        newLine += '<tr id="row' + i + '">' +
//                    '<td><input type="checkbox" id="col' + i + '-0"></td>' +
//                    '<td><select class="form-control results" id="col' + i + '-1"></select></td>' +
//                    '<td><select class="form-control" id="col' + i + '-2">' +
//                            '<option value="N" label="Normal" selected="selected">N</option>' +
//                            '<option value="T" label="Training">T</option>' +
//                            '<option value="PH" label="Public Holiday">PH</option>' +
//                            '<option value="PL" label="Paid leave">PL</option>' +
//                            '<option value="PSL" label="Paid Sick leave">PSL</option>' +
//                            '<option value="UL" label="Unpaid leave">UL</option>' +
//                            '<option value="USL" label="Unpaid Sick leave">USL</option>' +
//                            '<option value="CL" label="Compensation leave">CL</option>' +
//                            '<option value="STB" label="Contract pause">STB</option>' +
//                        '</select>' +
//                    '</td>' +
//                    '<td><select class="form-control" id="col' + i + '-3">' +
//                            '<option value="N" label="Normal" selected="selected">N</option>' +
//                            '<option value="S" label="Supplemental">S</option>' +
//                            '<option value="O" label="Overtime">O</option>' +
//                            '<option value="NF" label="Non-Invoiced">NF</option>' +
//                            '<option value="G" label="Gratuity">G</option>' +
//                            '<option value="B" label="Bench">B</option>' +
//                            '<option value="BO" label="Opportunity">BO</option>' +
//                        '</select>' +
//                    '</td>' +
//                    '<td><input type="text" value="" id="col' + i + '-4" class="form-control" readonly/></td>' +
//                    '<td><input type="text"  id="col' + i + '-5" class="form-control" pattern = "[1-9][0-4]?"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-6" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-7" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-8" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-9" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-10" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-11" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-12" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-13" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-14" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-15" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-16" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-17" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-18" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-19" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-20" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-21" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-22" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-23" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-24" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-25" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-26" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-27" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-28" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-29" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-30" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-31" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-32" class="form-control"/></td>' +
//                    '<td class="month28Days"><input type="text"  id="col' + i + '-33" class="form-control"/></td>' +
//                    '<td class="month29Days"><input type="text"  id="col' + i + '-34" class="form-control"/></td>' +
//                    '<td class="month30Days"><input type="text"  id="col' + i + '-35" class="form-control"/></td>' +
//                    '<td><input type="hidden" id="col' + i + '-36"></td>' +
//                  '</tr>';
//    }
//    $("#newLine").html(newLine);
//    //Update number of columns in table
//    numberOfDaysInMonth();

//    //Update dropdow of project
//    lookupProject();

//    //Update the total
//    $(".form-control").focusout(function () {
//        updateLineTotal();

//    });
//    weekendDay();
//}

//function updateLineTotal() {
//    if (count > 0) {
//        sumCol = 0;
//        var error = "";
//        for (var i = 0; i < (count) ; i++) {
//            var sumLine = 0;

//            for (var j = 5; j < 36; j++) {
//                var temp = Number($('#col' + i + '-' + j).val());
//                if (temp >= 0 && temp < 25) {
//                    sumLine += temp;
//                    $('#col' + i + '-4').val(sumLine);
//                } else if (!$('#col' + i + '-' + j).val() == "") {
//                    $('#col' + i + '-' + j).val(0);
//                }
//            }
//            if (array[i][36] != "Deleted") {
//                sumCol += sumLine;
//            }
//        }
//    }
//    $('#totalHour').html(sumCol);
//    $('#msg').html(error);
//}

//function numberOfDaysInMonth() {
//    var txtMonth = $('#txtMonth').val();
//    var txtYear = $('#txtYear').val();

//    txtMonth = getMonthFromString(txtMonth);
//    function getMonthFromString(txtMonth) {
//        return new Date(Date.parse(txtMonth + " 1, 2012")).getMonth() + 1
//    }

//    var numberOfDays = daysInMonth(txtMonth, txtYear);

//    function daysInMonth(m, y) {
//        return new Date(y, m, 0).getDate();
//    }

//    if (numberOfDays == 30) {
//        $(".month28Days").show();
//        $(".month29Days").show();
//        $(".month30Days").hide();
//        //Delete day 31 from array
//        for (var i = 0; i < count; i++) {
//            $('#col' + i + '-35').val(0);
//        }
//    } else if (numberOfDays == 29) {
//        $(".month28Days").show();
//        $(".month29Days").hide();
//        $(".month30Days").hide();
//        //Delete day 31 and 30 from array
//        for (var i = 0; i < count; i++) {
//            $('#col' + i + '-34').val(0);
//            $('#col' + i + '-35').val(0);
//        }
//    } else if (numberOfDays == 28) {
//        $(".month28Days").hide();
//        $(".month29Days").hide();
//        $(".month30Days").hide();
//        //Delete day 31, 30 and 29 from array
//        for (var i = 0; i < count; i++) {
//            $('#col' + i + '-33').val(0);
//            $('#col' + i + '-34').val(0);
//            $('#col' + i + '-35').val(0);
//        }

//    } else {
//        $(".month28Days").show();
//        $(".month29Days").show();
//        $(".month30Days").show();
//    }
//}

//function lookupProject() {
//    var ctx = new SP.ClientContext.get_current();
//    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/';
//    var context = new SP.AppContextSite(ctx, siteUrl);
//    ctx.load(context.get_web());
//    var oList = context.get_web().get_lists().getByTitle('Project-List');
//    var camlQuery = new SP.CamlQuery();
//    camlQuery.set_viewXml('<View>' +
//                            '<Query>' +
//                                '<Where>' +
//                                            '<Eq>' +
//                                                '<FieldRef Name=\'Status\'/>' +
//                                                '<Value Type=\'Calculated\'>1-LAUNCHED</Value>' +
//                                            '</Eq>' +
//                                '</Where>' +
//                                '<OrderBy>' +
//                                    '<FieldRef Name=\'Final_x0020_Client\' Ascending=\'TRUE\' />' +
//                                '</OrderBy>' +
//                            '</Query>' +
//                            '<ViewFields>' +
//                                '<FieldRef Name=\'Id\' />' +
//                                '<FieldRef Name=\'Title\' />' +
//                                '<FieldRef Name=\'Cat\' />' +
//                                '<FieldRef Name=\'Final_x0020_Client\' />' +
//                                '<FieldRef Name=\'Details\' />' +
//                                '<FieldRef Name=\'PNum\' />' +
//                                '<FieldRef Name=\'Amdt0\' />' +
//                                '<FieldRef Name=\'Bench\' />' +
//                                '<FieldRef Name=\'Department\' />' +
//                            '</ViewFields>' +
//                          '</View>');
//    window.collListItem = oList.getItems(camlQuery);
//    ctx.load(collListItem, 'Include(Id, Title, Cat, Final_x0020_Client, Details, PNum, Amdt0, Bench, Department)');
//    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryLookupSucceeded),
//    Function.createDelegate(this, window.onQueryFailed));

//}

//function onQueryLookupSucceeded(sender, args) {
//    var listEnumerator = collListItem.getEnumerator();
//    var listInfo = "";
//    var countProjects = 0;
//    while (listEnumerator.moveNext()) {
//        var oListItem = listEnumerator.get_current();
//        listInfo += "<option value='" + oListItem.get_id() + "' label='" + oListItem.get_item('Final_x0020_Client').Label + " " + oListItem.get_item('Title') + " " + oListItem.get_item('PNum') + "-" + oListItem.get_item('Amdt0') + "'>" + oListItem.get_id() + "</option>";

//        projectList[countProjects] = new Array();
//        projectList[countProjects][0] = oListItem.get_item('PNum');
//        projectList[countProjects][1] = oListItem.get_item('Amdt0');
//        projectList[countProjects][2] = oListItem.get_item('Title');
//        projectList[countProjects][3] = oListItem.get_item('Cat');
//        projectList[countProjects][4] = oListItem.get_item('Final_x0020_Client').Label;
//        projectList[countProjects][5] = oListItem.get_item('Details');
//        projectList[countProjects][6] = oListItem.get_item('Bench');
//        projectList[countProjects][7] = oListItem.get_id();
//        projectList[countProjects][8] = oListItem.get_item('Department');
//        countProjects++;
//    }
//    $(".results").html(listInfo);
//    updateProjects();
//    holiday();
//}

// Get the user ID.
function getUserId(loginName) {
    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);
    context.executeQueryAsync(
         Function.createDelegate(null, ensureUserSuccess),
         Function.createDelegate(null, onFail)
    );
}

function ensureUserSuccess() {
    var userId = this.user.get_id();
    fillArrayAndTakeCount(userId);
}

function onFail(sender, args) {
    alert('Query failed. Error: ' + args.get_message());
}


//*************************************************************************************
//                             Load User Data End
//*************************************************************************************
//function weekendDay() {

//    var m = getMonthFromString(month);

//    for (i = 0; i < count; i++) {
//        for (j = 1; j < 32; j++) {
//            var d = new Date(year, m, j);
//            var day = d.getDay();
//            if ((day == 6) || (day == 0)) {
//                $("#col" + i + "-" + (j + 4)).css("background-color", "#D3D3D3");
//            }
//        }
//    }


//}

//function holiday() {
//    var ctx = new SP.ClientContext.get_current();
//    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/mysii/';
//    var context = new SP.AppContextSite(ctx, siteUrl);
//    ctx.load(context.get_web());
//    var oList = context.get_web().get_lists().getByTitle('Holiday List');
//    var camlQuery = new SP.CamlQuery();
//    camlQuery.set_viewXml('<View>' +
//            '<Query>' +
//                '<OrderBy>' +
//                '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
//                '</OrderBy>' +
//            '</Query>' +
//            '<ViewFields>' +
//                '<FieldRef Name=\'Id\' />' +
//                '<FieldRef Name=\'Title\' />' +
//                '<FieldRef Name=\'HolidayDate\' />' +
//            '</ViewFields>' +
//        '</View>');
//    window.collListItem = oList.getItems(camlQuery);
//    ctx.load(collListItem, 'Include(Id, Title, HolidayDate)');
//    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryHolidaySucceeded),
//    Function.createDelegate(this, window.onQueryFailed));
//}

//function onQueryHolidaySucceeded(sender, args) {
//    var listEnumerator = collListItem.getEnumerator();
//    while (listEnumerator.moveNext()) {
//        var oListItem = listEnumerator.get_current();
//        var holidayDate = oListItem.get_item('HolidayDate');
//        var holidayDay = holidayDate.getDate();
//        var holidayMonth = holidayDate.getMonth();
//        var holidayYear = holidayDate.getFullYear();
//        holidayDate = new Date(holidayYear, holidayMonth, holidayDay);
//        var m = getMonthFromString(month);
//        for (i = 0; i < count ; i++) {
//            for (j = 5; j < 36; j++) {
//                var d = new Date(year, m, (j - 4));
//                if ((holidayYear == d.getFullYear()) && (holidayMonth == d.getMonth()) && (holidayDay == d.getDate())) {
//                    $("#col" + i + "-" + j).css("background-color", "#F5F5DC");
//                }
//            }
//        }

//    }
//}

//function getMonthFromString(mon) {
//    return new Date(Date.parse(mon + " 1, 2012")).getMonth()
//}

//function updateProjects() {
//    for (var i = 0; i < count ; i++) {
//        for (var j = 0; j < 37; j++) {
//            $('#col' + i + '-' + j).val(array[i][j]);
//        }
//    }
//    //HOUR TYPE AND PROJECT DEFAULT 
//    for (var i = 0; i < count ; i++) {
//        if (!$('#col' + i + '-2').val()) {
//            $('#col' + i + '-2').val("N");
//        }
//        if (!$('#col' + i + '-3').val()) {
//            $('#col' + i + '-3').val("N");
//        }
//        if (array[i][36] == "Deleted") {
//            $('#row' + i).hide();
//        }
//        document.getElementById('col' + i + '-1').value = array[i][1];
//    }
//}

//*************************************************************************************
//                             New Line Of Project Clicked
//*************************************************************************************

//changed
//function newLineOfProject1() {
//    count++;
//    var newLine = "";
//    for (var i = 0; i < count; i++) {
//        newLine += '<tr id="row' + i + '">' +
//                    '<td><input type="checkbox" id="col' + i + '-0"></td>' +
//                    '<td><select class="form-control results" id="col' + i + '-1"></select></td>' +
//                    '<td><select class="form-control" id="col' + i + '-2">' +
//                            '<option value="N" label="Normal" selected="selected">N</option>' +
//                            '<option value="T" label="Training">T</option>' +
//                            '<option value="PH" label="Public Holiday">PH</option>' +
//                            '<option value="PL" label="Paid leave">PL</option>' +
//                            '<option value="PSL" label="Paid Sick leave">PSL</option>' +
//                            '<option value="UL" label="Unpaid leave">UL</option>' +
//                            '<option value="USL" label="Unpaid Sick leave">USL</option>' +
//                            '<option value="CL" label="Compensation leave">CL</option>' +
//                            '<option value="STB" label="Contract pause">STB</option>' +
//                        '</select>' +
//                    '</td>' +
//                    '<td><select class="form-control" id="col' + i + '-3">' +
//                            '<option value="N" label="Normal" selected="selected">N</option>' +
//                            '<option value="S" label="Supplemental">S</option>' +
//                            '<option value="O" label="Overtime">O</option>' +
//                            '<option value="NF" label="Non-Invoiced">NF</option>' +
//                            '<option value="G" label="Gratuity">G</option>' +
//                            '<option value="B" label="Bench">B</option>' +
//                            '<option value="BO" label="Opportunity">BO</option>' +
//                        '</select>' +
//                    '</td>' +
//                    '<td><input type="text" value="" id="col' + i + '-4" class="form-control" readonly/></td>' +
//                    '<td><input type="text"  id="col' + i + '-5" class="form-control" pattern = "[1-9][0-4]?"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-6" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-7" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-8" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-9" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-10" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-11" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-12" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-13" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-14" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-15" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-16" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-17" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-18" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-19" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-20" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-21" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-22" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-23" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-24" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-25" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-26" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-27" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-28" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-29" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-30" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-31" class="form-control"/></td>' +
//                    '<td><input type="text"  id="col' + i + '-32" class="form-control"/></td>' +
//                    '<td class="month28Days"><input type="text"  id="col' + i + '-33" class="form-control"/></td>' +
//                    '<td class="month29Days"><input type="text"  id="col' + i + '-34" class="form-control"/></td>' +
//                    '<td class="month30Days"><input type="text"  id="col' + i + '-35" class="form-control"/></td>' +
//                    '<td><input type="hidden" id="col' + i + '-36"></td>' +
//                  '</tr>';
//    }
//    fillArray();
//    //Delete old table and create new one empty
//    $("#newLine").html(newLine);
//    //Update the total
//    $(".form-control").focusout(function () {
//        updateLineTotal();
//    });

//    numberOfDaysInMonth();

//    lookupProject();

//    weekendDay();
//}

//function fillArray() {
//    if (count != 0) {
//        var temp = count - 1;
//        array[temp] = new Array(37);
//        for (var i = 0; i < count; i++) {
//            for (var j = 0; j < 37; j++) {
//                array[i][j] = $('#col' + i + '-' + j).val();
//            }
//        }
//    }
//}

//*************************************************************************************
//                             Delete Line Of Project Checked
//*************************************************************************************

//function deleteLineOfProject() {
//    for (var i = 0; i < count; i++) {
//        if ($('#col' + i + '-0').is(':checked')) {
//            $("#row" + i).hide();
//            array[i][36] = "Deleted";
//            $('#col' + i + '-36').val(array[i][36]);
//            updateLineTotal();
//        }
//    }
//}

//*************************************************************************************
//                                     Approve Clicked
//*************************************************************************************

function deleteOldListItems() {
    deleteLineArray.forEach(function (val) {
        
        this.itemId = val;

        var clientContext = new SP.ClientContext.get_current();
        var oList = clientContext.get_web().get_lists().getByTitle('Timesheet');
        this.oListItem = oList.getItemById(itemId);

        oListItem.deleteObject();

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededDeleted), Function.createDelegate(this, this.onQueryFailed));
    });
}

function onQuerySucceededDeleted() {
    var deleteline = deleteLineArray.length;
    countLinesToDelete++;
    if (countLinesToDelete == deleteline) {
        addFileToListMyTimesheet(timesheetId);
        //window.location.href = '../Pages/ApproverEdit.aspx?ID=' + timesheetId + '&Status=InProgress&User=' + userNameForUrl + '&Month=' + month + '&Year=' + year;
    }
}

function updateListMyTimesheet() {
    //update My Timesheet list
    var clientContext = new SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle('MyTimesheet');

    this.oListItem = oList.getItemById(timesheetId);

    oListItem.set_item('Title', month);
    oListItem.set_item('Year', year);
    oListItem.set_item('Total', sumCol);
    oListItem.set_item('Status', "Approved");


    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateMyTimesheet), Function.createDelegate(this, this.onQueryCreateFailed));

}

function onQueryCreateMyTimesheet() {

}


function updateTimesheetList(user) {

    var assignedToVal = new SP.FieldUserValue();
    assignedToVal.set_lookupId(user);

    while (colCreated < count) {
        if (array[colCreated][36] != "Deleted") {

            var clientContext = new SP.ClientContext.get_current();

            //update Timesheet List
            var oList = clientContext.get_web().get_lists().getByTitle('Timesheet');

            var itemCreateInfo = new SP.ListItemCreationInformation();
            this.oListItem = oList.addItem(itemCreateInfo);

            for (var i = 0; i < projectList.length; i++) {
                if (array[colCreated][1] == projectList[i][7]) {
                    oListItem.set_item('PNum', projectList[i][0]);
                    oListItem.set_item('Amdt', projectList[i][1]);
                    oListItem.set_item('ProjectTitle', projectList[i][2]);
                    oListItem.set_item('Cat', projectList[i][3]);
                    oListItem.set_item('FinalClient', projectList[i][4]);
                    oListItem.set_item('ProjectDetails', projectList[i][5]);
                    oListItem.set_item('Bench', projectList[i][6]);
                    oListItem.set_item('Department', projectList[i][8]);
                }
            }
            oListItem.set_item('Project', array[colCreated][1]);
            oListItem.set_item('DayType', array[colCreated][2]);
            oListItem.set_item('HourType', array[colCreated][3]);
            oListItem.set_item('Month', month);
            oListItem.set_item('Year', year);
            oListItem.set_item('Total', array[colCreated][4]);
            oListItem.set_item('AssignedTo', user);


            for (var i = 0; i < 31; i++) {
                var x = i + 1;
                oListItem.set_item('_x00' + x + '_', array[colCreated][i + 5]);
            }

            oListItem.update();

            clientContext.load(oListItem);

            clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateSucceeded), Function.createDelegate(this, this.onQueryCreateFailed));
            colCreated++;

        } else {
            colCreated++;
            onQueryCreateSucceeded();
        }
    }
}
//same
function onQueryCreateSucceeded() {
    if (colCreated == count) {
        deleteOldListItems();}
}

//*************************************************************************************
//                                     Reject Clicked
//*************************************************************************************

function myTimesheetReject() {

    //update My Timesheet list
    var clientContext = new SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle('MyTimesheet');

    this.oListItem = oList.getItemById(timesheetId);

    oListItem.set_item('Status', "Rejected");


    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryMyTimesheetReject), Function.createDelegate(this, this.onQueryCreateFailed));

}

function onQueryMyTimesheetReject() {

    window.location.href = '../Pages/ApproverView.aspx';
}


//function getProjectInfo() {
//    var ctx = new SP.ClientContext.get_current();
//    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/';
//    var context = new SP.AppContextSite(ctx, siteUrl);
//    ctx.load(context.get_web());
//    var oList = context.get_web().get_lists().getByTitle('Project-List');
//    var camlQuery = new SP.CamlQuery();
//    camlQuery.set_viewXml('<View>' +
//                            '<Query>' +
//                                '<Where>' +
//                                            '<Eq>' +
//                                                '<FieldRef Name=\'ID\'/>' +
//                                                '<Value Type=\'Number\'>' + array[projectCount][1] + '</Value>' +
//                                            '</Eq>' +
//                                '</Where>' +
//                            '</Query>' +
//                            '<ViewFields>' +
//                                '<FieldRef Name=\'Id\' />' +
//                                '<FieldRef Name=\'Title\' />' +
//                                '<FieldRef Name=\'Cat\' />' +
//                                '<FieldRef Name=\'Final_x0020_Client\' />' +
//                                '<FieldRef Name=\'Details\' />' +
//                                '<FieldRef Name=\'PNum\' />' +
//                                '<FieldRef Name=\'Amdt0\' />' +
//                                '<FieldRef Name=\'Bench\' />' +
//                            '</ViewFields>' +
//                          '</View>');
//    window.collListItem = oList.getItems(camlQuery);
//    ctx.load(collListItem, 'Include(Id, Title, Cat, Final_x0020_Client, Details, PNum, Amdt0, Bench)');
//    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryGetProjectInfo),
//    Function.createDelegate(this, window.onQueryFailed));
//}

function onQueryGetProjectInfo() {
    var listEnumerator = collListItem.getEnumerator();

    if ((array[projectCount][36] == "Deleted") && ((array[projectCount][1] == null) || (array[projectCount][1] == undefined))) {
        numberOfLinesInArray++;
    }

    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        projectInfo[projectCount] = new Array();
        projectInfo[projectCount][0] = oListItem.get_item('PNum');
        projectInfo[projectCount][1] = oListItem.get_item('Amdt0');
        projectInfo[projectCount][2] = oListItem.get_item('Title');
        projectInfo[projectCount][3] = oListItem.get_item('Cat');
        projectInfo[projectCount][4] = oListItem.get_item('Final_x0020_Client').Label;
        projectInfo[projectCount][5] = oListItem.get_item('Details');
        projectInfo[projectCount][6] = oListItem.get_item('Bench');
        projectCount++;
        numberOfLinesInArray++;
    }
    if (array.length != numberOfLinesInArray) {
        getProjectInfo();
    } else {
        updateListMyTimesheet();

        updateTimesheetList(user);
    }

}

//*************************************************************************************
//                                     Send email
//*************************************************************************************

function sendEmail(from, to, body, subject) {

    var siteurl = _spPageContextInfo.webServerRelativeUrl;

    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': from,
                'To': { 'results': [to] },
                'Body': body,
                'Subject': subject
            }
        }
      ),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
        },
        error: function (err) {
        }
    });
}