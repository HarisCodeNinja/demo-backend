# Frontend API Guide: Smart Query Routing

Backend API for your React app to implement intelligent query routing between Claude Desktop and HTTP API.

---

## Quick Start

### 1. Analyze Any Query Before Execution

```javascript
// In your React app
const analyzeQuery = async (userQuery) => {
  const response = await fetch('http://localhost:3000/mcp/analyze-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: userQuery })
  });

  return await response.json();
};

// Usage
const analysis = await analyzeQuery("give me list of employees with increment charts");
console.log(analysis);
```

**Response:**
```json
{
  "success": true,
  "query": "give me list of employees with increment charts",
  "analysis": {
    "complexity": "high",
    "score": 9,
    "suggestedMethod": "claude-desktop",
    "estimatedTime": {
      "claudeDesktop": "4-6s",
      "httpApi": "20-30s"
    },
    "requiresTools": true,
    "toolsNeeded": ["employee_data", "reports"],
    "reasoning": "Complexity score: 9/10 (high). Detected keywords: chart, list, employees. Requires 2 tool category(ies). Complex queries benefit from Claude Desktop's optimized local execution",
    "recommendation": {
      "primary": "Claude Desktop (Recommended)",
      "alternative": "HTTP API (Available but slower)",
      "warning": "This query may take 15-30 seconds via HTTP API. Claude Desktop provides 5-10x faster results."
    }
  },
  "endpoints": {
    "claudeDesktop": {
      "method": "Open Claude Desktop",
      "description": "Use the Claude Desktop app with your configured MCP server",
      "estimatedTime": "4-6s",
      "available": true
    },
    "httpApi": {
      "conversational": {
        "method": "POST",
        "endpoint": "/mcp/chat/conversational",
        "description": "Non-streaming endpoint for complete responses",
        "estimatedTime": "20-30s"
      },
      "streaming": {
        "method": "POST",
        "endpoint": "/mcp/chat/stream",
        "description": "Streaming endpoint for real-time responses",
        "estimatedTime": "20-30s"
      }
    }
  }
}
```

---

## Available Endpoints

### 1. **POST /mcp/analyze-query** - Full Analysis

**Purpose**: Get detailed analysis of query complexity and routing recommendations

**Request:**
```json
{
  "query": "your user query here"
}
```

**Response:** Complete analysis (see above)

**When to use:**
- Before executing any query
- To show recommendations to users
- For routing decisions

---

### 2. **POST /mcp/complexity-check** - Quick Check

**Purpose**: Fast complexity check without full analysis

**Request:**
```json
{
  "query": "your user query here"
}
```

**Response:**
```json
{
  "success": true,
  "query": "create charts for employee data",
  "complexity": "high",
  "recommendation": "claude-desktop",
  "useDesktop": true
}
```

**When to use:**
- For fast routing decisions
- When you don't need detailed analysis
- For immediate UX feedback

---

### 3. **GET /mcp/routing-config** - Configuration

**Purpose**: Get all configuration for frontend routing logic

**Request:** None (GET request)

**Response:**
```json
{
  "success": true,
  "configuration": {
    "complexityLevels": {
      "low": {
        "description": "Simple queries with single tool calls",
        "examples": ["How many employees?", "Get employee count"],
        "recommendedMethod": "HTTP API"
      },
      "medium": { ... },
      "high": {
        "description": "Complex analysis, chart generation, or multi-tool queries",
        "examples": [
          "Generate chart showing increment analysis",
          "Compare departments and create visualization"
        ],
        "recommendedMethod": "Claude Desktop"
      }
    },
    "keywords": { ... },
    "toolPatterns": { ... }
  },
  "endpoints": {
    "analyze": {
      "method": "POST",
      "path": "/mcp/analyze-query"
    },
    "chat": {
      "conversational": "/mcp/chat/conversational",
      "streaming": "/mcp/chat/stream"
    }
  },
  "guidelines": {
    "claudeDesktop": {
      "when": "Use for high complexity queries (score > 6)",
      "benefits": ["5-10x faster", "Better UX", "Instant tool execution"]
    },
    "httpApi": { ... }
  }
}
```

