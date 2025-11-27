import { Request } from 'express';
import { sequelize } from '../../config/db';
import { QueryTypes } from 'sequelize';

/**
 * Dynamic SQL Query Executor
 * Allows AI to generate and execute SQL queries based on natural language
 *
 * Security measures:
 * - Only SELECT queries allowed
 * - Query validation
 * - Result size limits
 * - Read-only access
 */
export class DynamicSqlExecutor {
  private static readonly MAX_RESULT_LIMIT = 1000;
  private static readonly MAX_PREVIEW_ROWS = 10;
  private static readonly QUERY_TIMEOUT_MS = 30000;
  private static readonly MAX_TABLE_HINTS = 6;
  private static readonly MAX_COLUMN_HINTS = 12;
  private static readonly BLOCKED_KEYWORDS = [
    'drop',
    'delete',
    'truncate',
    'insert',
    'update',
    'alter',
    'create',
    'grant',
    'revoke',
    'execute',
    'exec',
    'transaction',
    'commit',
    'rollback',
  ];

  /**
   * Get compact database schema (optimized for token usage)
   * Returns only essential information: table names, key columns, and relationships
   */
  static async getDatabaseSchemaCompact(): Promise<any> {
    try {
      // Get all tables
      const tablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;

      const tables: any[] = await sequelize.query(tablesQuery, {
        type: QueryTypes.SELECT,
      });

      // Get only primary/foreign key columns (most important for queries)
      const keyColumnsQuery = `
        SELECT
          t.table_name,
          kcu.column_name,
          tc.constraint_type
        FROM information_schema.tables t
        LEFT JOIN information_schema.table_constraints tc
          ON t.table_name = tc.table_name
        LEFT JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
        AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
        ORDER BY t.table_name, tc.constraint_type;
      `;

      const keyColumns: any[] = await sequelize.query(keyColumnsQuery, {
        type: QueryTypes.SELECT,
      });

      // Get foreign key relationships
      const relationshipsQuery = `
        SELECT
          tc.table_name AS from_table,
          kcu.column_name AS from_column,
          ccu.table_name AS to_table,
          ccu.column_name AS to_column
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        ORDER BY tc.table_name;
      `;

      const relationships: any[] = await sequelize.query(relationshipsQuery, {
        type: QueryTypes.SELECT,
      });

      const tablesSummary = tables.map((table) => {
        const tableName = table.table_name;
        const tablePrimaryKeys = keyColumns
          .filter((col) => col.table_name === tableName && col.constraint_type === 'PRIMARY KEY')
          .map((col) => col.column_name);

        const tableForeignKeys = relationships
          .filter((rel) => rel.from_table === tableName)
          .map((rel) => `${rel.from_column} -> ${rel.to_table}.${rel.to_column}`);

        return {
          table: tableName,
          primaryKeys: tablePrimaryKeys,
          foreignKeysPreview: tableForeignKeys.slice(0, 3),
          foreignKeyCount: tableForeignKeys.length,
        };
      });

      return {
        summary: {
          totalTables: tables.length,
          tablesWithForeignKeys: relationships
            .map((rel) => rel.from_table)
            .filter((value, index, arr) => arr.indexOf(value) === index).length,
        },
        tables: tablesSummary,
        note: 'Compact schema preview. For columns and full relationships use get_table_info or execute targeted queries.',
      };
    } catch (error: any) {
      throw new Error(`Failed to get compact schema: ${error.message}`);
    }
  }

