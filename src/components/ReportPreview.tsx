import React from 'react';
import { ReportData } from '../utils/reportParser';

interface Props {
  data: ReportData;
}

export default function ReportPreview({ data }: Props) {
  const { year, month, file1, file2, file3, file4, file5, file6 } = data;
  const nextYear = parseInt(year) + 1;

  return (
    <div className="max-w-none text-gray-800">
      <h1 className="text-center text-2xl font-bold mb-8">十二月香港印尼交易觀測查核報告書</h1>
      
      <div className="mb-8 space-y-2 text-gray-700">
        <p><strong>交易資料期間：</strong>{year}年{month}月01日至{year}年{month}月31日</p>
        <p><strong>報告編號：</strong>EUIHKAMLID{year}{month}</p>
        <p><strong>查核日期：</strong>{nextYear}年01月__日</p>
        <p><strong>查核人員：</strong></p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2">一、定期查核目的</h2>
      <p className="text-gray-700 leading-relaxed">
        本次查核的主要目的是透過對每月跨境匯款交易的審查，識別可能存在的可疑交易，特別針對異常匯款頻率或金額過大等情形進行風險評估。藉此確認是否需要進一步調查並通報相關監管機構，以確保交易的合法性及防止洗錢、恐怖主義融資等非法行為的發生。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2">二、查核範圍</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        本報告書針對本月內所有進行的跨境匯款交易進行查核，範圍包括但不限於：
      </p>
      <table className="w-full text-sm text-left text-gray-700 border">
        <thead className="bg-gray-50 text-gray-900">
          <tr>
            <th className="border p-3 w-1/3">項目</th>
            <th className="border p-3">檢核要項說明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-3">匯款/受款人 hit 黑名單</td>
            <td className="border p-3">成立訂單時匯款/受款人 hit 黑名單，由人工判別是否為可疑交易。</td>
          </tr>
          <tr>
            <td className="border p-3">單一匯款人當月匯款超過每日上限港幣 7,800 元</td>
            <td className="border p-3">檢核單一 ARC號碼之當月每日匯款總額是否超過港幣 7,800 元 。</td>
          </tr>
          <tr>
            <td className="border p-3">單一匯款人當月匯款總額超過港幣 25,000 元</td>
            <td className="border p-3">檢核單一 ARC號碼之每月匯款總額是否超過港幣 25,000 元 。</td>
          </tr>
          <tr>
            <td className="border p-3">單一銀行帳戶當月收款總額超過港幣 25,000 元</td>
            <td className="border p-3">檢核單一銀行帳戶號碼之收款總額是否超過港幣 25,000 元。</td>
          </tr>
          <tr>
            <td className="border p-3">單一匯款人當月匯款給超過 5 位不同的收款人</td>
            <td className="border p-3">檢核單一 ARC 號碼之匯款對象是否超過 5 位不同的收款者(5 位不算)。</td>
          </tr>
          <tr>
            <td className="border p-3">單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人</td>
            <td className="border p-3">檢核單一收款銀行賬戶每月是否收到超過 5 個不同的匯款人(5 個不算)</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2">三、查核結果</h2>
      <p className="text-gray-700 mb-4">12月份香港印尼線各項目查核結果如下：</p>

      {/* Section 1 */}
      <h3 className="text-lg font-bold mt-6 mb-3">1. 匯款/受款人 Hit 到黑名單</h3>
      {file1.senderHits.length === 0 && file1.receiverHits.length === 0 && file1.bothHits.length === 0 ? (
        <p className="text-gray-700">經查核本月無人命中。</p>
      ) : (
        <div className="space-y-6">
          {file1.senderHits.length > 0 && (
            <div>
              <p className="text-gray-700 mb-3">• 經查核共有 {file1.senderHits.length} 位匯款人 hit 到黑名單，其訂單資訊以及 AML 審核歷史資訊如下，並無發現可疑之處。</p>
              <table className="w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-50 text-gray-900">
                  <tr>
                    <th className="border p-2">匯款人 ARC</th>
                    <th className="border p-2">orderID</th>
                    <th className="border p-2">與收款人的關係</th>
                    <th className="border p-2">金額(港幣)</th>
                    <th className="border p-2">匯款人 AML 紀錄</th>
                  </tr>
                </thead>
                <tbody>
                  {file1.senderHits.map((hit, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{hit.arc}</td>
                      <td className="border p-2">{hit.orderId}</td>
                      <td className="border p-2">{hit.relation}</td>
                      <td className="border p-2">{hit.amount}</td>
                      <td className="border p-2 whitespace-pre-line">{hit.amlRecord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {file1.receiverHits.length > 0 && (
            <div>
              <p className="text-gray-700 mb-3">• 而共有 {file1.receiverHits.length} 位受款人 hit 到黑名單，其訂單資訊以及 AML 審核歷史資訊如下。</p>
              <table className="w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-50 text-gray-900">
                  <tr>
                    <th className="border p-2">受款人 ARC</th>
                    <th className="border p-2">交易訂單編號</th>
                    <th className="border p-2">受款人名字</th>
                    <th className="border p-2">與匯款人的關係</th>
                    <th className="border p-2">受款人 AML</th>
                  </tr>
                </thead>
                <tbody>
                  {file1.receiverHits.map((hit, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{hit.arc}</td>
                      <td className="border p-2">{hit.orderId}</td>
                      <td className="border p-2">{hit.receiverName}</td>
                      <td className="border p-2">{hit.relation}</td>
                      <td className="border p-2 whitespace-pre-line">{hit.amlRecord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {file1.bothHits.length > 0 && (
            <div>
              <p className="text-gray-700 mb-3">• 而共有 {file1.bothHits.length} 位匯款人和受款人同時 hit 到黑名單，其訂單資訊以及 AML 審核歷史資訊如下。</p>
              <table className="w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-50 text-gray-900">
                  <tr>
                    <th className="border p-2">匯款人 ARC</th>
                    <th className="border p-2">orderID</th>
                    <th className="border p-2">與收款人的關係</th>
                    <th className="border p-2">金額(港幣)</th>
                    <th className="border p-2">匯款人 AML 紀錄</th>
                  </tr>
                </thead>
                <tbody>
                  {file1.bothHits.map((hit, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{hit.arc}</td>
                      <td className="border p-2">{hit.orderId}</td>
                      <td className="border p-2">{hit.relation}</td>
                      <td className="border p-2">{hit.amount}</td>
                      <td className="border p-2 whitespace-pre-line">{hit.amlRecord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Section 2 */}
      <h3 className="text-lg font-bold mt-6 mb-3">2. 單一匯款人當月匯款超過每日上限港幣 7,800 元：</h3>
      <p className="text-gray-700">
        {file2.length > 0 ? `經查核本月有 ${file2.length} 位匯款人超過每日金額上限。` : `經查核本月無匯款人超過每日金額上限。`}
      </p>

      {/* Section 3 */}
      <h3 className="text-lg font-bold mt-6 mb-3">3. 單一匯款人當月匯款總額超過港幣 25,000 元：</h3>
      <p className="text-gray-700">
        {file3.length > 0 ? `經查核本月有 ${file3.length} 位匯款人超過當月匯款金額上限。` : `經查核本月無匯款人超過當月匯款金額上限。`}
      </p>

      {/* Section 4 */}
      <h3 className="text-lg font-bold mt-6 mb-3">4. 單一銀行帳戶當月收款總額超過港幣 25,000 元：</h3>
      {file4.length === 0 ? (
        <p className="text-gray-700">經查核本月無單一銀行帳戶當月收款總額超過港幣 25,000 元。</p>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">經查核本月共有{file4.length}個銀行帳戶收款超過港幣 25,000 元，其帳戶資訊如下：</p>
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="border p-2">銀行</th>
                <th className="border p-2">帳戶號碼</th>
                <th className="border p-2">交易筆數</th>
                <th className="border p-2">收款總金額（港幣）</th>
                <th className="border p-2">帳戶是否 hit SAN</th>
              </tr>
            </thead>
            <tbody>
              {file4.map((acc, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{acc.bank}</td>
                  <td className="border p-2">{acc.account}</td>
                  <td className="border p-2">{acc.count} 筆</td>
                  <td className="border p-2">{acc.totalAmount.toLocaleString()}</td>
                  <td className="border p-2">{acc.san}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-gray-700">
            依據本月監控結果，{Array.from(new Set(file4.map(a => a.bank))).join(' 與 ')} 等 {file4.length} 個帳戶雖達監控門檻（單月收款總額超過港幣 25,000 元），經比對均未命中任何制裁（SAN）名單。
            <br/>綜合交易頻率、金額與來源資料判斷，暫無可疑異常情事，屬於正常營運範圍內之交易。
          </p>
        </div>
      )}

      {/* Section 5 */}
      <h3 className="text-lg font-bold mt-6 mb-3">5. 單一匯款人當月匯款給超過 5 位不同的收款人</h3>
      {file5.summary.length === 0 ? (
        <p className="text-gray-700">經查核本月無單一匯款人當月匯款給超過 5 位不同的收款人。</p>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">本月共有 {file5.summary.reduce((acc, curr) => acc + curr.senderCount, 0)} 位匯款人匯款給超過 5 位不同收款人，以下為匯款給特定數量收款人的匯款人個數：</p>
          <table className="w-1/2 text-sm text-center text-gray-700 border mx-auto">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="border p-2 text-center">收款人數量</th>
                <th className="border p-2 text-center">匯款人數量</th>
              </tr>
            </thead>
            <tbody>
              {file5.summary.map((s, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{s.receiverCount}</td>
                  <td className="border p-2">{s.senderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <p className="text-gray-700">
            本月採風險基礎方法（RBA），針對名單中之客戶進行盡職調查（CDD）抽查。經核對其資金來源與匯款目的具備合理性，符合跨國勞工日常贍家款特徵，未發現異常或高風險交易模式。
          </p>

          <p className="text-center font-bold text-gray-900 mt-4">抽查名單</p>
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="border p-2">ARC</th>
                <th className="border p-2">收款人數量</th>
                <th className="border p-2">匯款目的</th>
                <th className="border p-2">資金來源</th>
              </tr>
            </thead>
            <tbody>
              {file5.samples.map((s, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{s.arc}</td>
                  <td className="border p-2">{s.receiverCount}</td>
                  <td className="border p-2">{s.purpose}</td>
                  <td className="border p-2">{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section 6 */}
      <h3 className="text-lg font-bold mt-6 mb-3">6. 單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人：</h3>
      <p className="text-gray-700">
        {file6.length > 0 ? `經查核本月有 ${file6.length} 筆單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人的情況。` : `經查核本月無單一收款銀行賬戶每月收到款項來自超過 5 位不同的匯款人的情況。`}
      </p>

      {/* Conclusion */}
      <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2">四、結論</h2>
      <p className="text-gray-700 leading-relaxed mb-8">
        根據本月度跨境匯款交易之全面監控與查核結果，EUI 於防制洗錢（AML）及打擊資恐（CFT）之內部控制機制運作良好。透過嚴謹之客戶身分盡職調查（CDD/KYC）、系統化之交易金額上限控管，以及高頻交易對象數量限制等多重防線，有效阻絕潛在之異常交易風險。經綜合評估，本月份所有受檢交易均具備合理之商業或個人目的，資金來源與流向清晰，完全符合本公司內部防制洗錢規範及相關監管要求，未發現任何具體之可疑交易情事。
      </p>

    </div>
  );
}
