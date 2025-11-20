# Clean Response Format - HYPER Style

## ✅ Updated Response Format

The MCP chat endpoints now return **clean responses** like the HYPER module - just the data, no meta information about tool calls or usage.

**NEW:** When a single tool is called, you get the raw structured data (like direct HYPER endpoints) instead of AI's text summary! 🎯

---

## 📊 Response Format Changes

### **Before (Verbose):**
```json
{
  "status": "success",
  "data": {
    "response": "There were no attendance records found...",
    "toolCalls": [
      {
        "name": "get_attendance_summary",
        "input": {...},
        "result": {...}
      }
    ],
    "usage": {
      "input_tokens": 1812,
      "output_tokens": 60
    },
    "aiProvider": "Google Gemini"
  }
}
```

### **After (Clean - Single Tool Called):**
```json
{
  "data": {
    "date": "2025-11-20T18:59:59.999Z",
    "totalEmployees": 6,
    "present": 0,
    "absent": 6,
    "departments": [
      {
        "departmentName": "Engineering",
        "present": 0,
        "total": 2,
        "percentage": 0
      }
    ]
  },
  "meta": {
    "message": "Attendance summary for Thu Nov 20 2025"
  }
}
```

**Structured data! Just like calling the HYPER endpoint directly!** ✅

### **After (Clean - Text Response):**
```json
{
  "data": "There were no attendance records found for the week of November 12-18, 2025."
}
```

**Simple text for complex queries or multiple tool calls!** ✅

---

## 🧠 Smart Response Logic

The MCP endpoints now intelligently decide what format to return:

### **Structured Data (Single Tool)**
When the AI calls **exactly one tool** (e.g., `get_attendance_summary`), you get the **raw structured data** from that tool - just like calling the HYPER endpoint directly.

**Example:**
```bash
POST /mcp-genai/chat
{
  "message": "Give me today's attendance summary"
}
```

**What happens:**
1. AI calls `get_attendance_summary` tool
2. Tool returns structured JSON with departments, counts, percentages
3. **You get the raw JSON directly** - no AI interpretation!

**Response:**
```json
{
  "data": {
    "date": "2025-11-20",
    "totalEmployees": 6,
    "present": 0,
    "absent": 6,
    "departments": [...]
  },
  "meta": {...}
}
```

### **Text Response (Multiple Tools or Analysis)**
When the AI calls **multiple tools** or does **analysis/calculations**, you get the AI's text summary.

**Example:**
```bash
POST /mcp-genai/chat
{
  "message": "Compare attendance between Engineering and Marketing departments"
}
```

**What happens:**
1. AI calls `get_departments` tool
2. AI calls `get_attendance_summary` tool
3. AI analyzes and compares the data
4. **You get AI's analysis** as text

**Response:**
```json
{
  "data": "Engineering has 80% attendance (8/10 present) while Marketing has 90% attendance (9/10 present). Marketing is performing better this week."
}
```

### **When You Get Structured Data:**
✅ Simple direct queries (e.g., "show employees", "attendance summary")
✅ Single tool called by AI
✅ Tool returns valid JSON
✅ `typeOfResponse` is 'json' (default)

### **When You Get Text:**
✅ Complex queries requiring analysis
✅ Multiple tools called
✅ AI needs to combine/interpret data
✅ Tool returns non-JSON data
✅ `typeOfResponse` is 'md' or 'pdf'

---

## 🎨 Supported Response Formats

### 1. **JSON (Default)**
```bash
POST /mcp-genai/chat
{
  "message": "Show me attendance summary for last week"
}

# OR explicitly specify:
{
  "message": "Show me attendance summary for last week",
  "typeOfResponse": "json"
}
```

**Response:**
```json
{
  "data": "AI's text response here"
}
```

---

### 2. **Markdown**
```bash
POST /mcp-genai/chat
{
  "message": "Show me employees in Engineering department",
  "typeOfResponse": "md"
}
```

**Response:** (Content-Type: text/markdown)
```markdown
# Engineering Department Employees

- John Doe (Software Engineer)
- Jane Smith (Senior Developer)
- Bob Johnson (Team Lead)

Total: 3 employees
```

---

### 3. **PDF**
```bash
POST /mcp-genai/chat
{
  "message": "Generate performance report",
  "typeOfResponse": "pdf"
}
```

**Response:**
```json
{
  "message": "PDF generation requires using generate_dynamic_report or generate_quick_report tools",
  "response": "Text response"
}
```

**Note:** For actual PDF output, use the dedicated report endpoints:
- `/mcp-genai/generate-report` (dynamic)
- `/mcp-genai/generate-quick-report` (predefined)

---

## 🔧 Implementation Details

### Both Endpoints Updated:
1. ✅ **Gemini:** `/mcp-genai/chat`
2. ✅ **Claude:** `/mcp/chat`

### Code Changes:

**genaiController.ts:**
```typescript
static chat = asyncHandler(async (req: Request, res: Response) => {
  const { message, typeOfResponse = 'json' } = req.body;

  const result = await genaiService.chat(message, ...);

  switch (typeOfResponse.toLowerCase()) {
    case 'md':
    case 'markdown':
      res.setHeader('Content-Type', 'text/markdown');
      res.send(result.response);
      break;

    case 'json':
    default:
      res.json({ data: result.response });  // Clean!
      break;
  }
});
```

---

