<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>


<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />

     <!-- JS used to make the SPService works with people picker -->
    <SharePoint:ScriptLink name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false" />
    


    <meta name="WebPartPageExpansion" content="full" />

    <!-- Ajoutez vos styles CSS au fichier suivant -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/jquery-ui.css" />

    <!-- Ajoutez votre code JavaScript au fichier suivant -->
    <script type="text/javascript" src="../Scripts/NewTimesheet.js"></script>
    <script type="text/javascript" src="../Scripts/AddAttachmentFile.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-ui-1.12.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.SPServices-2014.02.min.js"></script>

</asp:Content>

<%-- Le balisage de l'élément Content suivant sera placé dans la partie TitleArea de la page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    New Timesheet
</asp:Content>

<%-- Le balisage et le script de l'élément Content suivant seront placés dans la partie <body> de la page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <br />
    <br />
     
    <div id="errorMsg"></div>
    <div id="warningMsg"></div>

    <form autocomplete="off">
         <div class="form-group row">
            <div class="col-xs-6">
                <a href="../Pages/Default.aspx" id="backBtn" class="btn btn-default " role="button">BACK</a>
               <!-- <button onclick="location.href='../Pages/Default.aspx'" id="backBtn" type="submit" class="btn btn-primary">BACK</button>-->
                
                <input name="Submit" id="Submit" type="button" value="SAVE" class="btn btn-default btn-lg" />
        
            </div>
        </div>
         
        <div class="form-group row">
            <div class="col-xs-2">
                <label for="txtMonth">Month</label>
                <input type="text" name="txtMonth" id="txtMonth" class="date-picker-month form-control changeDate" onchange="numberOfDaysInMonth()" />
            </div>
        </div>
         <div class="form-group row">
            <div class="col-xs-2">
                <label for="txtYear">Year</label>
                <input type="text" name="txtFromYear" id="txtYear" class="date-picker-year form-control changeDate" />
            </div>
        </div>

        
         <div class="form-group row" id="approverMember">
            <div class="col-xs-2">
                <label for="SdfPeoplePicker">User</label>
                <div id="peoplePickerDivLinMan" title="User_"></div>
            </div>
        </div>

        <div class="form-group row">
            <div class="col-xs-2">
                <label for="customFileUploadControl">File input</label>
                <input id="customFileUploadControl" type="file" />
                <small>Maximum upload file size: 2MB</small>
            </div>
        </div>

        
         
        <div class="container" id="myclass">
         
          <table class="form-group table-bordered table-reflow">
            <thead>
              <tr>
                <th></th>
                <th class="col-xs-3"><label for="results">Project</label></th>
                <th class="col-xs-1"><label for="dayType">Day Type</label></th>
                <th class="col-xs-1"><label for="hourType">Hour Type</label></th>
                <th class="projectTotal">Total</th>
                <th>01</th>
                <th>02</th>
                <th>03</th>
                <th>04</th>
                <th>05</th>
                <th>06</th>
                <th>07</th>
                <th>08</th>
                <th>09</th>
                <th>10</th>
                <th>11</th>
                <th>12</th>
                <th>13</th>
                <th>14</th>
                <th>15</th>
                <th>16</th>
                <th>17</th>
                <th>18</th>
                <th>19</th>
                <th>20</th>
                <th>21</th>
                <th>22</th>
                <th>23</th>
                <th>24</th>
                <th>25</th>
                <th>26</th>
                <th>27</th>
                <th>28</th>
                <th class="month28Days">29</th>
                <th class="month29Days">30</th>
                <th class="month30Days">31</th>
                <th class="notShow"></th>
              </tr>
            </thead>
           
            <tbody id="newLine"></tbody>
            <tbody id="msg"></tbody> 
          </table>
                
                <p class=".col-md-8">New: <a href="#" id="otherProject"><span class="glyphicon glyphicon-plus-sign"></span></a> / Delete Selected Lines: <a href="#" id="deleteLine"><span class="glyphicon glyphicon glyphicon-minus-sign"></span></a> </p>
               
        </div>
        <br />
        <p><strong>Total: <span id="totalHour">0</span></strong></p>
         
    </form>


  <br /><br />


</asp:Content>
