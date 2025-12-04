# Smooth Real-Time Streaming Guide

The streaming endpoint now provides **grouped, structured events** that are easy to consume in your React app with **no gaps** and real-time updates.

---

## Event Types (Grouped & Structured)

### 1. `session_start` - Session Initialized
```json
{
  "type": "session_start",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Processing your request..."
}
```
**Show**: Loading indicator, "Analyzing your query..."

---

### 2. `text_chunk` - Streaming Text (Real-time)
```json
{
  "type": "text_chunk",
  "chunk": "Based on the data",
  "accumulated": "I'll help you find... Based on the data",
  "position": 145
}
```
**Show**: Append `chunk` to display **OR** replace with `accumulated` for smooth display

**Key**: You get BOTH the new chunk AND the full accumulated text!

---

### 3. `tool_detected` - Tool Identified
```json
{
  "type": "tool_detected",
  "tool": "get_candidates",
  "toolsInProgress": ["get_candidates"],
  "message": "Preparing to use: get_candidates"
}
```
**Show**: "Preparing tools..."

---

### 4. `tools_executing` - Batch Tool Execution Start
```json
{
  "type": "tools_executing",
  "tools": [
    { "name": "get_candidates", "input": { "status": "cleared" } },
    { "name": "get_employees", "input": {} }
  ],
  "count": 2,
  "message": "Executing 2 tools..."
}
```
**Show**: Progress bar, "Fetching data from 2 sources..."

---

### 5. `tool_progress` - Individual Tool Progress
```json
// Executing
{
  "type": "tool_progress",
  "tool": "get_candidates",
  "status": "executing",
  "progress": "1/2",
  "message": "Executing get_candidates..."
}

// Completed
{
  "type": "tool_progress",
  "tool": "get_candidates",
  "status": "completed",
  "progress": "1/2",
  "message": "✓ get_candidates completed",
  "resultPreview": "{\"data\":[{\"name\":\"John Doe\"...}"
}

// Error
{
  "type": "tool_progress",
  "tool": "get_candidates",
  "status": "error",
  "progress": "1/2",
  "message": "✗ get_candidates failed: Connection timeout",
  "error": "Connection timeout"
}
```
**Show**: Progress indicator with checkmarks/errors

---

### 6. `tools_completed` - All Tools Finished
```json
{
  "type": "tools_completed",
  "completedCount": 2,
  "errorCount": 0,
  "totalCount": 2,
  "message": "Tool execution complete. Analyzing results..."
}
```
**Show**: "Processing results..."

---

### 7. `iteration_start` - Next Analysis Round
```json
{
  "type": "iteration_start",
  "iteration": 2,
  "message": "Analyzing tool results..."
}
```
**Show**: "Analyzing data..." (for multi-step queries)

---

### 8. `complete` - Final Response
```json
{
  "type": "complete",
  "iterations": 2,
  "totalText": "Complete response text here...",
  "textLength": 1245,
  "timestamp": "2024-01-15T10:30:15.000Z",
  "message": "Response complete"
}
```
**Show**: Hide loading, show complete indicator

---

### 9. `error` - Error Occurred
```json
{
  "type": "error",
  "error": "API key invalid",
  "timestamp": "2024-01-15T10:30:05.000Z"
}
```
**Show**: Error message

---

## React Implementation

### Complete Example: Smooth Streaming Component