## 📝 Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | ✅ Yes | - | Your question/request |
| `conversationHistory` | array | ❌ No | `[]` | Previous messages |
| `useTools` | boolean | ❌ No | `true` | Enable AI tools |
| `typeOfResponse` | string | ❌ No | `'json'` | Response format: `'json'`, `'md'`, `'pdf'` |

---

## 🎯 Examples

### Example 1: Simple Query (JSON)
```bash
POST /mcp-genai/chat
{
  "message": "Show me attendance summary for last week"
}
```

**Response:**
```json
{
  "data": "Attendance summary for November 12-18, 2025:\n- Total records: 0\n- No attendance data found for this period."
}
```

---

### Example 2: Complex Query (JSON)
```bash
POST /mcp-genai/chat
{
  "message": "Show me employees in Engineering with their skills and salaries"
}
```

**Response:**
```json
{
  "data": "Engineering Department Employees with Skills and Salaries:\n\n1. John Doe\n   - Skills: Python (Expert), JavaScript (Advanced)\n   - Base Salary: $75,000\n   - Gross Salary: $85,000\n\n2. Jane Smith\n   - Skills: React (Expert), Node.js (Advanced)\n   - Base Salary: $82,000\n   - Gross Salary: $92,000\n\nTotal: 2 employees"
}
```

---

### Example 3: Markdown Format
```bash
POST /mcp-genai/chat
{
  "message": "List all departments with employee counts",
  "typeOfResponse": "md"
}
```

**Response:** (text/markdown)
```markdown
# Departments and Employee Counts

| Department | Employee Count |
|------------|----------------|
| Engineering | 15 |
| Marketing | 8 |
| Sales | 12 |
| HR | 5 |

**Total Departments:** 4
**Total Employees:** 40
```

---

## ✅ Benefits

1. **Cleaner Responses**
   - Just the answer, no noise
   - Matches HYPER module style
   - Easier to parse and display

2. **Flexible Formatting**
   - JSON for APIs
   - Markdown for documents
   - PDF for reports (via dedicated endpoints)

3. **Simplified Integration**
   - No need to navigate nested structures
   - Direct access to the answer
   - Less client-side processing

4. **Consistent with HYPER**
   - Same pattern as existing modules
   - Familiar to frontend developers
   - Easier to maintain

---

## 🔄 Migration Guide

### **Old Code:**
```typescript
// Before
const response = await fetch('/mcp-genai/chat', {
  method: 'POST',
  body: JSON.stringify({ message: "..." })
});

const data = await response.json();
const answer = data.data.response;  // ❌ Nested
const toolCalls = data.data.toolCalls;  // ❌ Extra info
```

### **New Code:**
```typescript
// After
const response = await fetch('/mcp-genai/chat', {
  method: 'POST',
  body: JSON.stringify({ message: "..." })
});

const data = await response.json();
const answer = data.data;  // ✅ Direct access!
```

---

## 📊 Response Format Comparison

| Format | Content-Type | Use Case |
|--------|--------------|----------|
| `json` | `application/json` | API responses, chat interfaces |
| `md` | `text/markdown` | Documentation, formatted text |
| `pdf` | N/A (use report endpoints) | Formal reports, exports |

---

## 🎯 When to Use Each Format

### Use `json` (default):
- ✅ Chat interfaces
- ✅ API integrations
- ✅ Mobile apps
- ✅ General queries

### Use `md`:
- ✅ Documentation generation
- ✅ Email content
- ✅ Blog posts
- ✅ Formatted text output

### Use dedicated report endpoints for `pdf`:
- ✅ Formal reports
- ✅ Executive summaries
- ✅ Downloadable documents
- ✅ Archival purposes

---

## 🚀 What Changed

### ✅ Removed from Response:
- ❌ `toolCalls` array
- ❌ `usage` statistics
- ❌ `aiProvider` info
- ❌ `status` wrapper
- ❌ Nested `data.response` structure

### ✅ Added to Response:
- ✅ Clean `{ data: "answer" }` structure
- ✅ `typeOfResponse` parameter support
- ✅ Content-Type headers for markdown
- ✅ HYPER-style simplicity

---

## 📝 Notes

1. **Tool Calls Hidden:** The AI still uses tools behind the scenes, but you don't see them in the response anymore.

2. **Usage Stats Removed:** Token usage is no longer included in responses. Use monitoring tools if needed.

3. **Error Handling:** Errors still return standard error format for debugging.

4. **Backward Compatibility:** Old response format is gone. Update client code accordingly.

5. **PDF Reports:** For PDF output, use the dedicated report generation endpoints:
   - `/mcp-genai/generate-report` (dynamic)
   - `/mcp-genai/generate-quick-report` (predefined types)

---

## ✅ Summary

**Before:**
- Verbose responses with tool calls, usage stats, metadata
- Nested data structures
- AI's text interpretation of data
- Hard to extract the actual structured data

**After:**
- Clean, simple responses
- **Smart structured data return** - raw JSON when single tool called
- AI text summary for complex queries
- HYPER module style - identical to direct endpoints
- Support for multiple formats (JSON, Markdown, PDF)
- Easy integration

**Key Features:**
1. **Structured Data:** Get raw JSON from tools (like HYPER endpoints)
2. **AI Analysis:** Get text summaries for complex queries
3. **Smart Detection:** Automatically chooses best response format
4. **Type Safety:** Full TypeScript support
5. **Format Control:** JSON, Markdown, or PDF via `typeOfResponse`

**Your MCP endpoints now return clean, production-ready responses with intelligent structured data!** 🎉
