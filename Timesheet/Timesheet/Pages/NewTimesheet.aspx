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
            <!--
              <tbody>
              <tr>
                <td><select class="form-control results" id="col0"></select></td>
                <td><select class="form-control" id="col1">
                        <option value="N">Normal Hour</option>
                        <option value="S">Supplemental Hour</option>
                        <option value="O">Overtime Hour</option>
                        <option value="G">Gratuity Hour</option>
                    </select>
                </td>
                <td><input type="text"  id="col2" class="form-control "/></td>
                <td><input type="text"  id="col3" class="form-control"/></td>
                
                  <td><input type="text"  id="col4" class="form-control"/></td>
                  <td><input type="text"  id="col5" class="form-control"/></td>
                  <td><input type="text"  id="col6" class="form-control"/></td>
                  <td><input type="text"  id="col7" class="form-control"/></td>
                  <td><input type="text"  id="col8" class="form-control"/></td>
                  <td><input type="text"  id="col9" class="form-control"/></td>
                  <td><input type="text"  id="col10" class="form-control"/></td>
                  <td><input type="text"  id="col11" class="form-control"/></td>
                  <td><input type="text"  id="col12" class="form-control"/></td>
                  <td><input type="text"  id="col13" class="form-control"/></td>
                  <td><input type="text"  id="col14" class="form-control"/></td>
                  <td><input type="text"  id="col15" class="form-control"/></td>
                  <td><input type="text"  id="col16" class="form-control"/></td>
                  <td><input type="text"  id="col17" class="form-control"/></td>
                  <td><input type="text"  id="col18" class="form-control"/></td>
                  <td><input type="text"  id="col19" class="form-control"/></td>
                  <td><input type="text"  id="col20" class="form-control"/></td>
                  <td><input type="text"  id="col21" class="form-control"/></td>
                  <td><input type="text"  id="col22" class="form-control"/></td>
                  <td><input type="text"  id="col23" class="form-control"/></td>
                  <td><input type="text"  id="col24" class="form-control"/></td>
                  <td><input type="text"  id="col25" class="form-control"/></td>
                  <td><input type="text"  id="col26" class="form-control"/></td>
                  <td><input type="text"  id="col27" class="form-control"/></td>
                  <td><input type="text"  id="col28" class="form-control"/></td>
                  <td><input type="text"  id="col29" class="form-control"/></td>
                  <td><input type="text"  id="col30" class="form-control"/></td>
                  <td class="month28Days"><input type="text"  id="col31" class="form-control"/></td>
                  <td class="month29Days"><input type="text"  id="col32" class="form-control"/></td>
                  <td class="month30Days"><input type="text"  id="col33" class="form-control"/></td>
              </tr>
              
                
            </tbody>-->
            
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
