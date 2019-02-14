function onMessage(event) {

  var name = "";
  var message = "";
  
  if (event.space.type == "DM") {
    name = "You";
  } else {
    name = event.user.displayName;
  }
  
  // message = name + " said \"" + event.message.text + "\"";
  message = getManualURL(event.message.text);
  return { "text": message }; 
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
  var message = "";

  if (event.space.type == "DM") {
    message = "Thank you for adding me to a DM, " + event.user.displayName + "!";
  } else {
    message = "Thank you for adding me to " + event.space.displayName;
  }

  if (event.message) {
    // Bot added through @mention.
    message = message + " and you said : \"" + event.message.text + "\"";
  }

  return { "text": message };
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
  console.info("Bot removed from ", event.space.name);
}

function getManualURL(target) {
//  var URL = "https://docs.google.com/spreadsheets/d/1qRFNwXAqnXKbm1ry452MYFzMZ-DLZEi7WgE9GczkHRo/edit#gid=0"; //ファイル非共有（なはず・・・）
  var URL = "https://docs.google.com/spreadsheets/d/14gF_mGaMyxqxowmRM9LTySC4jmbeDqpjdXLIOX6CLxY/edit#gid=0"; 
  // スプレットシート取得
  var ss = SpreadsheetApp.openByUrl(URL);
  
  //シート取得
  var sheet = ss.getActiveSheet();
 
 //最終行を取得
  var lastRow = sheet.getLastRow();
  
  //最終列を取得
  var lastColumn = sheet.getLastColumn();
 
  //全セル取得
  var values = sheet.getRange(2,1,lastRow,lastColumn).getValues();
  
  //=====valuesの中身=====
  //・[行][列]
  //・[n][0](ID)
  //・[n][1](ファイル名)
  //・[n][2](URL)
  //・[n][3](キーワード) <-カンマ区切り
  
  //======処理ステップ======
  //1.キーワードの２次元配列([n][キーワードn])を作成
  //2.入力された検索ワード(target)とステップ１で作成したキーワードを比較(ここが検索部分)
  //3.全件一致
  //4.部分一致
  //5.1文字一致
  //6.全書き出し(HTML生成の予定)
  
  
  //連想配列に変換(使っちゃダメって言われた)
  //var hashData = {};
  // for (var i = 0; i < lastRow; i++) {
  //    hashData[values[i][0]] = values[i][1] ;
  //}
  
  //検索ワードたち
  var serchWord = [];
  
  //=====キーワードのカンマ区切りをばらす=====
  for(var i = 0;i < lastRow; i++)
  {
     var _word = values[i][3].split(",");
     
     serchWord[i] = [];
     
     for(var j = 0;j < _word.length;j++)
     {
       serchWord[i][j]= _word[j];
     }
  }
  
  //最初に入れておく文字列(基本はエラーとかの文字でいい)
  var defomessage = "";
  
  //デフォルトの文字列を設定
  var message = defomessage;
  
  //検索優先順位
  //1.全件一致      //OK
  //2.部分一致      //OK
  //4.全書き出し    //
  
  
  
  //===完全一致===
  for(var i = 0;i < lastRow; i++)
  {
    //ファイル名一致確認
    if(target == values[i][1]){return message = values[i][1] +"\n"+ values[i][2] +"\n"+ "[全件ファイル名]\n"}
  
    //キーワード一致確認
    for(var j = 0;j<serchWord[i].length;j++)
    {
       if(target == serchWord[i][j])
       {
           message　+= values[i][1] +"\n"+ values[i][2] +"\n"+ "[全件キーワード]\n";
       }
    }
    
    //ID一致確認
    if(target == values[i][0]){return message = values[i][1] +"\n"+ values[i][2] +"\n"+ "[ID]\n"}
  }
  
  if(message != "") return message;
  
  //===部分一致===
  for(var i = 0;i < lastRow; i++)
  {
    //ファイル名部分一致確認
    if(values[i][1].indexOf(target) > -1 ){return message = values[i][1] +"\n"+ values[i][2] +"\n"+ "[部分ファイル名]\n"}
      
    //キーワード一致確認
    for(var j = 0;j<serchWord[i].length;j++)
    {
       if(serchWord[i][j].indexOf(target) > -1 )
       {
           message　= values[i][1] +"\n"+ values[i][2] +"\n"+ "[部分ヒットキーワード: " +serchWord[i][j]+ "]\n";
       }
    }
  }
  
   if(message != "") return message;
  
//    // 文字列を一文字ずつ分割
//    var targetAr = target.split("");
//    var keyAr = key.split("");
//    
//    // １血文字ずつ検索
//    for (var i = 0; i < target.length; i++) {
//      for(var j = 0; j < key.length; j++){     
//        if(targetAr[i] == key[j]) 
//        {
//          message = key+hashData[key] +"[1文字]"; 
//        }
//      }
//    
//  }
  
  //上の処理すべてに引っかからなかった場合全件表示機能発動
  if(defomessage == message)
  {
     message = "ここをみたまえ\n" +"https://script.google.com/a/3-ize.jp/macros/s/AKfycbzJ32porNi08HFH6_P675W-VKTSw7fPJOxszQbKe2Y/dev";
  }

return message;
}


//loading()で任意のスプレッドシートのデータを格納します。
function loading() {
    var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/14gF_mGaMyxqxowmRM9LTySC4jmbeDqpjdXLIOX6CLxY/edit#gid=0");
    var listss = ss.getSheetByName("シート1");
    //最終行を調べる
    var lastrow = listss.getLastRow();
    
    var list = listss.getRange(2, 1, lastrow-1, 3).getValues();

    return list;
}

function doGet() {
    var htmlOutput = HtmlService.createTemplateFromFile("index").evaluate();
    return htmlOutput;
}