  /**
   * Get full database schema information (more verbose)
   * Returns tables, columns, relationships for AI to understand the structure
   */
  static async getDatabaseSchema(): Promise<any> {
    try {
      // Get all tables
      const tablesQuery = `
        SELECT
          table_name,
          table_schema
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;

      const tables: any[] = await sequelize.query(tablesQuery, {
        type: QueryTypes.SELECT,
      });

      // Get columns for each table
      const columnsQuery = `
        SELECT
          table_name,
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `;

      const columns: any[] = await sequelize.query(columnsQuery, {
        type: QueryTypes.SELECT,
      });

      // Get foreign key relationships
      const relationshipsQuery = `
        SELECT
          tc.table_name AS from_table,
          kcu.column_name AS from_column,
          ccu.table_name AS to_table,
          ccu.column_name AS to_column,
          tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        ORDER BY tc.table_name;
      `;

      const relationships: any[] = await sequelize.query(relationshipsQuery, {
        type: QueryTypes.SELECT,
      });

      // Organize schema information
      const schema: any = {
        tables: [],
        relationships: relationships,
      };

      // Group columns by table
      const tableColumns: any = {};
      columns.forEach((col) => {
        if (!tableColumns[col.table_name]) {
          tableColumns[col.table_name] = [];
        }
        tableColumns[col.table_name].push({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          default: col.column_default,
        });
      });

      // Build table information
      tables.forEach((table) => {
        schema.tables.push({
          name: table.table_name,
          columns: tableColumns[table.table_name] || [],
          relationships: relationships.filter(
            (r) => r.from_table === table.table_name || r.to_table === table.table_name
          ),
        });
      });

      return schema;
    } catch (error: any) {
      throw new Error(`Failed to get database schema: ${error.message}`);
    }
  }

  /**
   * Execute a dynamic SQL query
   *
   * Security features:
   * - Only SELECT queries allowed
   * - Query validation
   * - Result limit (max 1000 rows)
   * - Timeout protection
   */
  static async executeDynamicQuery(
    sqlQuery: string,
    req: Request
  ): Promise<{
    success: boolean;
    data: any[];
    rowCount: number;
    executionTime: number;
    formattedResult: {
      markdownTable: string;
      summary: string;
      previewRowCount: number;
      columns: string[];
    };
  }> {
    const startTime = Date.now();
    let sanitizedQuery = '';
    let finalQuery = '';

    try {
      sanitizedQuery = this.prepareSelectQuery(sqlQuery);
      finalQuery = this.applyResultLimit(sanitizedQuery);

      const results = (await this.executeWithTimeout(finalQuery)) as any[];
      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: results,
        rowCount: results.length,
        executionTime,
        formattedResult: this.formatQueryResults(results),
      };
    } catch (error: any) {
      const detailedMessage = await this.buildDetailedErrorMessage(
        error,
        sanitizedQuery || sqlQuery,
        finalQuery
      );
      throw new Error(detailedMessage);
    }
  }

  /**
   * Validate and explain a SQL query without executing it
   * Useful for AI to check if query is correct before execution
   */
  static async explainQuery(sqlQuery: string): Promise<any> {
    try {
      const sanitizedQuery = this.prepareSelectQuery(sqlQuery);
      const explainQuery = `EXPLAIN (FORMAT JSON) ${sanitizedQuery}`;
      const result = await sequelize.query(explainQuery, {
        type: QueryTypes.SELECT,
      });

      return {
        valid: true,
        plan: result,
        query: sanitizedQuery,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
        query: sqlQuery,
      };
    }
  }

  /**
   * Get table information for a specific table
   * Useful when AI needs detailed info about one table
   */
  static async getTableInfo(tableName: string): Promise<any> {
    try {
      // Get columns
      const columnsQuery = `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        ORDER BY ordinal_position;
      `;

      const columns = await sequelize.query(columnsQuery, {
        bind: [tableName],
        type: QueryTypes.SELECT,
      });

      // Get primary key
      const pkQuery = `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
        AND tc.table_name = $1
        AND tc.constraint_type = 'PRIMARY KEY';
      `;

      const primaryKeys = await sequelize.query(pkQuery, {
        bind: [tableName],
        type: QueryTypes.SELECT,
      });

      // Get foreign keys
      const fkQuery = `
        SELECT
          kcu.column_name,
          ccu.table_name AS referenced_table,
          ccu.column_name AS referenced_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_schema = 'public'
        AND tc.table_name = $1
        AND tc.constraint_type = 'FOREIGN KEY';
      `;

      const foreignKeys = await sequelize.query(fkQuery, {
        bind: [tableName],
        type: QueryTypes.SELECT,
      });

      // Get sample data (3 rows - optimized for token usage)
      const sampleQuery = `SELECT * FROM "${tableName}" LIMIT 3`;
      const sampleData = await sequelize.query(sampleQuery, {
        type: QueryTypes.SELECT,
      });

      // Get row count
      const countQuery = `SELECT COUNT(*) as count FROM "${tableName}"`;
      const countResult: any = await sequelize.query(countQuery, {
        type: QueryTypes.SELECT,
      });

      return {
        tableName,
        columns,
        primaryKeys,
        foreignKeys,
        sampleData,
        totalRows: countResult[0]?.count || 0,
      };
    } catch (error: any) {
      throw new Error(`Failed to get table info: ${error.message}`);
    }
  }

  /**
   * Normalize and validate SELECT queries before execution/explain
   */
  private static prepareSelectQuery(sqlQuery: string): string {
    if (!sqlQuery || typeof sqlQuery !== 'string') {
      throw new Error('A SQL query string is required');
    }

    const withoutComments = this.removeSqlComments(sqlQuery);
    const statements = withoutComments
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    if (statements.length === 0) {
      throw new Error('SQL query cannot be empty');
    }

    if (statements.length > 1) {
      throw new Error('Only single SELECT statements are allowed');
    }

    const trimmedQuery = statements[0];
    const lowered = trimmedQuery.trim().toLowerCase();

    if (!lowered.startsWith('select')) {
      throw new Error('Only SELECT queries are allowed for security reasons');
    }

    if (lowered.includes('information_schema') || lowered.includes('pg_catalog')) {
      // Allow schema access via dedicated helper methods
      throw new Error('Access to system catalog tables is blocked. Use get_database_schema or get_table_info instead.');
    }

    for (const keyword of this.BLOCKED_KEYWORDS) {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
      if (pattern.test(lowered)) {
        throw new Error(`Query contains blocked keyword: ${keyword}`);
      }
    }

    return trimmedQuery;
  }

  /**
   * Ensure LIMIT is always applied to control row count
   */
  private static applyResultLimit(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.includes('limit')) {
      return `${query} LIMIT ${this.MAX_RESULT_LIMIT}`;
    }

    const limitMatch = lowerQuery.match(/limit\s+(\d+)/);
    if (limitMatch) {
      const requestedLimit = parseInt(limitMatch[1], 10);
      if (requestedLimit > this.MAX_RESULT_LIMIT) {
        return query.replace(/limit\s+\d+/i, `LIMIT ${this.MAX_RESULT_LIMIT}`);
      }
    }

    return query;
  }

  /**
   * Execute a query with timeout protection
   */
  private static async executeWithTimeout(query: string): Promise<any[]> {
    return (await Promise.race([
      sequelize.query(query, {
        type: QueryTypes.SELECT,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Query timeout (${this.QUERY_TIMEOUT_MS / 1000}s)`)),
          this.QUERY_TIMEOUT_MS
        )
      ),
    ])) as any[];
  }

  /**
   * Format query results into a Markdown table for MCP responses
   */
  private static formatQueryResults(data: any[]): {
    markdownTable: string;
    summary: string;
    previewRowCount: number;
    columns: string[];
  } {
    if (!data || data.length === 0) {
      return {
        markdownTable: '_No rows returned._',
        summary: 'Query executed successfully but no rows matched the criteria.',
        previewRowCount: 0,
        columns: [],
      };
    }

    const previewRows = data.slice(0, this.MAX_PREVIEW_ROWS);
    const columns = this.extractColumns(previewRows);
    const markdownTable = this.buildMarkdownTable(columns, previewRows);
    const summary =
      data.length > this.MAX_PREVIEW_ROWS
        ? `Returned ${data.length} row(s). Showing first ${this.MAX_PREVIEW_ROWS} rows for preview.`
        : `Returned ${data.length} row(s).`;

    return {
      markdownTable,
      summary,
      previewRowCount: previewRows.length,
      columns,
    };
  }

  private static extractColumns(rows: any[]): string[] {
    const columnSet = new Set<string>();
    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => columnSet.add(key));
    });
    return Array.from(columnSet);
  }

  private static buildMarkdownTable(columns: string[], rows: any[]): string {
    if (columns.length === 0) {
      return '_Rows returned but column metadata is unavailable._';
    }

    const headerRow = `| ${columns.join(' | ')} |`;
    const dividerRow = `| ${columns.map(() => '---').join(' | ')} |`;

    const bodyRows = rows
      .map((row) => {
        const values = columns.map((column) => this.formatCellValue(row[column]));
        return `| ${values.join(' | ')} |`;
      })
      .join('\n');

    return `${headerRow}\n${dividerRow}\n${bodyRows}`;
  }

  private static formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return '_NULL_';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value) || typeof value === 'object') {
      return this.escapeMarkdown(JSON.stringify(value));
    }

    const raw = String(value);
    const trimmed = raw.length > 60 ? `${raw.substring(0, 57)}...` : raw;
    return this.escapeMarkdown(trimmed);
  }

  private static escapeMarkdown(value: string): string {
    return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  }

  /**
   * Remove inline and block SQL comments to prevent sneaky injections
   */
  private static removeSqlComments(query: string): string {
    return query
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();
  }

  /**
   * Build detailed error messages with schema hints to reduce retry attempts
   */
  private static async buildDetailedErrorMessage(
    error: any,
    parsedQuery: string,
    executedQuery?: string
  ): Promise<string> {
    const baseMessage = `Query execution failed: ${error?.message || error}`;

    try {
      const tableNames = this.extractTableNames(executedQuery || parsedQuery || '');
      if (tableNames.length === 0) {
        return baseMessage;
      }

      const columnHints = await this.getColumnHints(tableNames);
      if (!columnHints || Object.keys(columnHints).length === 0) {
        return baseMessage;
      }

      const formattedHints = Object.entries(columnHints)
        .map(([table, columns]) => `- ${table}: ${columns.join(', ')}`)
        .join('\n');

      return `${baseMessage}\n\nSchema hints for referenced tables:\n${formattedHints}\n\nTip: Use get_table_info for full details on a specific table before retrying.`;
    } catch {
      // Fall back to original error if we can't build hints
      return baseMessage;
    }
  }

  private static extractTableNames(query: string): string[] {
    if (!query) {
      return [];
    }

    const matches = new Set<string>();
    const regex = /\b(?:from|join)\s+([a-zA-Z0-9_."-]+)/gi;
    let result: RegExpExecArray | null;

    while ((result = regex.exec(query)) !== null) {
      const rawName = result[1]?.replace(/"/g, '') || '';
      if (!rawName || rawName.startsWith('(')) {
        continue;
      }

      const normalized = rawName.includes('.')
        ? rawName.split('.').pop() || rawName
        : rawName;

      if (normalized) {
        matches.add(normalized.trim());
      }
    }

    return Array.from(matches).slice(0, this.MAX_TABLE_HINTS);
  }

  private static async getColumnHints(
    tableNames: string[]
  ): Promise<Record<string, string[]>> {
    const hints: Record<string, string[]> = {};

    for (const tableName of tableNames) {
      const normalized = tableName.replace(/"/g, '');
      if (!normalized) {
        continue;
      }

      const columns = (await sequelize.query(
        `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = :tableName
          ORDER BY ordinal_position
          LIMIT ${this.MAX_COLUMN_HINTS};
        `,
        {
          replacements: { tableName: normalized },
          type: QueryTypes.SELECT,
        }
      )) as Array<{ column_name: string }>;

      if (columns.length > 0) {
        hints[normalized] = columns.map((col) => col.column_name);
      }
    }

    return hints;
  }

  /**
   * Get common query examples for AI reference
   */
  static getQueryExamples(): any {
    return [
      {
        description: 'Get all employees with their department and designation',
        sql: `
          SELECT
            e.employee_id,
            e.first_name,
            e.last_name,
            e.email,
            d.department_name,
            des.designation_name
          FROM employees e
          LEFT JOIN departments d ON e.department_id = d.department_id
          LEFT JOIN designations des ON e.designation_id = des.designation_id
          WHERE e.status = 'active'
          ORDER BY e.first_name;
        `,
      },
      {
        description: 'Get employees with their salary information',
        sql: `
          SELECT
            e.employee_id,
            e.first_name || ' ' || e.last_name as full_name,
            d.department_name,
            ss.base_salary,
            ss.allowances,
            ss.gross_salary
          FROM employees e
          LEFT JOIN departments d ON e.department_id = d.department_id
          LEFT JOIN salary_structures ss ON e.employee_id = ss.employee_id
          WHERE e.status = 'active'
          ORDER BY ss.gross_salary DESC;
        `,
      },
      {
        description: 'Get employees with their skills/competencies',
        sql: `
          SELECT
            e.employee_id,
            e.first_name || ' ' || e.last_name as full_name,
            c.competency_name,
            ec.proficiency_level,
            ec.years_of_experience
          FROM employees e
          LEFT JOIN employee_competencies ec ON e.employee_id = ec.employee_id
          LEFT JOIN competencies c ON ec.competency_id = c.competency_id
          WHERE e.status = 'active'
          ORDER BY e.first_name, c.competency_name;
        `,
      },
      {
        description: 'Get department headcount and average salary',
        sql: `
          SELECT
            d.department_name,
            COUNT(DISTINCT e.employee_id) as employee_count,
            AVG(ss.gross_salary) as avg_salary,
            MIN(ss.gross_salary) as min_salary,
            MAX(ss.gross_salary) as max_salary
          FROM departments d
          LEFT JOIN employees e ON d.department_id = e.department_id AND e.status = 'active'
          LEFT JOIN salary_structures ss ON e.employee_id = ss.employee_id
          GROUP BY d.department_id, d.department_name
          ORDER BY employee_count DESC;
        `,
      },
    ];
  }
}
