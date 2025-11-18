# Dynamic Report Generation - Complete Guide

## 🎯 Overview

The **Dynamic Report Generator** is a powerful AI-powered feature that can create comprehensive HRM reports from any natural language prompt. Simply describe what you want, and Claude AI will:

1. Analyze your request
2. Determine what data to fetch
3. Execute the necessary queries
4. Generate a professional report
5. Return it in **3 formats**: JSON, Markdown (.md), and PDF

## ✨ Key Features

- **Natural Language Input**: Just describe what you want - no SQL or complex queries needed
- **Intelligent Data Fetching**: Claude automatically determines which data to query
- **Multi-Format Output**: Get your report as JSON, Markdown, and PDF
- **Professional Formatting**: Reports include headers, sections, insights, and recommendations
- **Metadata Included**: Track which tools were used and how many data points were analyzed
- **Predefined Quick Reports**: 7 standard report types ready to use

---

## 🚀 Quick Start

### Example 1: Custom Report via Chat

```bash
curl -X POST http://localhost:8000/mcp/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Generate a report showing employee headcount by department with attendance rates",
    "useTools": true
  }'
```

Claude will automatically:
- Use the `generate_dynamic_report` tool
- Fetch department and attendance data
- Create a comprehensive report
- Return it in all 3 formats

### Example 2: Direct Tool Call

```bash
curl -X POST http://localhost:8000/mcp/tools/call \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generate_dynamic_report",
    "arguments": {
      "prompt": "Create an attendance analysis report for the last month showing trends, late comers, and absentee patterns"
    }
  }'
```

### Example 3: Quick Report

```bash
curl -X POST http://localhost:8000/mcp/tools/call \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generate_quick_report",
    "arguments": {
      "reportType": "recruitment",
      "filters": {
        "startDate": "2025-01-01",
        "endDate": "2025-01-31"
      }
    }
  }'
```

---

## 📊 Available Report Types

### 1. Dynamic Reports (Unlimited Possibilities)

**Tool:** `generate_dynamic_report`

**Examples of what you can request:**

#### Employee Reports
- "Employee headcount by department and designation"
- "List of all employees in Engineering with their roles"
- "New hires in the last 3 months"
- "Employees with incomplete profiles"

#### Attendance Reports
- "Attendance analysis for last month"
- "Late arrivals pattern for the past week"
- "Department-wise attendance rate comparison"
- "Employees with high absenteeism"

#### Recruitment Reports
- "Recruitment pipeline status for all open positions"
- "Candidate-to-hire conversion rate"
- "Interview feedback pending for each position"
- "Time-to-hire analysis"

#### Performance Reports
- "Performance review status for Q4 2024"
- "Goal completion rate by department"
- "Employees overdue for performance review"
- "Top performers this quarter"

#### Leave Management
- "Leave balance analysis by department"
- "Pending leave approvals"
- "Leave pattern analysis for the year"
- "Employees with excessive leave usage"

#### Custom Analytics
- "Compare Engineering vs Sales department metrics"
- "Executive summary of HR operations"
- "Onboarding completion rates"
- "Skills gap analysis"

### 2. Quick Reports (Predefined)

**Tool:** `generate_quick_report`

| Report Type | Description |
|-------------|-------------|
| `headcount` | Employee distribution by department, designation, location |
| `attendance` | Attendance rates, late comers, absentee patterns, trends |
| `recruitment` | Job openings, pipeline, interview feedback, hiring metrics |
| `performance` | Review status, goal completion, performance trends |
| `leaves` | Pending approvals, leave patterns, balance analysis |
| `onboarding` | New hires, incomplete items, completion rates |
| `payroll` | Salary structures, compensation analysis, statistics |

---

## 📝 Response Format

### Response Structure

```json
{
  "status": "success",
  "data": {
    "success": true,
    "message": "Report generated successfully: Employee Headcount Analysis",
    "metadata": {
      "title": "Employee Headcount Analysis",
      "generatedAt": "2025-01-18T10:30:00.000Z",
      "toolsUsed": ["get_departments", "get_department_employees"],
      "dataPoints": 150
    },
    "formats": {
      "json": {
        "metadata": {...},
        "executiveSummary": "...",
        "sections": [...],
        "keyInsights": "...",
        "recommendations": "...",
        "rawData": [...],
        "fullReport": "..."
      },
      "markdown": "# Report Title\n\n---\n\n...",
      "pdf": {
        "base64": "JVBERi0xLjMKJcTl8uXrp...",
        "size": 45678,
        "encoding": "base64"
      }
    },
    "downloadInstructions": {
      "markdown": "Save the markdown content to a .md file",
      "pdf": "Decode the base64 string and save as .pdf",
      "json": "The json object contains all structured data"
    }
  }
}
```