**When to use:**
- On app initialization
- To show examples to users
- For client-side validation

---

## React Implementation Examples

### Example 1: Smart Query Component

```jsx
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Zap, Copy, ArrowRight } from 'lucide-react';

function SmartQueryInput() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeQuery = async () => {
    if (!query) return;

    setLoading(true);
    const response = await fetch('http://localhost:3000/mcp/analyze-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    setAnalysis(data.analysis);
    setLoading(false);
  };

  const copyToClaude = () => {
    navigator.clipboard.writeText(query);
    // Show toast: "Copied! Paste in Claude Desktop"
  };

  const continueWithHttp = async () => {
    // Execute via HTTP API
    const response = await fetch('http://localhost:3000/mcp/chat/conversational', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }]
      })
    });
    // Handle response
  };

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={analyzeQuery}
          placeholder="Ask anything about your HRM data..."
          className="w-full p-3 border rounded-lg"
          rows={3}
        />
      </div>

      {analysis && analysis.complexity === 'high' && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <Zap className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Faster Results Available!</AlertTitle>
          <AlertDescription>
            <p className="text-sm mb-3">
              {analysis.recommendation.warning}
            </p>
            <div className="flex gap-2">
              <Button onClick={copyToClaude} variant="default">
                <Copy className="w-4 h-4 mr-2" />
                Copy to Claude Desktop ({analysis.estimatedTime.claudeDesktop})
              </Button>
              <Button onClick={continueWithHttp} variant="outline">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue Here ({analysis.estimatedTime.httpApi})
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {analysis && analysis.complexity !== 'high' && (
        <Button onClick={continueWithHttp} className="w-full">
          Submit Query
        </Button>
      )}
    </div>
  );
}
```

---

### Example 2: Quick Routing Hook

```javascript
// hooks/useQueryRouting.js
import { useState, useCallback } from 'react';

export function useQueryRouting() {
  const [routing, setRouting] = useState(null);

  const analyzeQuery = useCallback(async (query) => {
    const response = await fetch('http://localhost:3000/mcp/complexity-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    setRouting(data);
    return data;
  }, []);

  const shouldShowDesktopOption = routing?.useDesktop === true;

  return {
    analyzeQuery,
    routing,
    shouldShowDesktopOption,
    complexity: routing?.complexity,
  };
}

// Usage in component
function QueryComponent() {
  const { analyzeQuery, shouldShowDesktopOption } = useQueryRouting();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.length > 10) {
      analyzeQuery(query);
    }
  }, [query, analyzeQuery]);

  if (shouldShowDesktopOption) {
    return <DesktopRecommendation query={query} />;
  }

  return <NormalQueryInput query={query} />;
}
```

---

### Example 3: Configuration Loader

```javascript
// utils/mcpConfig.js
let config = null;

export async function loadMCPConfig() {
  if (config) return config;

  const response = await fetch('http://localhost:3000/mcp/routing-config');
  const data = await response.json();
  config = data;
  return config;
}

export function getComplexityExamples(level) {
  return config?.configuration?.complexityLevels[level]?.examples || [];
}

export function getKeywords() {
  return config?.configuration?.keywords || {};
}

// In your App.js
import { loadMCPConfig } from './utils/mcpConfig';

function App() {
  useEffect(() => {
    loadMCPConfig();
  }, []);

  return <YourApp />;
}
```

---

### Example 4: Progressive Query Experience

