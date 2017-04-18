$(document).ready(function () {

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', monthYearFieldFill);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', lookupProject);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', numberOfDaysInMonth);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', setLoggedInUser);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', CheckMemberInAdminGroup);

    projectInfo = new Array();
    projectCount = 0;
    sumCol = 0;
    count = 1;
    colCreated = 0;
    submitClicked = true;
    array = new Array();
    monthsInNumber = [["January", 1], ["February", 2], ["March", 3], ["April", 4], ["May", 5], ["June", 6], ["July", 7], ["August", 8], ["September", 9], ["October", 10], ["November", 11], ["December", 12]];

    $(".changeDate").focusout(function () {
        numberOfDaysInMonth();
        weekendDay();
        holiday();
    });

    //otherProject
    $("#otherProject").click(function () {
        newLineOfProject();
    });
    //Delete Selected Lines
    $("#deleteLine").click(function () {
        deleteLineOfProject();
    });
    $("#Submit").click(function () {
        //get month and year
        monthSubmit = $('#txtMonth').val();
        yearSubmit = $('#txtYear').val();

        //Update Array With the Most Recent Data
        fillArray();
        //avoid multiple submit
        if (submitClicked) {
            submitClicked = false;
            var errorMes = "";
            for (var i = 0; i < (count - 1) ; i++) {
                if (((array[i][1] == null) || (array[i][1] == undefined)) && (array[i][35] !== "Deleted")) {
                    errorMes = '<div class="alert alert-danger">' +
                            '<strong>Atention!</strong> Please fill the field <strong>Project</strong>.' +
                        '</div>';
                    submitClicked = true;

                } else if ((array[i][3] == 0) && (array[i][35] !== "Deleted")) {
                    errorMes += '<div class="alert alert-danger">' +
                            '<strong>Atention!</strong> You must have one hour in <strong>' + array[i][1] + '</strong> project.' +
                        '</div>';
                    submitClicked = true;
                }
                if (i > 0) {
                    for (var k = 0; k < i; k++) {
                        if (((array[i][1] == array[k][1]) && (array[i][2] == array[k][2])) && (array[i][35] !== "Deleted")) {
                            errorMes = '<div class="alert alert-danger">' +
                                            '<strong>Atention!</strong> You already have this project and hour type.' +
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
                //get user ID
                var users = $('#peoplePickerDivLinMan_TopSpan_HiddenInput').val();
                users = users.substring(1, users.length - 1);
                var obj = JSON.parse(users);
                getUserId(obj.AutoFillKey);
            }
        }//submitclicked
    });
    //Delete error msg
    $("body").focusout(function () {
        $("#errorMsg").html("");
    });

});

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

function lookupProject() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/';
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
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, Cat, Final_x0020_Client, Details, PNum, Amdt0)');
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
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        listInfo += "<option value='" + oListItem.get_id() + "' label='" + oListItem.get_item('Final_x0020_Client').Label + " " + oListItem.get_item('Title') + " " + oListItem.get_item('PNum') + "-" + oListItem.get_item('Amdt0') + "'>" + oListItem.get_id() + "</option>";
    }
    $(".results").html(listInfo);
    updateProjects();
    holiday();
    //$.getScript(hostweburl + "/_layouts/15/" + "SP.RequestExecutor.js", holiday);

}

function numberOfDaysInMonth() {
    var month = $('#txtMonth').val();
    var year = $('#txtYear').val();

    month = getMonthFromString(month);
    function getMonthFromString(month) {
        return new Date(Date.parse(month + " 1, 2012")).getMonth() + 1
    }

    var numberOfDays = daysInMonth(month, year);

    function daysInMonth(m, y) {
        return new Date(y, m, 0).getDate();
    }

    if (numberOfDays == 30) {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").hide();
        //Delete day 31 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '34').val(0);
        }
    } else if (numberOfDays == 29) {
        $(".month28Days").show();
        $(".month29Days").hide();
        $(".month30Days").hide();
        //Delete day 31 and 30 from array
        for (var i = 0; i < count; i++) {
            $('#col' + i + '33').val(0);
            $('#col' + i + '34').val(0);
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
        }

    } else {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").show();
    }
}

