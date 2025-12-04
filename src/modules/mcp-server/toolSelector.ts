import { MCPTool } from './types';
import { mcpTools } from './tools';

/**
 * Dynamic Tool Selector
 * Analyzes user query and returns only relevant tools to reduce token usage
 * Reduces token overhead by 40-60% by sending fewer tool definitions
 */

// Tool categories for efficient selection
const TOOL_CATEGORIES = {
  // Core tools - always included for flexibility
  core: [
    'get_departments',
    'search_employees',
  ],

  // Employee-related queries
  employee: [
    'get_employee_info',
    'get_department_employees',
    'search_employees',
    'get_departments',
  ],

  // SQL/Database queries (complex data needs)
  sql: [
    'get_database_schema',
    'execute_sql_query',
    'get_table_info',
  ],

  // Report generation
  report: [
    'generate_dynamic_report',
    'generate_quick_report',
  ],

  // Attendance tracking
  attendance: [
    'get_attendance_summary',
    'get_hyper_insights',
  ],

  // Leave management
  leave: [
    'get_leave_requests',
    'create_leave_request',
  ],

  // Recruitment
  recruitment: [
    'get_job_openings',
    'get_candidates',
  ],

  // Performance management
  performance: [
    'get_performance_reviews',
    'get_employee_goals',
  ],

  // Insights
  insights: [
    'get_hyper_insights',
  ],
};

// Keywords that trigger specific tool categories
const CATEGORY_KEYWORDS = {
  sql: [
    'skills', 'skill', 'competenc', 'salary', 'salaries', 'pay', 'compensation',
    'join', 'complex', 'calculate', 'aggregate', 'group by', 'average',
    'total', 'sum', 'count', 'multiple tables', 'relationship',
  ],
  report: [
    'report', 'dashboard', 'summary', 'overview', 'analytics',
    'generate', 'create report', 'export', 'pdf', 'markdown',
  ],
  attendance: [
    'attendance', 'present', 'absent', 'late', 'check-in', 'check in',
    'working hours', 'time tracking', 'punctuality',
  ],
  leave: [
    'leave', 'vacation', 'time off', 'pto', 'absence', 'holiday',
    'leave request', 'leave balance', 'apply leave',
  ],
  recruitment: [
    'job', 'opening', 'candidate', 'applicant', 'hiring', 'recruit',
    'interview', 'application', 'job posting',
  ],
  performance: [
    'performance', 'review', 'appraisal', 'feedback', 'goal', 'objective',
    'kpi', 'rating', 'evaluation',
  ],
  employee: [
    'employee', 'staff', 'worker', 'team member', 'personnel',
    'department', 'designation', 'role', 'position',
  ],
  insights: [
    'insight', 'pattern', 'trend', 'analysis', 'missing', 'incomplete',
    'pending', 'quick stats', 'statistics',
  ],
};

/**
 * Select relevant tools based on user query
 * Returns subset of tools to reduce token usage
 */
export function selectRelevantTools(query: string): MCPTool[] {
  const queryLower = query.toLowerCase();
  const selectedCategories = new Set<string>();

  // Always include core tools
  selectedCategories.add('core');

  // Check for SQL/complex query indicators
  if (shouldUseSqlTools(queryLower)) {
    selectedCategories.add('sql');
    selectedCategories.add('employee'); // Often need employee context
  }

  // Match keywords to categories
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      selectedCategories.add(category);
    }
  }

  // If no specific category matched, default to employee tools (most common)
  if (selectedCategories.size === 1) { // Only 'core' is selected
    selectedCategories.add('employee');
  }

  // Special case: Reports often need other data tools
  if (selectedCategories.has('report')) {
    selectedCategories.add('employee'); // Reports usually include employee data
  }

  // Collect unique tool names
  const toolNames = new Set<string>();

  for (const category of selectedCategories) {
    const tools = TOOL_CATEGORIES[category as keyof typeof TOOL_CATEGORIES];
    if (tools) {
      tools.forEach(toolName => toolNames.add(toolName));
    }
  }

  // Return actual tool objects
  return mcpTools.filter(tool => toolNames.has(tool.name));
}

/**
 * Detect if query needs SQL capabilities
 */
function shouldUseSqlTools(queryLower: string): boolean {
  // Complex data combinations that existing tools don't handle
  const sqlIndicators = [
    'skills', 'skill', 'competenc', 'salary', 'salaries', 'pay',
    'compensation', 'calculate', 'aggregate', 'average', 'total',
  ];

  // Multiple entities in one query
  const hasMultipleEntities =
    (queryLower.includes('employee') && queryLower.includes('skill')) ||
    (queryLower.includes('employee') && queryLower.includes('salary')) ||
    (queryLower.includes('employee') && queryLower.includes('competenc')) ||
    (queryLower.includes('department') && queryLower.includes('salary')) ||
    (queryLower.includes('with their') && (queryLower.includes('skill') || queryLower.includes('pay')));

  return hasMultipleEntities || sqlIndicators.some(indicator => queryLower.includes(indicator));
}

/**
 * Get all tools (fallback for complex queries)
 */
export function getAllTools(): MCPTool[] {
  return mcpTools;
}

/**
 * Get statistics about tool selection
 */
export function getToolSelectionStats(query: string): {
  selectedCount: number;
  totalCount: number;
  categories: string[];
  tokensEstimate: number;
} {
  const selectedTools = selectRelevantTools(query);
  const queryLower = query.toLowerCase();
  const categories: string[] = [];

  // Determine which categories were selected
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      categories.push(category);
    }
  }

  // Estimate tokens (roughly 150 tokens per tool)
  const tokensEstimate = selectedTools.length * 150;

  return {
    selectedCount: selectedTools.length,
    totalCount: mcpTools.length,
    categories,
    tokensEstimate,
  };
}
