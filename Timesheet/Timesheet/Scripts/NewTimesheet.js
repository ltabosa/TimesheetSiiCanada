$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', monthYearFieldFill);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', lookupProject);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', numberOfDaysInMonth);
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
    listInfo += "</table>";
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
    } else if (numberOfDays == 29) {
        $(".month28Days").show();
        $(".month29Days").hide();
        $(".month30Days").hide();
    } else if (numberOfDays == 28) {
        $(".month28Days").hide();
        $(".month29Days").hide();
        $(".month30Days").hide();
    } else {
        $(".month28Days").show();
        $(".month29Days").show();
        $(".month30Days").show(); 
    }   
}

function newLineOfProject() {
    var newLine="";
    for (var i = 0; i < count; i++) {
        newLine += '<tr>' +
                    '<td><input type="checkbox" id="col' + i + '0"></td>' +
                    '<td><select class="form-control results" id="col' + i + '1"></select></td>' +
                    '<td><select class="form-control" id="col' + i + '2">' +
                            '<option value="N" selected>Normal Hour</option>' +
                            '<option value="S">Supplemental Hour</option>' +
                            '<option value="O">Overtime Hour</option>' +
                            '<option value="G">Gratuity Hour</option>' +
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
                  '</tr>';
       /* newLine += '<tr>' +
                    '<td><input type="checkbox" id="col' + count + '0"></td>' +
                    '<td><select class="form-control results" id="col' + count + '1"></select></td>' +
                    '<td><select class="form-control" id="col' + count + '2">' +
                            '<option selected value="N">Normal Hour</option>' +
                            '<option value="S">Supplemental Hour</option>' +
                            '<option value="O">Overtime Hour</option>' +
                            '<option value="G">Gratuity Hour</option>' +
                        '</select>' +
                    '</td>' +
                    '<td><input type="text" value="" id="col' + count + '3" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '4" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '5" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '6" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '7" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '8" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '9" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '10" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '11" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '12" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '13" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '14" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '15" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '16" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '17" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '18" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '19" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '20" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '21" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '22" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '23" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '24" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '25" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '26" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '27" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '28" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '29" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '30" class="form-control"/></td>' +
                    '<td><input type="text"  id="col' + count + '31" class="form-control"/></td>' +
                    '<td class="month28Days"><input type="text"  id="col' + count + '32" class="form-control"/></td>' +
                    '<td class="month29Days"><input type="text"  id="col' + count + '33" class="form-control"/></td>' +
                    '<td class="month30Days"><input type="text"  id="col' + count + '34" class="form-control"/></td>' +
                  '</tr>';*/
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
            for (var j = 0; j < 35; j++) {
                $('#col' + i + '' + j).val(array[i][j]);
            }
        }
        //HOUR TYPE DEFAULT 
        for (var i = 0; i < count; i++) {
            if (!$('#col' + i + '2').val()) {
                $('#col' + i + '2').val("Normal Hour");
            }
        }
        // $('#col' + i + '' + j).val(array[i][j]);
    }
}

function updateLineTotal() {
    console.log(count);
    if (count > 1) {
        var sumCol = 0;
        for (var i = 0; i < (count - 1) ; i++) {
            var sumLine = 0;
            for (var j = 4; j < 35; j++) {
                var temp = Number($('#col' + i + ''+j).val());
                //console.log("Valor cada coluna: " + $('#col' + i + ''+j).val());
                //console.log("Temp= "+ temp);
                if (temp>0) {
                    //alert($('#col' + i + '3').val());
                    sumLine += temp;
                    $('#col' + i + '3').val(sumLine);
                    //console.log("Soma= " + sumLine);
                } else $('#col' + i + ''+j).val(0);
            }
            sumCol += sumLine;
        }
    }
    //totalHour $("#newLine").html(newLine);
    $('#totalHour').html(sumCol);
    //console.log("Total= " + sumCol);
}




