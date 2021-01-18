function init()
{
   tableId = 'your tableId';   
   googleKey = 'your googleKey';
   ss = SpreadsheetApp.openById(tableId);
   leadsSheet = ss.getSheetByName('Leads');  
}

function doPost(e){
   init();  
   let dataFromGoogleAds = JSON.parse(e.postData.contents);
   let date = new Date().toISOString().slice(0,10);
   let userColumnData = dataFromGoogleAds.user_column_data;
   let formId = dataFromGoogleAds.form_id;
   let header = getCurrentTableHeader();
   let userColumnDataNew = changeDataArray(userColumnData);
   if (dataFromGoogleAds.google_key == googleKey)
   { 
     let row = [date,formId];       
     header = updateHeader(header, userColumnData);     
     for(i=2;i<header.length;i++)
     {
       row.push(userColumnDataNew.hasOwnProperty(header[i]) ? userColumnDataNew[header[i]] : "");
     }          
     leadsSheet.appendRow(row);  
   }    
}

function getCurrentTableHeader(){
  init();
  let lastColumn = leadsSheet.getLastColumn();  
  let tableHeader = [];
  if(lastColumn == 0)
  {
    tableHeader = ["Date", "Form ID"];
  }
  else
  {
    let range = leadsSheet.getRange(1,1,1,lastColumn);
    let values = range.getValues();
    tableHeader = values[0];
  }  
  return tableHeader;
}

function updateHeader(header, userColumnData){
  for(i=0;i<userColumnData.length;i++)
       {
         if(!header.includes(userColumnData[i].column_name))
         {
           header.push(userColumnData[i].column_name);           
         } 
       }  
  let values = [];
  values[0] = header;
  leadsSheet.getRange(1, 1, 1, header.length).setValues(values);
  return header;    
}

function changeDataArray(userColumnData){  
   let userColumnDataNew = [];
   for(i=0;i<userColumnData.length;i++)
   {
     userColumnDataNew[userColumnData[i].column_name] = userColumnData[i].string_value;
   }
   return userColumnDataNew;
}






