/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ReportGenerator from './components/ReportGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EUI 香港印尼交易觀測查核報告產生器</h1>
          <p className="text-gray-500 mt-2">上傳 6 份交易數據檔案，自動產生查核報告書</p>
        </header>
        <ReportGenerator />
      </div>
    </div>
  );
}
