<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>


<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-3.1.1.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Ajoutez vos styles CSS au fichier suivant -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/jquery-ui.css" />

    <!-- Ajoutez votre code JavaScript au fichier suivant -->
    <script type="text/javascript" src="../Scripts/NewTimesheet.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-ui-1.12.1.min.js"></script>

</asp:Content>

<%-- Le balisage de l'élément Content suivant sera placé dans la partie TitleArea de la page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    New Timesheet
</asp:Content>

<%-- Le balisage et le script de l'élément Content suivant seront placés dans la partie <body> de la page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <br />
    <br />

    <a href="#" class="btn btn-primary " role="button">BACK</a>

    <br />
    <br />
    

    <form>
         
         
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

        <div class="form-group row">
            <div class="col-xs-2">
                <label for="SdfPeoplePicker">User</label>
                <SharePoint:PeopleEditor ID="SdfPeoplePicker" runat="server" SelectionSet='User,SecGroup,SPGroup' />
            </div>
        </div>

        <div class="container" id="myclass">
          <table class="table-bordered table-reflow">
            <thead>
              <tr>
                <th class="col-xs-2"><label for="results">Project</label></th>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><select class="form-control results" id="results"></select></td>
                <td><select class="form-control" id="hourType">
                        <option value="N">Normal Hour</option>
                        <option value="S">Supplemental Hour</option>
                        <option value="O">Overtime Hour</option>
                        <option value="G">Gratuity Hour</option>
                    </select>
                </td>
                <td><input type="text"  id="txtTotal1" class="form-control "/></td>
                <td><input type="text"  id="day1" class="form-control"/></td>
                
                  <td><input type="text"  id="day2" class="form-control"/></td>
                  <td><input type="text"  id="day3" class="form-control"/></td>
                  <td><input type="text"  id="day4" class="form-control"/></td>
                  <td><input type="text"  id="day5" class="form-control"/></td>
                  <td><input type="text"  id="day6" class="form-control"/></td>
                  <td><input type="text"  id="day7" class="form-control"/></td>
                  <td><input type="text"  id="day8" class="form-control"/></td>
                  <td><input type="text"  id="day9" class="form-control"/></td>
                  <td><input type="text"  id="day10" class="form-control"/></td>
                  <td><input type="text"  id="day11" class="form-control"/></td>
                  <td><input type="text"  id="day12" class="form-control"/></td>
                  <td><input type="text"  id="day13" class="form-control"/></td>
                  <td><input type="text"  id="day14" class="form-control"/></td>
                  <td><input type="text"  id="day15" class="form-control"/></td>
                  <td><input type="text"  id="day16" class="form-control"/></td>
                  <td><input type="text"  id="day17" class="form-control"/></td>
                  <td><input type="text"  id="day18" class="form-control"/></td>
                  <td><input type="text"  id="day19" class="form-control"/></td>
                  <td><input type="text"  id="day20" class="form-control"/></td>
                  <td><input type="text"  id="day21" class="form-control"/></td>
                  <td><input type="text"  id="day22" class="form-control"/></td>
                  <td><input type="text"  id="day23" class="form-control"/></td>
                  <td><input type="text"  id="day24" class="form-control"/></td>
                  <td><input type="text"  id="day25" class="form-control"/></td>
                  <td><input type="text"  id="day26" class="form-control"/></td>
                  <td><input type="text"  id="day27" class="form-control"/></td>
                  <td><input type="text"  id="day28" class="form-control"/></td>
                  <td class="month28Days"><input type="text"  id="day29" class="form-control"/></td>
                  <td class="month29Days"><input type="text"  id="day30" class="form-control"/></td>
                  <td class="month30Days"><input type="text"  id="day31" class="form-control"/></td>
              </tr>
              
                
            </tbody>
            
            <tbody id="newLine"></tbody> 
          </table>
            <p>Other Project: <a href="#" id="otherProject"><span class="glyphicon glyphicon-plus-sign"></span></a></p>
        </div>




        <br />
        <button type="submit" class="btn btn-default">Submit</button>


        
    </form>


  


</asp:Content>


