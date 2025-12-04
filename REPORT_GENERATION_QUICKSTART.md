# Dynamic Report Generation - Quick Reference

## 🚀 Get Started in 30 Seconds

### Option 1: Via Chat (Easiest)

```bash
curl -X POST http://localhost:8000/mcp/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Generate a report showing employee headcount by department",
    "useTools": true
  }'
```

### Option 2: Direct Tool Call

```bash
curl -X POST http://localhost:8000/mcp/tools/call \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generate_dynamic_report",
    "arguments": {
      "prompt": "Employee headcount by department with attendance rates"
    }
  }'
```

### Option 3: Quick Standard Report

```bash
curl -X POST http://localhost:8000/mcp/tools/call \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generate_quick_report",
    "arguments": {
      "reportType": "recruitment"
    }
  }'
```

---

## 📊 Available Quick Report Types

| Type | Description |
|------|-------------|
| `headcount` | Employee distribution analysis |
| `attendance` | Attendance patterns & trends |
| `recruitment` | Hiring pipeline & metrics |
| `performance` | Review status & goals |
| `leaves` | Leave management summary |
| `onboarding` | New hire tracking |
| `payroll` | Compensation analysis |

---

## ✨ Example Prompts

### Simple
- "Employee count by department"
- "Attendance summary for last month"
- "Pending leave requests"

### Detailed
- "Comprehensive attendance analysis showing late arrivals, absences, and trends for January 2025"
- "Recruitment pipeline report with candidate-to-hire conversion rates and time-to-fill metrics"
- "Performance review status with goal completion rates by department and overdue reviews"

### Comparative
- "Compare Engineering vs Sales department attendance rates"
- "Year-over-year headcount growth analysis"
- "Recruitment efficiency: Q4 2024 vs Q1 2025"

---

## 💾 Response Format

You'll receive reports in **3 formats**:

### 1. JSON (Structured Data)
```json
{
  "metadata": {...},
  "executiveSummary": "...",
  "sections": [...],
  "keyInsights": "...",
  "recommendations": "...",
  "rawData": [...]
}
```

### 2. Markdown (Human-Readable)
```markdown
# Report Title
Generated: 2025-01-18
...
```

### 3. PDF (Print-Ready)
- Base64 encoded
- Professional formatting
- Ready to download

---

## 📥 Save Reports

### JavaScript/TypeScript

```typescript
// Save PDF
const pdfBase64 = response.data.formats.pdf.base64;
const byteCharacters = atob(pdfBase64);
const byteArray = new Uint8Array(
  Array.from(byteCharacters).map(c => c.charCodeAt(0))
);
const blob = new Blob([byteArray], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'report.pdf';
a.click();

// Save Markdown
const mdBlob = new Blob(
  [response.data.formats.markdown],
  { type: 'text/markdown' }
);
// ... same download pattern

// Save JSON
const jsonBlob = new Blob(
  [JSON.stringify(response.data.formats.json, null, 2)],
  { type: 'application/json' }
);
// ... same download pattern
```

### Node.js

```javascript
const fs = require('fs');

// Save all formats
fs.writeFileSync('report.md', report.markdown);
fs.writeFileSync('report.json', JSON.stringify(report.json, null, 2));
fs.writeFileSync('report.pdf', Buffer.from(report.pdf.base64, 'base64'));
```

---

## 🎯 Tips for Best Results

1. **Be Specific**: Include timeframes, departments, or specific metrics
2. **Use Clear Language**: "Show me X" works better than vague requests
3. **Mention Context**: Explain what you're looking for
4. **Request Comparisons**: Specify if you want A vs B analysis
5. **Indicate Depth**: Say "summary" or "detailed analysis"

---

## 🔧 Common Use Cases

### 1. Executive Dashboard
**Prompt:** "Generate an executive summary showing overall company metrics: headcount, attendance rate, open positions, and pending leave requests"

### 2. Department Review
**Prompt:** "Detailed analysis of Engineering department: employee count, attendance patterns, performance review status, and recruitment activities"

### 3. Monthly HR Report
**Prompt:** "Monthly HR report for January 2025 covering new hires, departures, attendance trends, leave usage, and recruitment progress"

### 4. Compliance Check
**Prompt:** "Report showing all employees with incomplete profiles, missing documents, or pending verifications"

### 5. Hiring Analysis
**Prompt:** "Recruitment effectiveness report: time-to-hire, candidate sources, interview-to-offer ratio, and open position status"

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Empty report | Make prompt more specific |
| Slow generation | Normal for large datasets (5-15s) |
| PDF not opening | Check base64 decoding |
| Missing data | Verify date ranges and filters |
| API error | Check Claude API key in `.env` |

---

## 📚 Learn More

- **Full Guide**: `DYNAMIC_REPORT_GENERATION.md`
- **MCP Server Docs**: `MCP_SERVER_DOCUMENTATION.md`
- **Quick Start**: `QUICK_START_MCP.md`

---

## 💡 Pro Tips

- Use chat endpoint for conversational report generation
- Use direct tool call for programmatic integration
- Use quick reports for standard monthly reports
- Chain multiple prompts for comprehensive analysis
- Save JSON for further processing
- Use Markdown for documentation
- Use PDF for sharing with stakeholders

---

**Ready to generate your first report?** Try the examples above! 🚀
