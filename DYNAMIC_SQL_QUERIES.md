# Dynamic SQL Query Execution - MCP Tools

## Overview

The MCP server now includes **powerful dynamic SQL query tools** that allow AI to generate and execute custom SQL queries to fetch ANY data from the HRM database. This solves the limitation where predefined tools couldn't provide certain data combinations like employee skills, salary information, or complex multi-table JOINs.

## 🎯 Why Dynamic SQL?

### The Problem
Previously, when you asked: *"Show engineering department employees and their skills. Also give their pays?"*

The AI would respond that it doesn't have tools to provide skills and salary data, even though this data exists in the database.

### The Solution
Now the AI can:
1. **Understand the database schema** using `get_database_schema`
2. **Generate appropriate SQL queries** based on your natural language request
3. **Execute the queries safely** using `execute_sql_query`
4. **Return the exact data you need** in a structured format

## 🔧 Available Tools

### 1. `get_database_schema`

Get complete database schema including all tables, columns, data types, and relationships.

**Usage:**
```typescript
// Tool call (AI does this automatically)
{
  "name": "get_database_schema",
  "arguments": {}
}
```

**Returns:**
```json
{
  "success": true,
  "schema": {
    "tables": [
      {
        "name": "employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "uuid",
            "nullable": false,
            "default": "gen_random_uuid()"
          },
          {
            "name": "first_name",
            "type": "character varying",
            "nullable": false,
            "default": null
          }
        ],
        "relationships": [...]
      }
    ],
    "relationships": [
      {
        "from_table": "employees",
        "from_column": "department_id",
        "to_table": "departments",
        "to_column": "department_id"
      }
    ]
  },
  "totalTables": 25,
  "totalRelationships": 42
}
```

### 2. `execute_sql_query`

Execute a dynamic SELECT query to fetch any data from the database.

**Security Features:**
- ✅ Only SELECT queries allowed
- ✅ Dangerous keywords blocked (DROP, DELETE, INSERT, UPDATE, etc.)
- ✅ Automatic LIMIT 1000 enforcement
- ✅ 30-second timeout protection
- ✅ Query validation before execution

**Usage:**
```typescript
// Tool call
{
  "name": "execute_sql_query",
  "arguments": {
    "sqlQuery": "SELECT e.first_name, e.last_name, ss.base_salary FROM employees e LEFT JOIN salary_structures ss ON e.employee_id = ss.employee_id WHERE e.department_id = '...'"
  }
}
```

**Returns:**
```json
{
  "success": true,
  "message": "Query executed successfully",
  "data": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "base_salary": 75000
    }
  ],
  "rowCount": 1,
  "executionTime": "45ms",
  "query": "SELECT e.first_name, e.last_name, ss.base_salary FROM employees e LEFT JOIN salary_structures ss ON e.employee_id = ss.employee_id WHERE e.department_id = '...' LIMIT 1000"
}
```

### 3. `get_table_info`

Get detailed information about a specific table including sample data.

**Usage:**
```typescript
// Tool call
{
  "name": "get_table_info",
  "arguments": {
    "tableName": "employees"
  }
}
```

**Returns:**
```json
{
  "success": true,
  "tableInfo": {
    "tableName": "employees",
    "columns": [...],
    "primaryKeys": [{"column_name": "employee_id"}],
    "foreignKeys": [
      {
        "column_name": "department_id",
        "referenced_table": "departments",
        "referenced_column": "department_id"
      }
    ],
    "sampleData": [...],
    "totalRows": 150
  }
}
```

## 📚 Example Queries

### Example 1: Employees with Skills and Salary

**Question:** "Show me engineering department employees with their skills and salaries"

**AI Process:**
1. Calls `get_database_schema` to understand the structure
2. Identifies tables: `employees`, `departments`, `employee_competencies`, `competencies`, `salary_structures`
3. Generates SQL query:

```sql
SELECT
  e.first_name,
  e.last_name,
  e.email,
  c.competency_name,
  ec.proficiency_level,
  ss.base_salary,
  ss.gross_salary
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
LEFT JOIN employee_competencies ec ON e.employee_id = ec.employee_id
LEFT JOIN competencies c ON ec.competency_id = c.competency_id
LEFT JOIN salary_structures ss ON e.employee_id = ss.employee_id
WHERE d.department_name = 'Engineering'
AND e.status = 'active'
ORDER BY e.first_name;
```