```jsx
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

function StreamingResponse({ query }) {
  const [state, setState] = useState({
    stage: 'idle', // idle, streaming, complete, error
    text: '', // Accumulated text
    tools: {
      inProgress: [],
      completed: [],
      failed: [],
    },
    progress: {
      current: 0,
      total: 0,
    },
    message: '',
  });

  useEffect(() => {
    async function startStream() {
      setState(prev => ({ ...prev, stage: 'streaming' }));

      const response = await fetch('http://localhost:3000/mcp/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }]
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const event = JSON.parse(line.slice(6));
            handleEvent(event);
          }
        }
      }
    }

    if (query) {
      startStream();
    }
  }, [query]);

  const handleEvent = (event) => {
    switch (event.type) {
      case 'session_start':
        setState(prev => ({
          ...prev,
          message: event.message,
        }));
        break;

      case 'text_chunk':
        // Use accumulated text for smooth display
        setState(prev => ({
          ...prev,
          text: event.accumulated,
          message: 'Generating response...',
        }));
        break;

      case 'tool_detected':
        setState(prev => ({
          ...prev,
          tools: {
            ...prev.tools,
            inProgress: [...prev.tools.inProgress, event.tool],
          },
          message: event.message,
        }));
        break;

      case 'tools_executing':
        setState(prev => ({
          ...prev,
          progress: {
            current: 0,
            total: event.count,
          },
          message: event.message,
        }));
        break;

      case 'tool_progress':
        setState(prev => {
          const [current, total] = event.progress.split('/').map(Number);
          const newState = { ...prev };

          if (event.status === 'completed') {
            newState.tools.completed = [...prev.tools.completed, event.tool];
            newState.tools.inProgress = prev.tools.inProgress.filter(t => t !== event.tool);
          } else if (event.status === 'error') {
            newState.tools.failed = [...prev.tools.failed, event.tool];
            newState.tools.inProgress = prev.tools.inProgress.filter(t => t !== event.tool);
          }

          newState.progress = { current, total };
          newState.message = event.message;

          return newState;
        });
        break;

      case 'tools_completed':
        setState(prev => ({
          ...prev,
          message: event.message,
        }));
        break;

      case 'iteration_start':
        setState(prev => ({
          ...prev,
          message: event.message,
        }));
        break;

      case 'complete':
        setState(prev => ({
          ...prev,
          stage: 'complete',
          text: event.totalText,
          message: 'Complete',
        }));
        break;

      case 'error':
        setState(prev => ({
          ...prev,
          stage: 'error',
          message: event.error,
        }));
        break;
    }
  };

  return (
    <Card className="p-6">
      {/* Progress Section */}
      {state.stage === 'streaming' && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{state.message}</span>
            {state.progress.total > 0 && (
              <span className="text-gray-500">
                {state.progress.current}/{state.progress.total} tools
              </span>
            )}
          </div>

          {state.progress.total > 0 && (
            <Progress
              value={(state.progress.current / state.progress.total) * 100}
              className="h-2"
            />
          )}

          {/* Tool Status */}
          <div className="flex gap-2 flex-wrap">
            {state.tools.inProgress.map(tool => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                {tool}
              </span>
            ))}
            {state.tools.completed.map(tool => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded text-xs"
              >
                <CheckCircle className="w-3 h-3" />
                {tool}
              </span>
            ))}
            {state.tools.failed.map(tool => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs"
              >
                <AlertCircle className="w-3 h-3" />
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Response Text */}
      <div className="prose prose-sm max-w-none">
        {state.text && (
          <div className="whitespace-pre-wrap">{state.text}</div>
        )}
        {state.stage === 'streaming' && !state.text && (
          <div className="text-gray-400">Waiting for response...</div>
        )}
      </div>

      {/* Complete Indicator */}
      {state.stage === 'complete' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          Response complete
        </div>
      )}

      {/* Error */}
      {state.stage === 'error' && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">
          {state.message}
        </div>
      )}
    </Card>
  );
}
```

---

## Simplified Hook Version

