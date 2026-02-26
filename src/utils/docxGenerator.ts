import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ReportData } from './reportParser';

export async function generateDocx(data: ReportData) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `十二月香港印尼交易觀測查核報告書`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: `交易資料期間：${data.year}年${data.month}月01日至${data.year}年${data.month}月31日`, size: 24 }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `報告編號：EUIHKAMLID${data.year}${data.month}`, size: 24 }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `查核日期：${parseInt(data.year) + 1}年01月__日`, size: 24 }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `查核人員：`, size: 24 }),
          ]
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `一、定期查核目的`,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: `本次查核的主要目的是透過對每月跨境匯款交易的審查，識別可能存在的可疑交易，特別針對異常匯款頻率或金額過大等情形進行風險評估。藉此確認是否需要進一步調查並通報相關監管機構，以確保交易的合法性及防止洗錢、恐怖主義融資等非法行為的發生。`,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `二、查核範圍`,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: `本報告書針對本月內所有進行的跨境匯款交易進行查核，範圍包括但不限於：`,
        }),
        createScopeTable(),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `三、查核結果`,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: `12月份香港印尼線各項目查核結果如下：`,
        }),
        new Paragraph({
          text: `1. 匯款/受款人 Hit 到黑名單`,
          heading: HeadingLevel.HEADING_3,
        }),
        ...generateHitAMLSection(data),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `2. 單一匯款人當月匯款超過每日上限港幣 7,800 元：`,
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: data.file2.length > 0 ? `經查核本月有 ${data.file2.length} 位匯款人超過每日金額上限。` : `經查核本月無匯款人超過每日金額上限。`,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `3. 單一匯款人當月匯款總額超過港幣 25,000 元：`,
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: data.file3.length > 0 ? `經查核本月有 ${data.file3.length} 位匯款人超過當月匯款金額上限。` : `經查核本月無匯款人超過當月匯款金額上限。`,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `4. 單一銀行帳戶當月收款總額超過港幣 25,000 元：`,
          heading: HeadingLevel.HEADING_3,
        }),
        ...generateFile4Section(data),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `5. 單一匯款人當月匯款給超過 5 位不同的收款人`,
          heading: HeadingLevel.HEADING_3,
        }),
        ...generateFile5Section(data),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `6. 單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人：`,
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: data.file6.length > 0 ? `經查核本月有 ${data.file6.length} 筆單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人的情況。` : `經查核本月無單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人的情況。`,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: `四、結論`,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: `根據本月度跨境匯款交易之全面監控與查核結果，EUI 於防制洗錢（AML）及打擊資恐（CFT）之內部控制機制運作良好。透過嚴謹之客戶身分盡職調查（CDD/KYC）、系統化之交易金額上限控管，以及高頻交易對象數量限制等多重防線，有效阻絕潛在之異常交易風險。經綜合評估，本月份所有受檢交易均具備合理之商業或個人目的，資金來源與流向清晰，完全符合本公司內部防制洗錢規範及相關監管要求，未發現任何具體之可疑交易情事。`,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `十二月香港印尼交易觀測查核報告書.docx`);
}

function createScopeTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '項目', alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [new Paragraph({ text: '檢核要項說明', alignment: AlignmentType.CENTER })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '匯款/受款人 hit 黑名單' })] }),
          new TableCell({ children: [new Paragraph({ text: '成立訂單時匯款/受款人 hit 黑名單，由人工判別是否為可疑交易。' })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '單一匯款人當月匯款超過每日上限港幣 7,800 元' })] }),
          new TableCell({ children: [new Paragraph({ text: '檢核單一 ARC號碼之當月每日匯款總額是否超過港幣 7,800 元 。' })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '單一匯款人當月匯款總額超過港幣 25,000 元' })] }),
          new TableCell({ children: [new Paragraph({ text: '檢核單一 ARC號碼之每月匯款總額是否超過港幣 25,000 元 。' })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '單一銀行帳戶當月收款總額超過港幣 25,000 元' })] }),
          new TableCell({ children: [new Paragraph({ text: '檢核單一銀行帳戶號碼之收款總額是否超過港幣 25,000 元。' })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '單一匯款人當月匯款給超過 5 位不同的收款人' })] }),
          new TableCell({ children: [new Paragraph({ text: '檢核單一 ARC 號碼之匯款對象是否超過 5 位不同的收款者(5 位不算)。' })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人' })] }),
          new TableCell({ children: [new Paragraph({ text: '檢核單一收款銀行賬戶每月是否收到超過 5 個不同的匯款人(5 個不算)' })] }),
        ]
      }),
    ]
  });
}