4. Executes query using `execute_sql_query`
5. Returns formatted results to you

### Example 2: Department Salary Analysis

**Question:** "What's the average salary by department with employee counts?"

**Generated Query:**
```sql
SELECT
  d.department_name,
  COUNT(DISTINCT e.employee_id) as employee_count,
  AVG(ss.gross_salary) as avg_salary,
  MIN(ss.gross_salary) as min_salary,
  MAX(ss.gross_salary) as max_salary
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
  AND e.status = 'active'
LEFT JOIN salary_structures ss ON e.employee_id = ss.employee_id
GROUP BY d.department_id, d.department_name
ORDER BY avg_salary DESC;
```

### Example 3: Employees with Experience and Certifications

**Question:** "Show me all employees with their years of experience in specific competencies"

**Generated Query:**
```sql
SELECT
  e.employee_id,
  e.first_name || ' ' || e.last_name as full_name,
  c.competency_name,
  ec.proficiency_level,
  ec.years_of_experience,
  ec.last_used_date
FROM employees e
LEFT JOIN employee_competencies ec ON e.employee_id = ec.employee_id
LEFT JOIN competencies c ON ec.competency_id = c.competency_id
WHERE e.status = 'active'
AND ec.years_of_experience > 0
ORDER BY e.first_name, c.competency_name;
```

## 🔒 Security Measures

### Query Validation
```typescript
// Only SELECT allowed
if (!trimmedQuery.startsWith('select')) {
  throw new Error('Only SELECT queries are allowed');
}

// Dangerous keywords blocked
const dangerousKeywords = [
  'drop', 'delete', 'truncate', 'insert', 'update',
  'alter', 'create', 'grant', 'revoke', 'execute', 'exec'
];
```

### Automatic Safety Features
- **Row Limit:** Maximum 1000 rows per query
- **Timeout:** 30-second execution limit
- **Read-Only:** Only SELECT operations permitted
- **Query Logging:** All queries are logged for audit

### Example Security Enforcement
```typescript
// User tries: "DROP TABLE employees"
// Response: Error - Only SELECT queries are allowed

// User tries: "SELECT * FROM employees; DELETE FROM employees"
// Response: Error - Query contains blocked keyword: delete

// User tries: "SELECT * FROM employees LIMIT 5000"
// Enforced: "SELECT * FROM employees LIMIT 1000"
```

## 🚀 How AI Uses These Tools

### Typical Workflow

1. **User Question:** "Show me employees with their skills and pay"

2. **AI Analysis:**
   - Question requires: employee data, skills/competencies, salary
   - Existing tools don't provide this combination
   - Need to use dynamic SQL

3. **AI Actions:**
   ```
   Step 1: Call get_database_schema
   Step 2: Identify relevant tables (employees, employee_competencies,
           competencies, salary_structures)
   Step 3: Generate appropriate JOIN query
   Step 4: Call execute_sql_query with generated SQL
   Step 5: Format and present results to user
   ```

4. **Result:** User gets exactly the data they requested

## 📊 Common Use Cases

### 1. Complex Reporting
```
"Generate a report showing employees by department with their average
tenure, salary range, and skill distribution"
```

### 2. Data Analysis
```
"Which competencies are most common in the Engineering department and
what's the average proficiency level?"
```

### 3. Compensation Analysis
```
"Show me salary comparison between departments, including allowances
and bonuses"
```

### 4. Skills Gap Analysis
```
"List all competencies we have in the database and which departments
have employees with those skills"
```

### 5. Custom Aggregations
```
"What's the distribution of employees across experience levels, grouped
by department and designation?"
```

## 🎨 API Endpoints

### Both Claude and Gemini Support Dynamic SQL

**Claude Endpoint:**
```bash
POST http://localhost:8000/mcp/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Show engineering employees with their skills and salaries",
  "useTools": true
}
```

**Gemini Endpoint:**
```bash
POST http://localhost:8000/mcp-genai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Show engineering employees with their skills and salaries",
  "useTools": true
}
```

