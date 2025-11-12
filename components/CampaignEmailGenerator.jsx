'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// PERFORMANCE FIX: Dynamic import for XLSX library to reduce main bundle size (~200KB)
// XLSX will only be loaded when export functions are called
import dynamic from 'next/dynamic';
import {
  Upload, Download, Mail, Sparkles,
  FileSpreadsheet, Users, Target, Zap
} from 'lucide-react';

export default function CampaignEmailGenerator() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // Campaign configuration
  const [config, setConfig] = useState({
    campaign: 'Copilot 20% Reduction Special',
    product: 'Microsoft Copilot',
    discount: '20%',
    topLeadsCount: 50,
    tone: 'professional',
    abTesting: false
  });

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log('📁 File selected:', uploadedFile.name);
    }
  };

  const generateCampaign = async () => {
    if (!file) {
      alert('Please upload an Excel file first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('campaign', config.campaign);
      formData.append('product', config.product);
      formData.append('discount', config.discount);
      formData.append('topLeadsCount', config.topLeadsCount);
      formData.append('tone', config.tone);
      formData.append('abTesting', config.abTesting);

      const response = await fetch('/api/campaign-generator', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        console.log('✅ Campaign generated:', data);
      } else {
        alert('Error: ' + (data.error || 'Generation failed'));
      }
    } catch (error) {
      console.error('Campaign generation error:', error);
      alert('Failed to generate campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // PERFORMANCE FIX: Lazy load XLSX only when needed
  const exportToExcel = async () => {
    if (!results || !results.emails) return;

    // Dynamic import XLSX only when export is triggered
    const XLSX = await import('xlsx');

    const exportData = results.emails.map(email => ({
      'Name': email.name,
      'Company': email.company,
      'Email': email.email,
      'Subject Line': email.email_subject,
      'Email Body': email.email_body,
      ...(config.abTesting && {
        'Subject Line (B)': email.email_subject_b,
        'Email Body (B)': email.email_body_b
      }),
      'Personalization Notes': email.personalization_notes
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Emails');

    // Auto-size columns
    const maxWidth = 100;
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.min(
        Math.max(
          key.length,
          ...exportData.map(row => String(row[key] || '').length)
        ),
        maxWidth
      )
    }));
    worksheet['!cols'] = colWidths;

    const fileName = `${config.campaign.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToCSV = () => {
    if (!results || !results.emails) return;

    const headers = ['Name', 'Company', 'Email', 'Subject Line', 'Email Body', 'Personalization Notes'];
    if (config.abTesting) {
      headers.push('Subject Line (B)', 'Email Body (B)');
    }

    const csvContent = [
      headers.join(','),
      ...results.emails.map(email => [
        `"${email.name}"`,
        `"${email.company}"`,
        `"${email.email}"`,
        `"${email.email_subject.replace(/"/g, '""')}"`,
        `"${email.email_body.replace(/"/g, '""')}"`,
        `"${email.personalization_notes}"`,
        ...(config.abTesting ? [
          `"${email.email_subject_b?.replace(/"/g, '""') || ''}"`,
          `"${email.email_body_b?.replace(/"/g, '""') || ''}"`,
        ] : [])
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.campaign.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const updateEmail = (index, field, value) => {
    const updatedResults = { ...results };
    updatedResults.emails[index][field] = value;
    setResults(updatedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Campaign Email Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload your leads Excel file and generate personalized campaign emails with AI
          </p>
        </div>

        {/* Configuration Panel */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Campaign Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Name</label>
              <Input
                value={config.campaign}
                onChange={(e) => setConfig({ ...config, campaign: e.target.value })}
                placeholder="e.g., Copilot 20% Reduction"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <Input
                value={config.product}
                onChange={(e) => setConfig({ ...config, product: e.target.value })}
                placeholder="e.g., Microsoft Copilot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount</label>
              <Input
                value={config.discount}
                onChange={(e) => setConfig({ ...config, discount: e.target.value })}
                placeholder="e.g., 20%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Top Leads Count</label>
              <Input
                type="number"
                value={config.topLeadsCount}
                onChange={(e) => setConfig({ ...config, topLeadsCount: parseInt(e.target.value) })}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select
                className="w-full p-2 border rounded-md"
                value={config.tone}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="concise">Concise</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.abTesting}
                  onChange={(e) => setConfig({ ...config, abTesting: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Enable A/B Testing</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-2">
                {file ? `✓ ${file.name}` : 'Click to upload Excel file with leads'}
              </p>
              <p className="text-sm text-gray-400">
                Supports .xlsx, .xls, .csv files
              </p>
            </label>
          </div>

          <Button
            onClick={generateCampaign}
            disabled={!file || loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Generating Campaign Emails...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Campaign Emails
              </>
            )}
          </Button>
        </Card>

        {/* Results */}
        {results && (
          <Card className="p-6 bg-white/80 backdrop-blur">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Leads</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{results.totalLeads}</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Top Leads Selected</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{results.topLeadsSelected}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Emails Generated</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{results.emails.length}</div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-3 mb-6">
              <Button onClick={exportToExcel} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              <Button onClick={exportToCSV} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export to CSV
              </Button>
            </div>

            {/* Email Preview */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {results.emails.map((email, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{email.name}</h3>
                      <p className="text-sm text-gray-600">{email.company}</p>
                      <p className="text-sm text-gray-500">{email.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    >
                      {editingIndex === index ? 'Save' : 'Edit'}
                    </Button>
                  </div>

                  {/* Version A */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-gray-500">
                      {config.abTesting ? 'VERSION A - Subject:' : 'Subject:'}
                    </label>
                    {editingIndex === index ? (
                      <Input
                        value={email.email_subject}
                        onChange={(e) => updateEmail(index, 'email_subject', e.target.value)}
                        className="mb-2"
                      />
                    ) : (
                      <p className="font-semibold mb-2">{email.email_subject}</p>
                    )}

                    <label className="text-xs font-medium text-gray-500">Body:</label>
                    {editingIndex === index ? (
                      <textarea
                        value={email.email_body}
                        onChange={(e) => updateEmail(index, 'email_body', e.target.value)}
                        className="w-full p-2 border rounded-md min-h-[200px]"
                      />
                    ) : (
                      <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
                        {email.email_body}
                      </div>
                    )}
                  </div>

                  {/* Version B (A/B Testing) */}
                  {config.abTesting && email.email_subject_b && (
                    <div className="border-t pt-3 mt-3">
                      <label className="text-xs font-medium text-gray-500">VERSION B - Subject:</label>
                      <p className="font-semibold mb-2">{email.email_subject_b}</p>

                      <label className="text-xs font-medium text-gray-500">Body:</label>
                      <div className="bg-blue-50 p-3 rounded whitespace-pre-wrap text-sm">
                        {email.email_body_b}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500 italic">
                    {email.personalization_notes}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