---

## 💾 Saving Reports

### Save Markdown File

```javascript
// Frontend JavaScript
const reportData = response.data.formats.markdown;

// Create blob and download
const blob = new Blob([reportData], { type: 'text/markdown' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'hrm-report.md';
a.click();
```

### Save PDF File

```javascript
// Frontend JavaScript
const pdfBase64 = response.data.formats.pdf.base64;

// Convert base64 to blob
const byteCharacters = atob(pdfBase64);
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
  byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);
const blob = new Blob([byteArray], { type: 'application/pdf' });

// Download
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'hrm-report.pdf';
a.click();
```

### Save JSON File

```javascript
// Frontend JavaScript
const jsonData = response.data.formats.json;

const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
  type: 'application/json'
});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'hrm-report.json';
a.click();
```

### Node.js Backend

```javascript
const fs = require('fs');

// Save Markdown
fs.writeFileSync('report.md', response.data.formats.markdown);

// Save PDF
const pdfBuffer = Buffer.from(
  response.data.formats.pdf.base64,
  'base64'
);
fs.writeFileSync('report.pdf', pdfBuffer);

// Save JSON
fs.writeFileSync(
  'report.json',
  JSON.stringify(response.data.formats.json, null, 2)
);
```

---

## 🎨 Frontend Integration

### React Component

