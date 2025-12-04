/**
 * Query Complexity Analyzer
 * Analyzes user queries to determine complexity and recommend routing
 */

export interface QueryAnalysis {
  complexity: 'low' | 'medium' | 'high';
  score: number; // 1-10
  suggestedMethod: 'claude-desktop' | 'http-api' | 'either';
  estimatedTime: {
    claudeDesktop: string;
    httpApi: string;
  };
  requiresTools: boolean;
  toolsNeeded: string[];
  reasoning: string;
  recommendation: {
    primary: string;
    alternative: string;
    warning?: string;
  };
}

export class QueryAnalyzer {
  private static readonly COMPLEXITY_KEYWORDS = {
    high: {
      keywords: [
        'chart',
        'charts',
        'graph',
        'graphs',
        'visualization',
        'visualize',
        'dashboard',
        'component',
        'ui',
        'interface',
        'generate',
        'create component',
        'shadcn',
        'react',
        'preview',
        'show preview',
        'analyze',
        'analysis',
        'compare',
        'comparison',
        'trends',
        'patterns',
        'multiple',
        'complex',
        'detailed report',
        'comprehensive',
      ],
      weight: 3,
    },
    medium: {
      keywords: [
        'list',
        'show',
        'find',
        'search',
        'get',
        'filter',
        'employees',
        'candidates',
        'departments',
        'reviews',
        'performance',
        'attendance',
        'between',
        'range',
        'last',
        'recent',
      ],
      weight: 2,
    },
    low: {
      keywords: [
        'count',
        'how many',
        'total',
        'number of',
        'status',
        'is',
        'are',
        'what',
        'when',
        'who',
        'simple',
      ],
      weight: 1,
    },
  };

  private static readonly TOOL_PATTERNS = {
    employee_data: ['employee', 'staff', 'worker', 'team member'],
    attendance: ['attendance', 'absence', 'present', 'late', 'leave'],
    recruitment: ['candidate', 'hiring', 'interview', 'job opening', 'recruitment'],
    performance: ['performance', 'review', 'rating', 'goal', 'evaluation'],
    reports: ['report', 'export', 'download', 'generate'],
    database: ['sql', 'query', 'database', 'table', 'schema'],
  };

  /**
   * Analyze a query and return complexity assessment
   */
  static analyze(query: string): QueryAnalysis {
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);

    // Calculate complexity score
    let score = 0;
    const matchedKeywords: string[] = [];