```javascript
// hooks/useSmootStreaming.js
import { useState, useCallback } from 'react';

export function useSmoothStreaming() {
  const [state, setState] = useState({
    text: '',
    stage: 'idle',
    message: '',
    progress: { current: 0, total: 0 },
    tools: { inProgress: [], completed: [], failed: [] },
  });

  const streamQuery = useCallback(async (query) => {
    setState(prev => ({ ...prev, stage: 'streaming', text: '' }));

    const response = await fetch('http://localhost:3000/mcp/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const event = JSON.parse(line.slice(6));

          // Update state based on event
          setState(prev => {
            const newState = { ...prev };

            switch (event.type) {
              case 'text_chunk':
                newState.text = event.accumulated; // Smooth text update
                break;

              case 'tool_progress':
                const [current, total] = event.progress.split('/').map(Number);
                newState.progress = { current, total };
                newState.message = event.message;

                if (event.status === 'completed') {
                  newState.tools.completed = [...prev.tools.completed, event.tool];
                }
                break;

              case 'complete':
                newState.stage = 'complete';
                newState.text = event.totalText;
                break;

              case 'error':
                newState.stage = 'error';
                newState.message = event.error;
                break;

              default:
                if (event.message) {
                  newState.message = event.message;
                }
            }

            return newState;
          });
        }
      }
    }
  }, []);

  return { state, streamQuery };
}

// Usage
function MyComponent() {
  const { state, streamQuery } = useSmoothStreaming();

  return (
    <div>
      <Button onClick={() => streamQuery("Get employees with charts")}>
        Query
      </Button>

      {state.stage === 'streaming' && (
        <div>
          <Progress value={(state.progress.current / state.progress.total) * 100} />
          <p>{state.message}</p>
        </div>
      )}

      <div>{state.text}</div>
    </div>
  );
}
```

---

## Key Benefits

### 1. **No Gaps** ✅
- Every event is sent to client
- `accumulated` text ensures smooth display
- No missing information

### 2. **Grouped Data** ✅
- Related events grouped logically
- Easy to understand what's happening
- Clear progress tracking

### 3. **Real-time Updates** ✅
- Text streams as it's generated
- Tool progress updates live
- Instant feedback

### 4. **Easy to Parse** ✅
- Structured JSON events
- Clear event types
- Predictable format

---

## Event Flow Example

```
Session Start
  ↓
"I'll help you find candidates..."
  ↓
Tool Detected: get_candidates
  ↓
Tools Executing (1 tool)
  ↓
Tool Progress: get_candidates (1/1) - executing
  ↓
Tool Progress: get_candidates (1/1) - completed
  ↓
Tools Completed (1 success, 0 errors)
  ↓
Iteration Start (analyzing results)
  ↓
"Based on the data, here are 15 candidates..."
  ↓
Complete (total text: "I'll help you... Based on the data...")
```

---

## Testing the Stream

```bash
curl -N -X POST http://localhost:3000/mcp/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "give me employees with 5-10% increments"
    }]
  }'
```

You'll see:
```
data: {"type":"session_start","timestamp":"...","message":"Processing your request..."}

data: {"type":"text_chunk","chunk":"I'll","accumulated":"I'll","position":4}

data: {"type":"text_chunk","chunk":" help","accumulated":"I'll help","position":9}

data: {"type":"tool_detected","tool":"get_employees","message":"Preparing to use: get_employees"}

data: {"type":"tools_executing","tools":[...],"count":1,"message":"Executing 1 tool..."}

data: {"type":"tool_progress","tool":"get_employees","status":"executing","progress":"1/1"}

data: {"type":"tool_progress","tool":"get_employees","status":"completed","progress":"1/1","resultPreview":"..."}

data: {"type":"tools_completed","completedCount":1,"errorCount":0}

data: {"type":"text_chunk","chunk":"Based","accumulated":"I'll help. Based"}

data: {"type":"complete","iterations":1,"totalText":"Complete text..."}
```

---

## Summary

Your React app now gets:

✅ **Smooth real-time streaming** - Text accumulates smoothly
✅ **Detailed progress** - Know exactly what's happening
✅ **Tool tracking** - See which tools are running/completed/failed
✅ **No gaps** - Every piece of data sent to client
✅ **Easy to parse** - Structured, grouped events
✅ **Production ready** - Error handling included

The streaming is now **silky smooth** for your users! 🚀
