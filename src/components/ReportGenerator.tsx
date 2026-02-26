import React, { useState } from 'react';
import { Upload, FileText, Download, Play, CheckCircle2 } from 'lucide-react';
import { parseFiles, ReportData } from '../utils/reportParser';
import { generateDocx } from '../utils/docxGenerator';
import ReportPreview from './ReportPreview';

const FILE_LABELS = [
  '1. 匯款人hit AML或受款人hit AML',
  '2. 單一匯款人當月匯款每日超過7800港幣',
  '3. 單一匯款人每月匯款總額超過25000港幣',
  '4. 單一收款銀行賬戶每月收款總額超過25000港幣',
  '5. 單一匯款人每月匯款給超過5個不同的收款人',
  '6. 單一收款銀行賬戶每月收到超過5個不同的匯款人'
];

export default function ReportGenerator() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('12');
  const [files, setFiles] = useState<(File | null)[]>(Array(6).fill(null));
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (newFiles: File[]) => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      newFiles.forEach(file => {
        const name = file.name;
        if (name.includes('1.') || name.includes('1_') || name.includes('hit AML') || name.includes('hit_AML')) updatedFiles[0] = file;
        else if (name.includes('2.') || name.includes('2_') || name.includes('每日超過7800')) updatedFiles[1] = file;
        else if (name.includes('3.') || name.includes('3_') || name.includes('每月匯款總額超過25000')) updatedFiles[2] = file;
        else if (name.includes('4.') || name.includes('4_') || name.includes('每月收款總額超過25000')) updatedFiles[3] = file;
        else if (name.includes('5.') || name.includes('5_') || name.includes('超過5個不同的收款人')) updatedFiles[4] = file;
        else if (name.includes('6.') || name.includes('6_') || name.includes('超過5個不同的匯款人')) updatedFiles[5] = file;
        else if (name.startsWith('1')) updatedFiles[0] = file;
        else if (name.startsWith('2')) updatedFiles[1] = file;
        else if (name.startsWith('3')) updatedFiles[2] = file;
        else if (name.startsWith('4')) updatedFiles[3] = file;
        else if (name.startsWith('5')) updatedFiles[4] = file;
        else if (name.startsWith('6')) updatedFiles[5] = file;
      });
      return updatedFiles;
    });
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const data = await parseFiles(files, year, month);
      setReportData(data);
    } catch (err: any) {
      setError(err.message || '解析檔案時發生錯誤');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!reportData) return;
    try {
      await generateDocx(reportData);
    } catch (err: any) {
      setError(err.message || '產生 Word 檔時發生錯誤');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            報告設定
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
              <select 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月份</label>
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
              >
                {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-500" />
              上傳數據 (Excel/CSV)
            </h2>
            <p className="text-sm text-gray-500">
              請確保檔名包含對應的數字 (1-6)，例如：<br/>
              <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">1.命中名單.xlsx</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">2.每日超額.csv</code> 等
            </p>

            <div 
              className={`relative flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                multiple 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleBatchFileChange} 
                accept=".csv, .xlsx, .xls, .txt" 
              />
              <Upload className="w-8 h-8 text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-1">點擊上傳 <span className="text-gray-500 font-normal">或拖曳檔案</span></p>
              <p className="text-sm text-gray-500">支援 .csv, .xlsx, .xls</p>
            </div>
            
            {files.some(f => f !== null) && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">已配對檔案：</p>
                {files.map((file, index) => file && (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 ml-auto flex-shrink-0">({index + 1})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              產生報告預覽
            </button>
            
            {error && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Preview */}
      <div className="lg:col-span-2">
        {reportData ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="absolute top-6 right-6">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                下載 Word 檔
              </button>
            </div>
            <ReportPreview data={reportData} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 p-12">
            <FileText className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">尚未產生報告</p>
            <p className="text-sm mt-2 text-center">請在左側設定年份與月份，<br/>上傳對應的數據檔案後點擊「產生報告預覽」</p>
          </div>
        )}
      </div>
    </div>
  );
}
