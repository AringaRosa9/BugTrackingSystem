import React from 'react';
import { Bug, OntologyBug, RuleBug, DataObjectBug } from '../../types/bug';
import { Terminal, GitCommit, FileJson, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface PlatformContextViewerProps {
  bug: Bug;
}

export default function PlatformContextViewer({ bug }: PlatformContextViewerProps) {
  // 渲染 Ontology Test System 的上下文 (Run Trace)
  const renderOntologyContext = (context: OntologyBug['platformContext']) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-gray-500 text-xs block mb-1">Run ID</span>
            <span className="font-mono text-sm text-gray-900">{context.runId}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-gray-500 text-xs block mb-1">Snapshot ID</span>
            <span className="font-mono text-sm text-gray-900">{context.snapshotId}</span>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium text-sm mb-1">Ontology Issue</h4>
            <p className="text-red-700 text-sm font-mono">{context.ontologyIssue}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-gray-900 font-medium text-sm mb-4 flex items-center gap-2">
            <GitCommit className="w-4 h-4" />
            Execution Trace
          </h4>
          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {context.runTrace?.map((trace, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-50 text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  {trace.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                   trace.status === 'failed' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : 
                   <Clock className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{trace.node}</span>
                    <span className="text-xs text-gray-500 font-mono">{trace.durationMs}ms</span>
                  </div>
                  {trace.error && (
                    <div className="mt-2 text-xs text-red-700 font-mono bg-red-50 p-2 rounded border border-red-100">
                      {trace.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染 Rule Editor 的上下文 (JSON Diff)
  const renderRuleEditorContext = (context: RuleBug['platformContext']) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div>
            <span className="text-gray-500 text-xs block mb-1">Rule Name</span>
            <span className="font-medium text-sm text-gray-900">{context.ruleName}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 text-xs block mb-1">Rule ID</span>
            <span className="font-mono text-sm text-gray-700">{context.ruleId}</span>
          </div>
        </div>

        {context.validationErrors?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h4 className="text-orange-800 font-medium text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Validation Errors
            </h4>
            <ul className="list-disc list-inside text-orange-700 text-sm font-mono space-y-1">
              {context.validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-gray-900 font-medium text-sm mb-2 flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            Payload Diff
          </h4>
          <div className="grid grid-cols-2 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 p-4">
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Original</div>
              <pre className="text-red-700 text-xs font-mono whitespace-pre-wrap">{context.diff?.old}</pre>
            </div>
            <div className="bg-gray-50 p-4">
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Modified</div>
              <pre className="text-green-700 text-xs font-mono whitespace-pre-wrap">{context.diff?.new}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染 Data Object Editor 的上下文
  const renderDataObjectContext = (context: DataObjectBug['platformContext']) => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs block mb-1">Entity Name</span>
            <span className="font-medium text-sm text-indigo-700">{context.entityName}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 text-xs block mb-1">Schema ID</span>
            <span className="font-mono text-sm text-gray-900">{context.schemaId}</span>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h4 className="text-red-700 font-medium text-sm mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Schema Validation Failed
          </h4>
          <ul className="list-disc list-inside text-red-600 text-sm font-mono space-y-1">
            {context.validationErrors?.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      </div>
    );
  };

  // 默认渲染 (Fallback)
  const renderDefaultContext = (context: any) => {
    return (
      <pre className="bg-gray-50 text-gray-700 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-200">
        {JSON.stringify(context, null, 2)}
      </pre>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <Terminal className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">平台专属证据 (Platform Context)</h3>
      </div>
      <div className="p-6">
        {bug.platformId === 'ontology_test_system' && renderOntologyContext(bug.platformContext as OntologyBug['platformContext'])}
        {bug.platformId === 'rule_editor' && renderRuleEditorContext(bug.platformContext as RuleBug['platformContext'])}
        {bug.platformId === 'data_object_editor' && renderDataObjectContext(bug.platformContext as DataObjectBug['platformContext'])}
        {!['ontology_test_system', 'rule_editor', 'data_object_editor'].includes(bug.platformId) && renderDefaultContext(bug.platformContext)}
      </div>
    </div>
  );
}
