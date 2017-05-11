<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- JS used to make the SPService works with people picker -->
    <SharePoint:ScriptLink name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <script type="text/javascript" src="../Scripts/jszip.min.js"></script>
    <script type="text/javascript" src="../Scripts/FileSaver.js"></script>

    <!-- Ajoutez vos styles CSS au fichier suivant -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/jquery-ui.css" />
    <!-- Ajoutez votre code JavaScript au fichier suivant -->
    <script type="text/javascript" src="../Scripts/ApproverView.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>  
    <script type="text/javascript" src="../Scripts/jquery-ui-1.12.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.SPServices-2014.02.min.js"></script>
  
</asp:Content>

<%-- Le balisage de l'élément Content suivant sera placé dans la partie TitleArea de la page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Approver View
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
     <br/><br/>
    <form autocomplete="off" class="form-inline">
    <div class="form-group row">
            
                <div class="form-group row">
            <div class="col-xs-2">
                <label for="txtMonth">Month</label>
                <input type="text" name="txtMonth" id="txtMonth" class="date-picker-month form-control changeDate mb-2 mr-sm-2 mb-sm-0" onchange="numberOfDaysInMonth()" />
            </div>
        </div>
         <div class="form-group row">
            <div class="col-xs-2">
                <label for="txtYear">Year</label>
                <input type="text" name="txtFromYear" id="txtYear" class="date-picker-year form-control changeDate mb-2 mr-sm-2 mb-sm-0" />
            </div>
        </div>
            <input name="Submit" id="Submit" onclick="downloadMonthFiles()" type="button" value="Download Attachment File" class="btn btn-default btn-lg" />
        
        </div> 
    <div id="results"></div>
    </form>
    
</asp:Content>
