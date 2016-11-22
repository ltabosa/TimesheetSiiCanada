$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', monthYearFieldFill);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', lookupProject);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', numberOfDaysInMonth);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', setLoggedInUser);
    count = 1;
    //newLine = "";
    array = new Array();

    $(".changeDate").focusout(function () {
        numberOfDaysInMonth();
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
        updateTimesheetList();
    });
});

function monthYearFieldFill() {
    $('#txtMonth').datepicker({
        changeMonth: true,
        changeYear: true,
        //showButtonPanel: true,
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
        //showButtonPanel: true,
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
    var siteUrl = 'https://leonardotabosa.sharepoint.com/';
    var context = new SP.AppContextSite(ctx, siteUrl);
    ctx.load(context.get_web());
    var oList = context.get_web().get_lists().getByTitle('Projets');
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name=\'Title\' Ascending=\'TRUE\' /></OrderBy></Query><ViewFields><FieldRef Name=\'Id\' /><FieldRef Name=\'Title\' /><FieldRef Name=\'ActiveTitle\' /></ViewFields></View>');
    window.collListItem = oList.getItems(camlQuery);
    ctx.load(collListItem, 'Include(Id, Title, ActiveTitle)');
    ctx.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceeded),
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
    var listInfo = "";
    /*"<table class='table table-striped'>" +
        "<tr>" +
            "<th class='col-md-1'></th>" +
            "<th>ID</th>" +
            "<th>Title</th>" +
            "<th>Active Title</th>" +
        "</tr>";
        */
    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        if (oListItem.get_item('ActiveTitle')) {
            listInfo += "<option>" + oListItem.get_item('ActiveTitle') + "</option>";
        }
    }
    //listInfo += "</table>";
    $(".results").html(listInfo);
}

function numberOfDaysInMonth() {
    var month = $('#txtMonth').val();
    var year = $('#txtYear').val();

    month = getMonthFromString(month);
    function getMonthFromString(month) {
        return new Date(Date.parse(month + " 1, 2012")).getMonth() + 1
    }

    var numberOfDays = daysInMonth(month, year);
    
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

function newLineOfProject() {
    var newLine="";
    for (var i = 0; i < count; i++) {
        newLine += '<tr id="row'+i+'">' +
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
    updateProjects();
    numberOfDaysInMonth();
    lookupProject();
}

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

function fillArray() {
    if (count != 0) {
        var temp = count - 1;
        array[temp] = new Array(35);
        for (var i = 0; i < count;i++){
            for (var j = 0; j < 35; j++) {
                array[i][j] = $('#col'+i+''+ j).val();
            }
        }  
    }
    console.log(array);   
}

function updateProjects() {
    console.log(count);
    if (count > 1) {
        var temp = count - 2;
        console.log("temp: " + temp);
        for (var i = 0; i < (count - 1); i++) {
            console.log("Count - 1: " + (count - 1));
            for (var j = 0; j < 36; j++) {
                $('#col' + i + '' + j).val(array[i][j]);
            }
        }
        //HOUR TYPE AND PROJECT DEFAULT 
        for (var i = 0; i < (count-1); i++) {
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
}

function updateLineTotal() {
    console.log(count);
    if (count > 1) {
        var sumCol = 0;
        for (var i = 0; i < (count - 1) ; i++) {
            var sumLine = 0;
            var error="";
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
                    error = '<tr ><td colspan="35" class="bg-danger"><span id="errorMsg">Please fill field with a number between 0 and 24</span></td></tr>';
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

function updateTimesheetList() {
    /*
    documentType = $("#DocumentType option:selected").text();
    description = $('#Description').val();
    dateCreated = document.getElementById('DateCreated').value;
    */
    var month = $('#txtMonth').val();
    var year = $('#txtYear').val();
    //var html = $('#ctl00_PlaceHolderMain_SdfPeoplePicker_upLevelDiv');
    //var user = $("#divEntityData", html).attr("displaytext");
    var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
    
    console.log(peoplePicker);
    var users = peoplePicker.GetAllUserInfo();
    console.log(users);

    //var user = document.getElementById('SdfPeoplePicker').value;
    console.log("Month: " + month);
    console.log("Year: " + year);
    console.log("User: " + user);
    fillArray();

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
        console.log(users);
        SPClientPeoplePicker.ShowUserPresence = false;
        SPClientPeoplePicker_InitStandaloneControlWrapper('peoplePickerDivLinMan', users, schema);
        
        //alert(loginName);
    }

    function onError(error) {
        alert("error");
    }
}