function newLineOfProject() {
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
    count++;
    $("#newLine").html(newLine);


    //Update the total
    $(".form-control").focusout(function () {
        updateLineTotal();

    });

    //$.getScript(hostweburl + "/_layouts/15/" + "SP.RequestExecutor.js", lookupProject);
    lookupProject();
    numberOfDaysInMonth();
    weekendDay();

}

function deleteLineOfProject() {
    for (var i = 0; i < count; i++) {
        if ($('#col' + i + '0').is(':checked')) {
            $("#row" + i).hide();
            array[i][35] = "Deleted";
            updateLineTotal();
        }
    }
}

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
}

function updateProjects() {
    if (count > 1) {
        var temp = count - 2;
        for (var i = 0; i < (count - 1) ; i++) {
            for (var j = 0; j < 36; j++) {
                $('#col' + i + '' + j).val(array[i][j]);
            }
        }
        //HOUR TYPE AND PROJECT DEFAULT 
        for (var i = 0; i < (count - 1) ; i++) {
            if (!$('#col' + i + '2').val()) {
                $('#col' + i + '2').val("N");
            }
            if (array[i][35] == "Deleted") {
                $('#row' + i).hide();
            }
            document.getElementById('col' + i + '1').value = array[i][1];
        }
    }
}

function updateLineTotal() {
    if (count > 1) {
        sumCol = 0;
        var error = "";
        for (var i = 0; i < (count - 1) ; i++) {
            var sumLine = 0;

            for (var j = 4; j < 36; j++) {
                var temp = Number($('#col' + i + '' + j).val());
                if (temp >= 0 && temp < 25) {
                    sumLine += temp;
                    $('#col' + i + '3').val(sumLine);
                } else if (!$('#col' + i + '' + j).val() == "") {
                    $('#col' + i + '' + j).val(0);
                }
            }
            if (array[i][35] != "Deleted") {
                sumCol += sumLine;
            }
        }
    }
    $('#totalHour').html(sumCol);
    $('#msg').html(error);
}

