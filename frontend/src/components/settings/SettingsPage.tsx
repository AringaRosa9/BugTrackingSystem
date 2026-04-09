import React, { useState } from 'react';
import { Key, Copy, CheckCircle2, Terminal, Code, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const platforms = [
    { id: 'action_editor', name: 'Action Editor', status: 'Active', lastSync: '10 mins ago' },
    { id: 'rule_editor', name: 'Rule Editor', status: 'Active', lastSync: '1 hour ago' },
    { id: 'ontology_test_system', name: 'Ontology Test System', status: 'Inactive', lastSync: '2 days ago' },
    { id: 'data_object_editor', name: 'Data Object Editor', status: 'Active', lastSync: '5 mins ago' },
    { id: 'link_generator', name: 'Link Generator', status: 'Active', lastSync: 'Just now' },
  ];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeSnippet = `curl -X POST http://127.0.0.1:3001/api/bugs/ingest \\
  -H "Authorization: Bearer hro_live_xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "platformId": "action_editor",
    "errorType": "ACTION_PUBLISH_FAILED",
    "title": "Failed to publish action: SendEmail",
    "description": "Validation failed on node payload.",
    "priority": "P1",
    "reporter": "system_bot",
    "contextData": {
      "actionId": "act_12345",
      "validationErrors": ["Missing required field: recipient"]
    }
  }'`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          系统配置 & 平台接入 (Settings & Integrations)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          管理接入的底层平台，并获取数据上报 API 凭证。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Platform Registry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">平台注册表 (Platform Registry)</h3>
              <button className="text-sm bg-indigo-50 text-indigo-700 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                + 新增平台
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {platforms.map((platform) => (
                <div key={platform.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    <p className="text-sm font-mono text-gray-500 mt-1">{platform.id}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                        platform.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${platform.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {platform.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Last sync: {platform.lastSync}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(`hro_live_${platform.id}_secret_key`, platform.id)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Copy API Key"
                    >
                      {copiedKey === platform.id ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Key className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: API Guide */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden text-gray-300">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2 bg-gray-950">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-medium text-gray-200">API 接入指南 (Ingest API)</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                使用以下端点将各平台的异常数据推送到统一缺陷中心。请在请求头中携带对应平台的 API Key。
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Endpoint</span>
                </div>
                <div className="bg-black/50 p-3 rounded-lg font-mono text-xs border border-gray-800 flex items-center justify-between">
                  <span className="text-green-400">POST</span>
                  <span className="text-gray-300 truncate ml-3 flex-1">/api/bugs/ingest</span>
                  <button onClick={() => handleCopy('/api/bugs/ingest', 'endpoint')} className="text-gray-500 hover:text-gray-300">
                    {copiedKey === 'endpoint' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">cURL Example</span>
                  <button onClick={() => handleCopy(codeSnippet, 'code')} className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs">
                    {copiedKey === 'code' ? <><CheckCircle2 className="w-3 h-3 text-green-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <pre className="bg-black/50 p-4 rounded-lg font-mono text-[11px] border border-gray-800 overflow-x-auto leading-relaxed text-gray-300">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
            <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-indigo-600" />
              SDK 支持
            </h4>
            <p className="text-sm text-indigo-700/80 leading-relaxed">
              我们即将推出 Node.js 和 Python 的官方 SDK，以简化接入流程。目前请使用标准的 HTTP 客户端进行集成。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
