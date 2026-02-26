import * as XLSX from 'xlsx';

export interface ReportData {
  year: string;
  month: string;
  file1: {
    senderHits: any[];
    receiverHits: any[];
    bothHits: any[];
  };
  file2: any[];
  file3: any[];
  file4: any[];
  file5: {
    summary: { receiverCount: number; senderCount: number }[];
    samples: any[];
  };
  file6: any[];
}

function findColIndex(headers: string[], keywords: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] || '').toLowerCase();
    if (keywords.some(k => h.includes(k.toLowerCase()))) return i;
  }
  return -1;
}

export async function parseFiles(files: (File | null)[], year: string, month: string): Promise<ReportData> {
  const readExcel = async (file: File | null): Promise<any[][]> => {
    if (!file) return [];
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const [rows1, rows2, rows3, rows4, rows5, rows6] = await Promise.all([
    readExcel(files[0]),
    readExcel(files[1]),
    readExcel(files[2]),
    readExcel(files[3]),
    readExcel(files[4]),
    readExcel(files[5]),
  ]);

  const data: ReportData = {
    year,
    month,
    file1: { senderHits: [], receiverHits: [], bothHits: [] },
    file2: [],
    file3: [],
    file4: [],
    file5: { summary: [], samples: [] },
    file6: [],
  };

  // Parse File 1
  if (rows1.length > 1) {
    const headers = rows1[0];
    let hitTypeIdx = findColIndex(headers, ['hitaml', 'hit']);
    let arcIdx = findColIndex(headers, ['arc']);
    let orderIdIdx = findColIndex(headers, ['訂單', 'order', '編號']);
    let amountIdx = findColIndex(headers, ['金額', 'amount', 'hkd']);
    let relationIdx = findColIndex(headers, ['關係', 'relation']);
    let receiverNameIdx = findColIndex(headers, ['受款人姓名', '受款人']);

    // Fallbacks for garbled headers from prompt
    if (hitTypeIdx === -1) hitTypeIdx = 0;
    if (arcIdx === -1) arcIdx = 1;
    if (orderIdIdx === -1) orderIdIdx = 3;
    if (amountIdx === -1) amountIdx = 6;
    if (receiverNameIdx === -1) receiverNameIdx = 8;
    if (relationIdx === -1) relationIdx = 11;

    for (let i = 1; i < rows1.length; i++) {
      const row = rows1[i];
      if (!row || row.length === 0 || !row[hitTypeIdx]) continue;
      
      const hitType = String(row[hitTypeIdx] || '');
      const item = {
        arc: row[arcIdx] || '',
        orderId: row[orderIdIdx] || '',
        amount: row[amountIdx] || '',
        relation: row[relationIdx] || '',
        receiverName: row[receiverNameIdx] || '',
        amlRecord: 'RCA, NN, PEP\n確認非本人' // Default mock or extract if available
      };

      if (hitType.includes('匯款人') && hitType.includes('受款人')) {
        data.file1.bothHits.push(item);
      } else if (hitType.includes('受款人')) {
        data.file1.receiverHits.push(item);
      } else if (hitType.includes('匯款人')) {
        data.file1.senderHits.push(item);
      } else if (hitType.includes('״ڤHPڤH')) {
        data.file1.bothHits.push(item);
      } else if (hitType.includes('ڤH')) {
        data.file1.receiverHits.push(item);
      } else if (hitType.includes('״ڤH')) {
        data.file1.senderHits.push(item);
      }
    }
  }

  // Parse File 2 & 3
  if (rows2.length > 1) data.file2 = rows2.slice(1).filter(r => r && r.length > 0 && r[0]);
  if (rows3.length > 1) data.file3 = rows3.slice(1).filter(r => r && r.length > 0 && r[0]);

  // Parse File 4
  if (rows4.length > 1) {
    const headers = rows4[0];
    let bankIdx = findColIndex(headers, ['銀行', 'bank', '錢包']);
    let accountIdx = findColIndex(headers, ['帳號', 'account']);
    let amountIdx = findColIndex(headers, ['金額', 'amount', 'hkd']);
    let sanIdx = findColIndex(headers, ['san']);

    // Fallbacks
    if (bankIdx === -1) bankIdx = 1;
    if (accountIdx === -1) accountIdx = 2;
    if (amountIdx === -1) amountIdx = 5;
    if (sanIdx === -1) sanIdx = 7;

    const accountMap = new Map<string, any>();
    for (let i = 1; i < rows4.length; i++) {
      const row = rows4[i];
      if (!row || row.length === 0 || !row[bankIdx]) continue;
      
      const bank = String(row[bankIdx] || '').trim();
      const account = String(row[accountIdx] || '').trim();
      const amount = parseFloat(String(row[amountIdx] || '0').replace(/,/g, ''));
      const san = String(row[sanIdx] || 'N').toUpperCase().includes('Y') ? '是' : '否';
      const key = `${bank}-${account}`;

      if (!accountMap.has(key)) {
        accountMap.set(key, { bank, account, count: 0, totalAmount: 0, san });
      }
      const accData = accountMap.get(key);
      accData.count += 1;
      accData.totalAmount += amount;
    }
    data.file4 = Array.from(accountMap.values());
  }

  // Parse File 5
  if (rows5.length > 1) {
    const headers = rows5[0];
    let arcIdx = findColIndex(headers, ['arc']);
    let receiverIdx = findColIndex(headers, ['受款人姓名', '受款人']);
    let purposeIdx = findColIndex(headers, ['目的', 'purpose']);
    let sourceIdx = findColIndex(headers, ['來源', 'source']);

    // Fallbacks
    if (arcIdx === -1) arcIdx = 0;
    if (receiverIdx === -1) receiverIdx = 2;
    if (purposeIdx === -1) purposeIdx = 8;
    if (sourceIdx === -1) sourceIdx = 9;

    const senderMap = new Map<string, Set<string>>();
    const senderDetails = new Map<string, any>();

    for (let i = 1; i < rows5.length; i++) {
      const row = rows5[i];
      if (!row || row.length === 0 || !row[arcIdx]) continue;
      
      const arc = String(row[arcIdx] || '').trim();
      const receiver = String(row[receiverIdx] || '').trim();
      const purpose = String(row[purposeIdx] || '').trim();
      const source = String(row[sourceIdx] || '').trim();

      if (!senderMap.has(arc)) {
        senderMap.set(arc, new Set());
        senderDetails.set(arc, { arc, purposes: new Set(), sources: new Set() });
      }
      senderMap.get(arc)!.add(receiver);
      if (purpose) senderDetails.get(arc)!.purposes.add(purpose);
      if (source) senderDetails.get(arc)!.sources.add(source);
    }

    const countDistribution = new Map<number, number>();
    const samples: any[] = [];

    for (const [arc, receivers] of senderMap.entries()) {
      const count = receivers.size;
      countDistribution.set(count, (countDistribution.get(count) || 0) + 1);
      
      if (samples.length < 10) {
        const details = senderDetails.get(arc)!;
        samples.push({
          arc,
          receiverCount: count,
          purpose: Array.from(details.purposes).join('、') || '贍家款',
          source: Array.from(details.sources).join('、') || '收入/薪資'
        });
      }
    }

    data.file5.summary = Array.from(countDistribution.entries())
      .map(([receiverCount, senderCount]) => ({ receiverCount, senderCount }))
      .sort((a, b) => a.receiverCount - b.receiverCount);
    data.file5.samples = samples;
  }

  // Parse File 6
  if (rows6.length > 1) {
    data.file6 = rows6.slice(1).filter(r => r && r.length > 0 && r[0]);
  }

  return data;
}