function updateTimesheetList(user) {

    var assignedToVal = new SP.FieldUserValue();
    assignedToVal.set_lookupId(user);


    while (colCreated < (count - 1)) {
        if (array[colCreated][35] != "Deleted") {

            var clientContext = new SP.ClientContext.get_current();

            //update Timesheet List
            var oList = clientContext.get_web().get_lists().getByTitle('Timesheet');

            var itemCreateInfo = new SP.ListItemCreationInformation();
            this.oListItem = oList.addItem(itemCreateInfo);

            //verify if the line is well filled
            oListItem.set_item('PNum', projectInfo[colCreated][0]);
            oListItem.set_item('Amdt', projectInfo[colCreated][1]);
            oListItem.set_item('ProjectTitle', projectInfo[colCreated][2]);
            oListItem.set_item('Cat', projectInfo[colCreated][3]);
            oListItem.set_item('FinalClient', projectInfo[colCreated][4]);
            oListItem.set_item('ProjectDetails', projectInfo[colCreated][5]);
            oListItem.set_item('Bench', projectInfo[colCreated][6]);

            oListItem.set_item('Project', array[colCreated][1]);
            oListItem.set_item('HourType', array[colCreated][2]);
            oListItem.set_item('Month', monthSubmit);
            oListItem.set_item('Year', yearSubmit);
            oListItem.set_item('Total', array[colCreated][3]);
            oListItem.set_item('AssignedTo', assignedToVal);


            for (var i = 0; i < 31; i++) {
                var x = i + 1;
                oListItem.set_item('_x00' + x + '_', array[colCreated][i + 4]);
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

function onQueryCreateSucceeded() {

    //sendEmail("leonardo.tabosa@leonardotabosa.onmicrosoft.com", "leonardo.tabosa@leonardotabosa.onmicrosoft.com", "<b>Teste aqui</b>", "Outro teste");

    if (colCreated == (count - 1)) {
        //attachFileToMyTimesheet(userId, monthSubmit, yearSubmit);
        getLastItemId(monthSubmit, yearSubmit);
        //window.location.href = '../Pages/Default.aspx';
    }

}

function updateListMyTimesheet(user) {
    var assignedToVal = new SP.FieldUserValue();
    assignedToVal.set_lookupId(user);

    //update My Timesheet list
    var clientContext = new SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle('MyTimesheet');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);

    oListItem.set_item('Title', monthSubmit);
    oListItem.set_item('Year', yearSubmit);
    oListItem.set_item('Total', sumCol);
    oListItem.set_item('Status', "In Progress");
    oListItem.set_item('ReportOwner', assignedToVal);

    for (var i = 0; i < monthsInNumber.length; i++) {
        if (monthsInNumber[i][0] == monthSubmit) {
            oListItem.set_item('MonthNumber', monthsInNumber[i][1]);
        }
    }

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryCreateMyTimesheet), Function.createDelegate(this, this.onQueryCreateFailed));

}

function onQueryCreateMyTimesheet() {
    // return to MyTimesheet
    attachFileToMyTimesheet(userId, monthSubmit, yearSubmit);
}

function setLoggedInUser() {
    var userid = _spPageContextInfo.userId;
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";
    var requestHeaders = { "accept": "application/json;odata=verbose" };
    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

    function onSuccess(data, request) {
        var loginName = data.d.Title;
        var userAccountName = data.d.LoginName;

        var schema = {};
        schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
        schema['SearchPrincipalSource'] = 15;
        schema['ResolvePrincipalSource'] = 15;
        schema['AllowMultipleValues'] = false;
        schema['MaximumEntitySuggestions'] = 50;
        schema['Width'] = '280px';

        //Create logged in object
        var users = new Array(1);
        var defaultUser = new Object();
        defaultUser.AutoFillDisplayText = data.d.Title;
        defaultUser.AutoFillKey = data.d.LoginName;
        defaultUser.Description = data.d.Email;
        defaultUser.DisplayText = data.d.Title;
        defaultUser.EntityType = "User";
        defaultUser.IsResolved = true;
        defaultUser.Key = data.d.LoginName;
        defaultUser.Resolved = true;
        users[0] = defaultUser;
        SPClientPeoplePicker.ShowUserPresence = false;
        SPClientPeoplePicker_InitStandaloneControlWrapper('peoplePickerDivLinMan', users, schema);

    }

    function onError(error) {
        alert("error");
    }
}


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
    userId = this.user.get_id();

    //Check if the month and Year Already exists before create Items

    var context = new SP.ClientContext.get_current();
    var oList = context.get_web().get_lists().getByTitle('MyTimesheet');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View>' +
                            '<Query>' +
                                '<Where>' +
                                            '<Eq>' +
                                                '<FieldRef Name=\'ReportOwner\' LookupId=\'TRUE\'/>' +
                                                '<Value Type=\'User\'>' + userId + '</Value>' +
                                            '</Eq>' +
                                '</Where>' +
                            '<OrderBy>' +
                                '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
                                '</OrderBy>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'Id\' />' +
                                '<FieldRef Name=\'Title\' />' +
                                '<FieldRef Name=\'Year\' />' +
                                '<FieldRef Name=\'Total\' />' +
                                '<FieldRef Name=\'Status\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id, Title, Year, Total, Status)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceededCreateItems),
    Function.createDelegate(this, window.onQueryFailed));



}

function onFail(sender, args) {
    alert('Query failed. Error: ' + args.get_message());
}

