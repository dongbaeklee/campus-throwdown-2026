function doGet(e) {
  var sheet = SpreadsheetApp.openById('12w5mm0mogb7-I0ulxb8TWju6divaL82ZWw-4IHOJ2jU').getActiveSheet();

  var headers = ['신청일시','참가유형','이름','학교','연락처','이메일','부문','경력','팀명','팀원1','팀원2','영수증유형','현금영수증번호','사업자번호','상호명','세금계산서이메일'];

  if (e.parameter.action === 'reset') {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    var cb0 = e.parameter.callback;
    var json0 = JSON.stringify({success: true, message: 'reset complete'});
    return ContentService
      .createTextOutput(cb0 ? cb0 + '(' + json0 + ')' : json0)
      .setMimeType(cb0 ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  if (e.parameter.action === 'count') {
    var count = Math.max(0, sheet.getLastRow() - 1);
    var cb = e.parameter.callback;
    var json = JSON.stringify({count: count});
    return ContentService
      .createTextOutput(cb ? cb + '(' + json + ')' : json)
      .setMimeType(cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
  }

  if (e.parameter.action === 'breakdown') {
    var lastRow2 = sheet.getLastRow();
    var count2 = Math.max(0, lastRow2 - 1);
    var cats = ['남성 초급', '남성 중급', '여성 초급', '여성 중급', '팀전'];
    var breakdown = {};
    cats.forEach(function(c) { breakdown[c] = 0; });
    if (lastRow2 > 1) {
      var data = sheet.getRange(2, 7, lastRow2 - 1, 1).getValues();
      data.forEach(function(row) {
        var cat = row[0];
        if (breakdown.hasOwnProperty(cat)) breakdown[cat]++;
      });
    }
    var cb2 = e.parameter.callback;
    var json2 = JSON.stringify({count: count2, breakdown: breakdown});
    return ContentService
      .createTextOutput(cb2 ? cb2 + '(' + json2 + ')' : json2)
      .setMimeType(cb2 ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
  }

  var p = e.parameter;
  var row = [
    new Date(),
    p.entry_type || '',
    p.name || '',
    p.school || '',
    p.phone || '',
    p.email || '',
    p.category_val || '',
    p.experience || '',
    p.team_name || '',
    p.member1_name || '',
    p.member2_name || '',
    p.receipt_type || '신청 안 함',
    p.receipt_phone || '',
    p.biz_number || '',
    p.biz_name || '',
    p.biz_email || ''
  ];
  sheet.appendRow(row);

  var cb3 = p.callback;
  var json3 = JSON.stringify({success: true});
  return ContentService
    .createTextOutput(cb3 ? cb3 + '(' + json3 + ')' : json3)
    .setMimeType(cb3 ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