```jsx
function ProgressiveQueryHandler({ query }) {
  const [stage, setStage] = useState('analyzing');
  const [analysis, setAnalysis] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function process() {
      // Step 1: Analyze
      setStage('analyzing');
      const analysisRes = await fetch('http://localhost:3000/mcp/analyze-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const analysisData = await analysisRes.json();
      setAnalysis(analysisData.analysis);

      // Step 2: Show recommendation
      if (analysisData.analysis.complexity === 'high') {
        setStage('recommending-desktop');
        return;
      }

      // Step 3: Execute via HTTP
      setStage('executing');
      const chatRes = await fetch('http://localhost:3000/mcp/chat/conversational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }]
        })
      });
      const chatData = await chatRes.json();
      setResult(chatData);
      setStage('complete');
    }

    process();
  }, [query]);

  if (stage === 'analyzing') {
    return <div>Analyzing query complexity...</div>;
  }

  if (stage === 'recommending-desktop') {
    return (
      <DesktopRecommendationCard
        analysis={analysis}
        onContinueHttp={() => setStage('executing')}
      />
    );
  }

  if (stage === 'executing') {
    return <div>Processing... ({analysis.estimatedTime.httpApi})</div>;
  }

  return <ResultDisplay result={result} />;
}
```

---

## Complexity Detection Logic

### Complexity Scores

| Score | Level | Recommendation | Examples |
|-------|-------|----------------|----------|
| 1-3 | Low | HTTP API | "How many employees?", "Get count" |
| 4-6 | Medium | Either | "List employees", "Find by department" |
| 7-10 | High | Claude Desktop | "Create charts", "Generate dashboard" |

### Keywords That Increase Complexity

**High Impact (+3 each):**
- chart, charts, graph, visualization, dashboard
- component, ui, generate, create
- shadcn, react, preview
- analyze, analysis, compare, trends

**Medium Impact (+2 each):**
- list, show, find, search, filter
- employees, candidates, reviews, performance

**Low Impact (+1 each):**
- count, how many, total, status

---

## Error Handling

```javascript
async function analyzeQuerySafe(query) {
  try {
    const response = await fetch('http://localhost:3000/mcp/analyze-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    return data.analysis;
  } catch (error) {
    console.error('Query analysis error:', error);
    // Fallback: assume medium complexity
    return {
      complexity: 'medium',
      suggestedMethod: 'either',
      estimatedTime: {
        claudeDesktop: '2-4s',
        httpApi: '8-15s'
      }
    };
  }
}
```

---

## Best Practices

### 1. Analyze Before Executing
```javascript
// ❌ Don't do this
submitQuery(query);

// ✅ Do this
const analysis = await analyzeQuery(query);
if (analysis.complexity === 'high') {
  showDesktopOption();
} else {
  submitQuery(query);
}
```

### 2. Cache Configuration
```javascript
// Load once on app start
const config = await loadMCPConfig();
// Use config throughout app without re-fetching
```

### 3. Provide User Choice
```javascript
// Always let users decide
<div>
  <RecommendedOption />
  <AlternativeOption />
</div>
```

### 4. Show Time Estimates
```javascript
// Help users make informed decisions
<Button>
  Claude Desktop (2-3s) - Recommended
</Button>
<Button>
  Continue Here (15-20s)
</Button>
```

---

## Complete Flow Example

```javascript
// Complete integration example
function QueryInterface() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [result, setResult] = useState(null);
  const [method, setMethod] = useState(null);

  // Step 1: Analyze on input blur or button click
  const handleAnalyze = async () => {
    const res = await fetch('http://localhost:3000/mcp/analyze-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setAnalysis(data.analysis);
  };

  // Step 2: Handle method selection
  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);

    if (selectedMethod === 'claude-desktop') {
      // Copy to clipboard and show instructions
      navigator.clipboard.writeText(query);
      toast.success('Query copied! Paste in Claude Desktop');
    } else {
      // Execute via HTTP
      executeQuery();
    }
  };

  // Step 3: Execute via HTTP
  const executeQuery = async () => {
    const res = await fetch('http://localhost:3000/mcp/chat/conversational', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }]
      })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button onClick={handleAnalyze}>Analyze Query</Button>

      {analysis && (
        <MethodSelector
          analysis={analysis}
          onSelect={handleMethodSelect}
        />
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
}
```

---

## Summary

Your React app can now:

1. **Analyze any query** before execution
2. **Get routing recommendations** based on complexity
3. **Show time estimates** for each method
4. **Guide users** to the fastest option
5. **Provide choice** between Claude Desktop and HTTP

The backend handles all the intelligence - your frontend just needs to call the APIs and show the recommendations!

Happy building! 🚀