function onQuerySucceededCreateItems() {
    var listEnumerator = collListItem.getEnumerator();
    var control = 0;
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        //Check if the Month And Year is Already in Draft Mode
        if (oListItem.get_item('Title') == monthSubmit && oListItem.get_item('Year') == yearSubmit) {
            control++;
        }
    }

    if (control == 0) {
        getProjectInfo();
    } else {
        var errorMes = '<div class="alert alert-danger">' +
                            '<strong>Atention!</strong> You have already one draft for ' + monthSubmit + ' ' + yearSubmit + '.' +
                        '</div>';
        submitClicked = true;

        $("#errorMsg").html(errorMes);
    }
}


function weekendDay() {
    var month = $("#txtMonth").val();
    var year = $("#txtYear").val();
    var m = getMonthFromString(month);
    for (i = 0; i < count; i++) {
        for (j = 1; j < 32; j++) {
            var d = new Date(year, m, j);
            var day = d.getDay();
            if ((day == 6) || (day == 0)) {
                $("#col" + i + "" + (j + 3)).css("background-color", "#D3D3D3");
            } else $("#col" + i + "" + (j + 3)).css("background-color", "#FFF");
        }
    }

}

function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth()
}

function holiday() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/mysii/';
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
        for (i = 0; i < (count - 1) ; i++) {
            for (j = 4; j < 35; j++) {
                var d = new Date(year, m, (j - 3));
                if ((holidayYear == d.getFullYear()) && (holidayMonth == d.getMonth()) && (holidayDay == d.getDate())) {
                    $("#col" + i + "" + j).css("background-color", "#F5F5DC");
                }
            }
        }

    }
}

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

function IsCurrentUserMemberOfGroup(groupName, OnComplete) {

    var currentContext = new SP.ClientContext.get_current();
    var currentWeb = currentContext.get_web();

    var currentUser = currentContext.get_web().get_currentUser();
    currentContext.load(currentUser);

    var allGroups = currentWeb.get_siteGroups();
    currentContext.load(allGroups);

    var group = allGroups.getByName(groupName);
    currentContext.load(group);

    var groupUsers = group.get_users();
    currentContext.load(groupUsers);

    currentContext.executeQueryAsync(OnSuccess, OnFailure);

    function OnSuccess(sender, args) {
        var userInGroup = false;
        var groupUserEnumerator = groupUsers.getEnumerator();
        while (groupUserEnumerator.moveNext()) {
            var groupUser = groupUserEnumerator.get_current();
            if (groupUser.get_id() == currentUser.get_id()) {
                userInGroup = true;
                break;
            }
        }
        OnComplete(userInGroup);
    }

    function OnFailure(sender, args) {
        OnComplete(false);
    }
}

function getProjectInfo() {
    var ctx = new SP.ClientContext.get_current();
    var siteUrl = 'https://siicanada.sharepoint.com/agency/direction/';
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
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, Cat, Final_x0020_Client, Details, PNum, Amdt0, Bench)');
    ctx.executeQueryAsync(Function.createDelegate(this, window.onQueryGetProjectInfo),
    Function.createDelegate(this, window.onQueryFailed));




}

function onQueryGetProjectInfo() {
    var listEnumerator = collListItem.getEnumerator();

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
    }
    if (projectCount != (count - 1)) {
        getProjectInfo();
    } else {
        updateListMyTimesheet(userId);
        updateTimesheetList(userId);
    }

}

function CheckMemberInAdminGroup() {
    var clientContext = new SP.ClientContext.get_current();
    this.currentUser = clientContext.get_web().get_currentUser();
    clientContext.load(this.currentUser);

    window.userGroups = this.currentUser.get_groups();
    clientContext.load(window.userGroups);
    clientContext.executeQueryAsync(success, failure);
    function success() {
        var groupsEnumerator = userGroups.getEnumerator();
        while (groupsEnumerator.moveNext()) {
            var group = groupsEnumerator.get_current();
            if (group.get_title() == "Approbateurs") {
                $("#approverMember").show();
            }
        }
    }

    function failure() {
        // Something went wrong with the query
    }
}