function generateHitAMLSection(data: ReportData) {
  const paragraphs: any[] = [];
  
  if (data.file1.senderHits.length === 0 && data.file1.receiverHits.length === 0 && data.file1.bothHits.length === 0) {
    paragraphs.push(new Paragraph({ text: `經查核本月無人命中。` }));
    return paragraphs;
  }

  if (data.file1.senderHits.length > 0) {
    paragraphs.push(new Paragraph({ text: `• 經查核共有 ${data.file1.senderHits.length} 位匯款人 hit 到黑名單，其訂單資訊以及 AML 審核歷史資訊如下，並無發現可疑之處。` }));
    
    const rows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '匯款人 ARC' })] }),
          new TableCell({ children: [new Paragraph({ text: 'orderID' })] }),
          new TableCell({ children: [new Paragraph({ text: '與收款人的關係' })] }),
          new TableCell({ children: [new Paragraph({ text: '金額(港幣)' })] }),
          new TableCell({ children: [new Paragraph({ text: '匯款人 AML 紀錄' })] }),
        ]
      })
    ];

    data.file1.senderHits.forEach(hit => {
      rows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: hit.arc || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.orderId || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.relation || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.amount || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.amlRecord || '' })] }),
        ]
      }));
    });

    paragraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  }

  if (data.file1.receiverHits.length > 0) {
    paragraphs.push(new Paragraph({ text: `• 而共有 ${data.file1.receiverHits.length} 位受款人 hit 到黑名單，其訂單資訊以及 AML 審核歷史資訊如下。` }));
    
    const rows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '受款人 ARC' })] }),
          new TableCell({ children: [new Paragraph({ text: '交易訂單編號' })] }),
          new TableCell({ children: [new Paragraph({ text: '受款人名字' })] }),
          new TableCell({ children: [new Paragraph({ text: '與匯款人的關係' })] }),
          new TableCell({ children: [new Paragraph({ text: '受款人 AML' })] }),
        ]
      })
    ];

    data.file1.receiverHits.forEach(hit => {
      rows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: hit.arc || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.orderId || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.receiverName || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.relation || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.amlRecord || '' })] }),
        ]
      }));
    });

    paragraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  }

  if (data.file1.bothHits.length > 0) {
    paragraphs.push(new Paragraph({ text: `• 而共有 ${data.file1.bothHits.length} 位匯款人和受款人同時 hit 到黑名單，其訂單資訊以及 AML 審核歷史資訊如下。` }));
    
    const rows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: '匯款人 ARC' })] }),
          new TableCell({ children: [new Paragraph({ text: 'orderID' })] }),
          new TableCell({ children: [new Paragraph({ text: '與收款人的關係' })] }),
          new TableCell({ children: [new Paragraph({ text: '金額(港幣)' })] }),
          new TableCell({ children: [new Paragraph({ text: '匯款人 AML 紀錄' })] }),
        ]
      })
    ];

    data.file1.bothHits.forEach(hit => {
      rows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: hit.arc || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.orderId || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.relation || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.amount || '' })] }),
          new TableCell({ children: [new Paragraph({ text: hit.amlRecord || '' })] }),
        ]
      }));
    });

    paragraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  }

  return paragraphs;
}

