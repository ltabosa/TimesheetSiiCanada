$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', monthYearFieldFill);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', lookupProject);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', numberOfDaysInMonth);
    count = 0;
    newLine = "";

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
    //class="month28Days month29Days month30Days"
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
    count++;
    //alert(count);
    //newLine += "aqui    ";
    
    
    newLine += '<tr>' +
                '<td><select class="form-control results"></select></td>' +
                '<td><select class="form-control" id="hourType' + count + '">' +
                        '<option value="N">Normal Hour</option>' +
                        '<option value="S">Supplemental Hour</option>' +
                        '<option value="O">Overtime Hour</option>' +
                        '<option value="G">Gratuity Hour</option>' +
                    '</select>' +
                '</td>' +
                '<td><input type="text"  id="txtTotal1' + count + '" class="form-control "/></td>' +
                '<td><input type="text"  id="day1' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day2' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day3' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day4' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day5' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day6' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day7' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day8' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day9' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day10' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day11' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day12' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day13' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day14' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day15' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day16' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day17' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day18' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day19' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day20' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day21' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day22' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day23' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day24' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day25' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day26' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day27' + count + '" class="form-control"/></td>' +
                '<td><input type="text"  id="day28' + count + '" class="form-control"/></td>' +
                '<td class="month28Days"><input type="text"  id="day29' + count + '" class="form-control"/></td>' +
                '<td class="month29Days"><input type="text"  id="day30' + count + '" class="form-control"/></td>' +
                '<td class="month30Days"><input type="text"  id="day31' + count + '" class="form-control"/></td>' +
              '</tr>';

    
    $("#newLine").html(newLine);
    numberOfDaysInMonth();
    lookupProject();
}




