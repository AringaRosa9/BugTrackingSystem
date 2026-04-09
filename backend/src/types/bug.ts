export type BugStatus = 'NEW' | 'TRIAGED' | 'IN_PROGRESS' | 'FIXED' | 'VERIFIED' | 'CLOSED' | 'REOPENED';
export type BugPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type PlatformId = 
  | 'ontology_test_system' 
  | 'action_editor' 
  | 'rule_editor' 
  | 'event_editor' 
  | 'link_generator' 
  | 'data_object_editor' 
  | 'dashboard';

export type VerificationMode = 'platform_auto_test' | 'manual_verify' | 'regression_suite' | 'smoke_test' | 'not_applicable';

// 1. 核心 Bug 实体 (通用底座)
export interface BaseBug<T = Record<string, any>> {
  bugId: string;
  title: string;
  description?: string;
  status: BugStatus;
  priority: BugPriority;
  platformId: PlatformId;
  sourceEntityType: string;
  sourceEntityId: string;
  sourceUrl?: string;
  assignee?: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  verificationMode?: VerificationMode;
  dedupeKey?: string;
  duplicateCount?: number;
  // 泛型设计：容纳不同平台的专属证据上下文
  platformContext: T; 
}

// 2. 平台专属上下文扩展 (Platform Contexts) - HRO 招聘场景
export interface OntologyTestContext {
  runId: string;
  snapshotId: string;
  ontologyIssue: string;
  runTrace: Array<{
    node: string;
    status: 'success' | 'failed' | 'pending';
    durationMs: number;
    error?: string;
  }>;
}

export interface RuleEditorContext {
  ruleId: string;
  ruleName: string;
  validationErrors: string[];
  diff: {
    old: string;
    new: string;
  };
}

export interface DataObjectEditorContext {
  schemaId: string;
  entityName: string;
  validationErrors: string[];
}

export interface ActionEditorContext {
  actionId: string;
  validationErrors: string[];
  payloadDiff?: string;
}

// 3. 具体 Bug 类型别名
export type OntologyBug = BaseBug<OntologyTestContext>;
export type RuleBug = BaseBug<RuleEditorContext>;
export type DataObjectBug = BaseBug<DataObjectEditorContext>;
export type ActionBug = BaseBug<ActionEditorContext>;
export type Bug = OntologyBug | RuleBug | DataObjectBug | ActionBug | BaseBug<any>;