```typescript
// components/ReportGenerator.tsx
import { useState } from 'react';

export function ReportGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/mcp/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Generate a report: ${prompt}`,
          useTools: true,
        }),
      });

      const data = await response.json();

      // Extract report from tool calls
      const reportCall = data.data.toolCalls?.find(
        (call: any) => call.name === 'generate_dynamic_report'
      );

      if (reportCall?.result?.content?.[0]?.text) {
        const reportData = JSON.parse(reportCall.result.content[0].text);
        setReport(reportData);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;

    const pdfBase64 = report.formats.pdf.base64;
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.metadata.title}.pdf`;
    a.click();
  };

  const downloadMarkdown = () => {
    if (!report) return;

    const blob = new Blob([report.formats.markdown], {
      type: 'text/markdown'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.metadata.title}.md`;
    a.click();
  };

  return (
    <div className="report-generator">
      <h2>Generate Custom Report</h2>

      <div className="input-section">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the report you want... e.g., 'Employee headcount by department with attendance rates'"
          rows={4}
        />
        <button onClick={generateReport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {report && (
        <div className="report-output">
          <h3>{report.metadata.title}</h3>
          <p>Generated: {new Date(report.metadata.generatedAt).toLocaleString()}</p>
          <p>Tools Used: {report.metadata.toolsUsed.join(', ')}</p>
          <p>Data Points: {report.metadata.dataPoints}</p>

          <div className="download-buttons">
            <button onClick={downloadPDF}>Download PDF</button>
            <button onClick={downloadMarkdown}>Download Markdown</button>
            <button onClick={() => {
              const blob = new Blob(
                [JSON.stringify(report.formats.json, null, 2)],
                { type: 'application/json' }
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${report.metadata.title}.json`;
              a.click();
            }}>
              Download JSON
            </button>
          </div>

          <div className="preview">
            <h4>Preview (Markdown)</h4>
            <pre>{report.formats.markdown}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 How It Works (Technical)

### Architecture

```
User Prompt
    ↓
Claude AI (Planning Phase)
    ↓
Determines: What data? Which tools? What sections?
    ↓
Tool Executor
    ↓
Fetch data from HRM database
    ↓
Claude AI (Analysis Phase)
    ↓
Analyze data & generate report content
    ↓
Report Formatter
    ↓
├─ JSON (Structured data)
├─ Markdown (Human-readable)
└─ PDF (Print-ready)
```

### Processing Steps

1. **Planning Phase**
   - Claude analyzes the natural language prompt
   - Determines which HRM tools to use
   - Plans report structure and sections

2. **Data Collection Phase**
   - Executes planned tools
   - Gathers data from database
   - Handles errors gracefully

3. **Analysis Phase**
   - Claude analyzes collected data
   - Generates insights and recommendations
   - Structures content into sections

4. **Formatting Phase**
   - Creates JSON with all structured data
   - Generates Markdown with proper formatting
   - Produces PDF with professional layout

---

## 📋 Report Structure

Every generated report includes:

### JSON Format

```json
{
  "metadata": {
    "title": "Report Title",
    "generatedAt": "ISO timestamp",
    "prompt": "Original user prompt",
    "analysisType": "summary|detailed|trend|comparison",
    "toolsUsed": ["tool1", "tool2"],
    "dataPointCount": 150
  },
  "executiveSummary": "High-level overview...",
  "sections": [
    {
      "title": "Section Name",
      "content": "Section content..."
    }
  ],
  "keyInsights": "Important findings...",
  "recommendations": "Action items...",
  "rawData": [...],
  "fullReport": "Complete report text..."
}
```

### Markdown Format

```markdown
# Report Title

---

**Generated:** Date and time
**Tools Used:** List of tools
**Data Points:** Count

---

## Executive Summary

Overview of findings...

## Section 1

Content...

## Section 2

Content...

## Key Insights and Recommendations

- Insight 1
- Insight 2
- Recommendation 1

## Conclusion

Summary...

---

*Report generated by HRM MCP Server with Claude AI*
```

### PDF Format

- Professional header with title
- Metadata section (date, tools, data points)
- Clear section headings
- Bullet points and formatting
- Page numbers and pagination
- Footer with attribution

---

## 🎯 Best Practices

### Writing Effective Prompts

**Good Prompts:**
- ✅ "Employee headcount by department with attendance rates"
- ✅ "Recruitment pipeline analysis showing candidate flow and bottlenecks"
- ✅ "Performance review summary for Q4 2024 with completion rates"

**Poor Prompts:**
- ❌ "Give me data" (too vague)
- ❌ "Report" (no context)
- ❌ "Show me everything" (too broad)

### Tips for Better Reports

1. **Be Specific**: Include timeframes, departments, or metrics you want
2. **Use Clear Language**: Describe what you want to see
3. **Mention Comparisons**: If you want A vs B analysis, say so
4. **Specify Depth**: Say "summary" or "detailed analysis"
5. **Include Context**: Mention why you need the report

---

## 🔒 Security & Permissions

- All report generation requires authentication
- Minimum role: Manager, HR, or Admin
- Reports only show data the user has permission to access
- No data modification - read-only operations
- API key required for Claude AI integration

---

## 🐛 Troubleshooting

### "Report generation failed"

**Causes:**
- Invalid Claude API key
- Missing required data
- Database connection issues

**Solutions:**
1. Check `.env` has valid `CLAUDE_API_KEY`
2. Verify data exists for the requested period
3. Check server logs for detailed errors

### "PDF encoding error"

**Solution:** Ensure you're decoding base64 correctly:
```javascript
const pdfBuffer = Buffer.from(base64String, 'base64');
```

### "Empty or incomplete report"

**Causes:**
- Prompt too vague
- No matching data found

**Solutions:**
1. Make prompt more specific
2. Check date ranges are valid
3. Verify data exists in database

---

## 📊 Performance

- **Average Generation Time**: 5-15 seconds
- **Token Usage**: 2000-6000 tokens per report
- **Supported Data Volume**: Up to 10,000 records per report
- **Concurrent Requests**: Handled by Claude API rate limits

---

## 🔮 Future Enhancements

Planned features:

- [ ] Chart and graph generation
- [ ] Email delivery of reports
- [ ] Scheduled automatic reports
- [ ] Custom templates
- [ ] Excel format export
- [ ] Report history and versioning
- [ ] Collaborative report editing
- [ ] Multi-language support

---

## 📚 Examples Library

### Example 1: Comprehensive Employee Report

**Prompt:**
```
Generate a comprehensive employee report showing headcount by department,
average tenure, new hires in last quarter, and attrition rate
```

### Example 2: Attendance Deep Dive

**Prompt:**
```
Create a detailed attendance analysis for January 2025 including daily rates,
top late comers, departments with issues, and recommendations
```

### Example 3: Recruitment Efficiency

**Prompt:**
```
Recruitment efficiency report showing time-to-hire, offer acceptance rate,
candidate sources, and interview-to-hire conversion by position
```

### Example 4: Performance Insights

**Prompt:**
```
Performance management report with review completion status, goal achievement
rates by department, and identification of high/low performers
```

---

## 🆘 Support

For issues or questions:
- Check server logs: `npm run dev` console output
- Review Claude API usage: [Anthropic Console](https://console.anthropic.com/)
- Test with simple prompts first
- Verify authentication and permissions

---

**Last Updated:** 2025-01-18
**Version:** 1.0.0
**Feature:** Dynamic Report Generation with Claude AI
