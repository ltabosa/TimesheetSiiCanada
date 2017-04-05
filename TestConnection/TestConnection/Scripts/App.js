'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // Ce code s'exécute quand le modèle DOM est prêt. Par ailleurs, il crée un objet de contexte nécessaire à l'utilisation du modèle objet SharePoint
    $(document).ready(function () {
        getUserName();
        attachFileToMyTimesheet("Leonardo Tabosa", "April", "2017");
    });

    // Cette fonction prépare, charge, puis exécute une requête SharePoint pour obtenir des informations sur les utilisateurs actuels
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // Cette fonction est exécutée si l'appel ci-dessus est réussi
    // Elle remplace le contenu de l'élément 'message' par le nom de l'utilisateur
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
    }

    // Cette fonction est exécutée en cas d'échec de l'appel ci-dessus
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }
}
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
                                         //'<Eq>' +
                                         //    '<FieldRef Name=\'ReportOwner\' LookupId=\'TRUE\'/>' +
                                         //    '<Value Type=\'User\'>' + userId + '</Value>' +
                                         //'</Eq>' +
                                          '<Eq>' +
                                             '<FieldRef Name=\'ReportOwner\' />' +
                                             '<Value Type=\'User\'>' + userId + '</Value>' +
                                         '</Eq>' +
                                     '</And>' +
                                '</Where>' +
                            '<OrderBy>' +
                                '<FieldRef Name=\'Title\' Ascending=\'TRUE\' />' +
                                '</OrderBy>' +
                            '</Query>' +
                            '<ViewFields>' +
                                '<FieldRef Name=\'ID\' />' +
                                '<FieldRef Name=\'Title\' />' +
                            '</ViewFields>' +
                          '</View>');
    window.collListItem = oList.getItems(camlQuery);
    context.load(collListItem, 'Include(Id,Title)');
    context.executeQueryAsync(Function.createDelegate(this, window.onQuerySucceededAddFileToListMyTimesheet),
    Function.createDelegate(this, window.onQueryFailedToTakeId));
    //}

   
}
function onQueryFailedToTakeId(sender, args) {
    alert('Query failed. Error: ' + args.get_message());
}

function onQuerySucceededAddFileToListMyTimesheet() {
    var listEnumerator = collListItem.getEnumerator();

    while (listEnumerator.moveNext()) {
        var oListItem = listEnumerator.get_current();
        itemId = oListItem.get_id();
    }
    addFileToListMyTimesheet(itemId);
    //window.location.href = '../Pages/Default.aspx';
}