    // Check high complexity keywords
    for (const keyword of this.COMPLEXITY_KEYWORDS.high.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += this.COMPLEXITY_KEYWORDS.high.weight;
        matchedKeywords.push(keyword);
      }
    }

    // Check medium complexity keywords
    for (const keyword of this.COMPLEXITY_KEYWORDS.medium.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += this.COMPLEXITY_KEYWORDS.medium.weight;
        matchedKeywords.push(keyword);
      }
    }

    // Check low complexity keywords
    for (const keyword of this.COMPLEXITY_KEYWORDS.low.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += this.COMPLEXITY_KEYWORDS.low.weight;
        matchedKeywords.push(keyword);
      }
    }

    // Additional complexity factors
    const wordCount = words.length;
    if (wordCount > 20) score += 2;
    if (wordCount > 30) score += 2;

    // Check for multiple conditions (AND, OR, etc.)
    if (lowerQuery.includes(' and ')) score += 1;
    if (lowerQuery.includes(' or ')) score += 1;

    // Normalize score to 1-10
    score = Math.min(10, Math.max(1, Math.round(score)));

    // Determine complexity level
    let complexity: 'low' | 'medium' | 'high';
    if (score <= 3) complexity = 'low';
    else if (score <= 6) complexity = 'medium';
    else complexity = 'high';

    // Identify needed tools
    const toolsNeeded: string[] = [];
    for (const [toolType, patterns] of Object.entries(this.TOOL_PATTERNS)) {
      for (const pattern of patterns) {
        if (lowerQuery.includes(pattern)) {
          toolsNeeded.push(toolType);
          break;
        }
      }
    }

    const requiresTools = toolsNeeded.length > 0;

    // Determine suggested method
    let suggestedMethod: 'claude-desktop' | 'http-api' | 'either';
    if (complexity === 'high') {
      suggestedMethod = 'claude-desktop';
    } else if (complexity === 'low') {
      suggestedMethod = 'http-api';
    } else {
      suggestedMethod = 'either';
    }

    // Estimate times
    const estimatedTime = this.estimateTime(complexity, requiresTools, toolsNeeded.length);

    // Generate reasoning
    const reasoning = this.generateReasoning(complexity, matchedKeywords, toolsNeeded, score);

    // Generate recommendations
    const recommendation = this.generateRecommendation(complexity, suggestedMethod);

    return {
      complexity,
      score,
      suggestedMethod,
      estimatedTime,
      requiresTools,
      toolsNeeded,
      reasoning,
      recommendation,
    };
  }

  private static estimateTime(
    complexity: 'low' | 'medium' | 'high',
    requiresTools: boolean,
    toolCount: number
  ): { claudeDesktop: string; httpApi: string } {
    const baseTime = {
      low: { desktop: 1, http: 3 },
      medium: { desktop: 2, http: 8 },
      high: { desktop: 4, http: 20 },
    };

    const base = baseTime[complexity];
    const toolMultiplier = requiresTools ? 1 + toolCount * 0.3 : 1;

    const desktopTime = Math.round(base.desktop * toolMultiplier);
    const httpTime = Math.round(base.http * toolMultiplier);

    return {
      claudeDesktop: `${desktopTime}-${desktopTime + 2}s`,
      httpApi: `${httpTime}-${httpTime + 10}s`,
    };
  }

  private static generateReasoning(
    complexity: 'low' | 'medium' | 'high',
    matchedKeywords: string[],
    toolsNeeded: string[],
    score: number
  ): string {
    const parts: string[] = [];

    parts.push(`Complexity score: ${score}/10 (${complexity})`);

    if (matchedKeywords.length > 0) {
      parts.push(`Detected keywords: ${matchedKeywords.slice(0, 5).join(', ')}`);
    }

    if (toolsNeeded.length > 0) {
      parts.push(`Requires ${toolsNeeded.length} tool category(ies)`);
    }

    if (complexity === 'high') {
      parts.push('Complex queries benefit from Claude Desktop\'s optimized local execution');
    }

    return parts.join('. ');
  }

  private static generateRecommendation(
    complexity: 'low' | 'medium' | 'high',
    suggestedMethod: 'claude-desktop' | 'http-api' | 'either'
  ): { primary: string; alternative: string; warning?: string } {
    if (complexity === 'high') {
      return {
        primary: 'Claude Desktop (Recommended)',
        alternative: 'HTTP API (Available but slower)',
        warning: 'This query may take 15-30 seconds via HTTP API. Claude Desktop provides 5-10x faster results.',
      };
    }

    if (complexity === 'medium') {
      return {
        primary: 'Either method works well',
        alternative: 'Claude Desktop for faster results',
      };
    }

    return {
      primary: 'HTTP API (Recommended)',
      alternative: 'Claude Desktop also available',
    };
  }

  /**
   * Quick complexity check - returns just the complexity level
   */
  static quickCheck(query: string): 'low' | 'medium' | 'high' {
    return this.analyze(query).complexity;
  }

  /**
   * Check if query should use Claude Desktop
   */
  static shouldUseDesktop(query: string): boolean {
    const analysis = this.analyze(query);
    return analysis.complexity === 'high';
  }

  /**
   * Get configuration for frontend
   */
  static getConfiguration() {
    return {
      complexityLevels: {
        low: {
          description: 'Simple queries with single tool calls',
          examples: ['How many employees?', 'Get employee count', 'Show status'],
          recommendedMethod: 'HTTP API',
        },
        medium: {
          description: 'Multi-step queries with data filtering',
          examples: ['List employees in Engineering', 'Find candidates by skills', 'Show attendance for last month'],
          recommendedMethod: 'Either method',
        },
        high: {
          description: 'Complex analysis, chart generation, or multi-tool queries',
          examples: [
            'Generate chart showing increment analysis',
            'Compare departments and create visualization',
            'Analyze trends and show dashboard',
          ],
          recommendedMethod: 'Claude Desktop',
        },
      },
      keywords: this.COMPLEXITY_KEYWORDS,
      toolPatterns: this.TOOL_PATTERNS,
    };
  }
}