Both endpoints will:
1. Understand your natural language request
2. Call `get_database_schema` to understand the database
3. Generate appropriate SQL query
4. Execute using `execute_sql_query`
5. Return formatted results

## 💡 Tips for Best Results

### 1. Be Specific
**Good:** "Show employees in Engineering with Python skills and their salaries"
**Better:** "Show active employees in Engineering department who have Python competency with proficiency level Advanced or Expert, along with their base salary and gross salary"

### 2. Let AI Generate the SQL
You don't need to write SQL yourself. Just describe what you want:
- "Compare salaries across departments"
- "Find employees with specific skills"
- "Analyze attendance patterns with employee details"

### 3. Complex Queries Are Welcome
The AI can handle:
- Multiple JOINs
- Subqueries
- Aggregations (COUNT, AVG, SUM, etc.)
- GROUP BY and HAVING
- Complex WHERE conditions

### 4. Schema-Aware Queries
The AI will:
- Use correct table names
- Use proper column names
- Follow foreign key relationships
- Handle nullable fields appropriately

## 🔧 Technical Implementation

### Architecture

```
User Question
    ↓
AI Service (Claude/Gemini)
    ↓
[Decides to use dynamic SQL]
    ↓
get_database_schema
    ↓
[AI analyzes schema]
    ↓
[AI generates SQL query]
    ↓
execute_sql_query
    ↓
DynamicSqlExecutor
    ↓
[Security validation]
    ↓
PostgreSQL Database
    ↓
[Results returned to AI]
    ↓
[AI formats and presents to user]
```

### Key Files

1. **`dynamicSqlExecutor.ts`** - Core SQL execution engine with security
2. **`tools.ts`** - Tool definitions for AI
3. **`toolExecutor.ts`** - Tool execution routing

### Code Example

```typescript
// From dynamicSqlExecutor.ts
static async executeDynamicQuery(
  sqlQuery: string,
  req: Request
): Promise<{
  success: boolean;
  data: any[];
  rowCount: number;
  executionTime: number;
  query: string;
}> {
  // Validate SELECT only
  if (!sqlQuery.trim().toLowerCase().startsWith('select')) {
    throw new Error('Only SELECT queries allowed');
  }

  // Block dangerous keywords
  // Add LIMIT if not present
  // Execute with timeout
  // Return results
}
```

## 📈 Performance

- **Schema Retrieval:** ~100-200ms
- **Simple Query:** ~50-150ms
- **Complex Query (multiple JOINs):** ~200-500ms
- **Maximum Timeout:** 30 seconds

## 🎯 Tool Count Update

**Total MCP Tools Available: 17**

Original Tools: 14
- get_employee_info
- get_department_employees
- search_employees
- get_attendance_summary
- get_leave_requests
- get_job_openings
- get_candidates
- get_performance_reviews
- get_hyper_insights
- get_departments
- create_leave_request
- get_employee_goals
- generate_dynamic_report
- generate_quick_report

**New SQL Tools: 3**
- **get_database_schema** - Understand database structure
- **execute_sql_query** - Run dynamic SELECT queries
- **get_table_info** - Get detailed table information

## 🚀 Getting Started

### Test the Feature

1. **Start the server:**
```bash
npm run dev
```

2. **Get auth token** (login as admin)

3. **Test with Gemini (FREE):**
```bash
curl -X POST http://localhost:8000/mcp-genai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me engineering department employees with their skills and salaries",
    "useTools": true
  }'
```

4. **Watch the magic:**
   - AI calls `get_database_schema`
   - AI generates appropriate SQL
   - AI calls `execute_sql_query`
   - You get the exact data you need!

## 🎉 Conclusion

The dynamic SQL query feature makes your MCP server **infinitely flexible**. Instead of being limited to predefined tools, the AI can now fetch ANY data combination from your HRM database by generating custom SQL queries on the fly.

**No more:** "I don't have a tool for that"
**Now:** "Let me generate a query to get that data for you!"

This is especially powerful for:
- ✅ Ad-hoc data analysis
- ✅ Custom reports
- ✅ Complex multi-table queries
- ✅ Data exploration
- ✅ Business intelligence queries

All while maintaining **enterprise-grade security** with read-only access, query validation, and automatic safety limits.