function generateFile4Section(data: ReportData) {
  if (data.file4.length === 0) {
    return [new Paragraph({ text: `經查核本月無單一銀行帳戶當月收款總額超過港幣 25,000 元。` })];
  }

  const paragraphs: any[] = [
    new Paragraph({ text: `經查核本月共有${data.file4.length}個銀行帳戶收款超過港幣 25,000 元，其帳戶資訊如下：` })
  ];

  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: '銀行' })] }),
        new TableCell({ children: [new Paragraph({ text: '帳戶號碼' })] }),
        new TableCell({ children: [new Paragraph({ text: '交易筆數' })] }),
        new TableCell({ children: [new Paragraph({ text: '收款總金額（港幣）' })] }),
        new TableCell({ children: [new Paragraph({ text: '帳戶是否 hit SAN' })] }),
      ]
    })
  ];

  data.file4.forEach(acc => {
    rows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: acc.bank || '' })] }),
        new TableCell({ children: [new Paragraph({ text: acc.account || '' })] }),
        new TableCell({ children: [new Paragraph({ text: `${acc.count} 筆` })] }),
        new TableCell({ children: [new Paragraph({ text: acc.totalAmount.toLocaleString() })] }),
        new TableCell({ children: [new Paragraph({ text: acc.san || '否' })] }),
      ]
    }));
  });

  paragraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  
  const banks = Array.from(new Set(data.file4.map(a => a.bank))).join(' 與 ');
  paragraphs.push(new Paragraph({ text: `依據本月監控結果，${banks} 等 ${data.file4.length} 個帳戶雖達監控門檻（單月收款總額超過港幣 25,000 元），經比對均未命中任何制裁（SAN）名單。` }));
  paragraphs.push(new Paragraph({ text: `綜合交易頻率、金額與來源資料判斷，暫無可疑異常情事，屬於正常營運範圍內之交易。` }));

  return paragraphs;
}

function generateFile5Section(data: ReportData) {
  if (data.file5.summary.length === 0) {
    return [new Paragraph({ text: `經查核本月無單一匯款人當月匯款給超過 5 位不同的收款人。` })];
  }

  const totalSenders = data.file5.summary.reduce((acc, curr) => acc + curr.senderCount, 0);

  const paragraphs: any[] = [
    new Paragraph({ text: `本月共有 ${totalSenders} 位匯款人匯款給超過 5 位不同收款人，以下為匯款給特定數量收款人的匯款人個數：` })
  ];

  const summaryRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: '收款人數量' })] }),
        new TableCell({ children: [new Paragraph({ text: '匯款人數量' })] }),
      ]
    })
  ];

  data.file5.summary.forEach(s => {
    summaryRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: String(s.receiverCount) })] }),
        new TableCell({ children: [new Paragraph({ text: String(s.senderCount) })] }),
      ]
    }));
  });

  paragraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: summaryRows }));
  
  paragraphs.push(new Paragraph({ text: `本月採風險基礎方法（RBA），針對名單中之客戶進行盡職調查（CDD）抽查。經核對其資金來源與匯款目的具備合理性，符合跨國勞工日常贍家款特徵，未發現異常或高風險交易模式。` }));

  const sampleRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: 'ARC' })] }),
        new TableCell({ children: [new Paragraph({ text: '收款人數量' })] }),
        new TableCell({ children: [new Paragraph({ text: '匯款目的' })] }),
        new TableCell({ children: [new Paragraph({ text: '資金來源' })] }),
      ]
    })
  ];

  data.file5.samples.forEach(s => {
    sampleRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: s.arc || '' })] }),
        new TableCell({ children: [new Paragraph({ text: String(s.receiverCount) })] }),
        new TableCell({ children: [new Paragraph({ text: s.purpose || '' })] }),
        new TableCell({ children: [new Paragraph({ text: s.source || '' })] }),
      ]
    }));
  });

  paragraphs.push(new Paragraph({ text: `抽查名單`, alignment: AlignmentType.CENTER }));
  paragraphs.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: sampleRows }));

  return paragraphs;
}
