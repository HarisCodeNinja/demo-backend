import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { Request } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env';
import { ToolExecutor } from './toolExecutor';
import { mcpTools } from './tools';

/**
 * Dynamic Report Generator
 * Uses Claude to analyze the prompt and generate comprehensive reports
 */
export class ReportGenerator {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: env.CLAUDE_API_KEY,
    });
  }

  /**
   * Generate a comprehensive report based on natural language prompt
   * Returns report in JSON, Markdown, and PDF formats
   */
  async generateReport(
    prompt: string,
    req: Request
  ): Promise<{
    json: any;
    markdown: string;
    pdf: Buffer;
    metadata: {
      title: string;
      generatedAt: string;
      toolsUsed: string[];
      dataPoints: number;
    };
  }> {
    // Step 1: Use Claude to analyze the prompt and determine what data to fetch
    const planningResponse = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an AI assistant that helps generate HRM reports. Analyze this report request and determine:
1. What data needs to be fetched
2. Which tools should be used
3. What the report title should be
4. What sections the report should have

Available tools:
${mcpTools.map((t) => `- ${t.name}: ${t.description}`).join('\n')}

Report Request: "${prompt}"

Respond in JSON format:
{
  "title": "Report Title",
  "tools": [
    {
      "name": "tool_name",
      "arguments": {...}
    }
  ],
  "sections": ["Section 1", "Section 2", ...],
  "analysisType": "summary|detailed|trend|comparison"
}`,
        },
      ],
    });

    // Extract the planning JSON
    const planningText = (response_text: any) => {
      if (Array.isArray(response_text)) {
        return response_text.find((block: any) => block.type === 'text')?.text || '';
      }
      return '';
    };

    const planText = planningText(planningResponse.content);
    let plan: any;

    try {
      // Extract JSON from response (may be wrapped in markdown code blocks)
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      plan = JSON.parse(jsonMatch ? jsonMatch[0] : planText);
    } catch (error) {
      // Fallback plan if parsing fails
      plan = {
        title: 'HRM Report',
        tools: [
          {
            name: 'get_hyper_insights',
            arguments: { insightType: 'quick_stats' },
          },
        ],
        sections: ['Overview', 'Key Metrics', 'Insights'],
        analysisType: 'summary',
      };
    }

    // Step 2: Execute the planned tools to gather data
    const dataResults: any[] = [];
    const toolsUsed: string[] = [];

    for (const toolCall of plan.tools) {
      try {
        const result = await ToolExecutor.execute(toolCall.name, toolCall.arguments || {}, req);
        dataResults.push({
          tool: toolCall.name,
          data: result.content[0].text ? JSON.parse(result.content[0].text) : result,
        });
        toolsUsed.push(toolCall.name);
      } catch (error: any) {
        dataResults.push({
          tool: toolCall.name,
          data: null,
          error: error.message,
        });
      }
    }

    // Step 3: Use Claude to analyze the data and generate report content
    const reportResponse = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Generate a comprehensive HRM report based on this data:

Title: ${plan.title}
Analysis Type: ${plan.analysisType}
Sections Required: ${plan.sections.join(', ')}

Data Collected:
${JSON.stringify(dataResults, null, 2)}

Create a detailed, professional report with:
1. Executive Summary
2. ${plan.sections.join('\n3. ')}
4. Key Insights and Recommendations
5. Conclusion

Format the response as a structured report with clear headings, bullet points, and data presentation.
Include specific numbers, percentages, and trends from the data.`,
        },
      ],
    });

    const reportContent = planningText(reportResponse.content);

    // Step 4: Count data points
    let dataPointCount = 0;
    dataResults.forEach((result) => {
      if (result.data) {
        if (Array.isArray(result.data)) {
          dataPointCount += result.data.length;
        } else if (result.data.count) {
          dataPointCount += result.data.count;
        } else {
          dataPointCount += 1;
        }
      }
    });

    // Step 5: Generate outputs in different formats
    const jsonReport = {
      metadata: {
        title: plan.title,
        generatedAt: new Date().toISOString(),
        prompt: prompt,
        analysisType: plan.analysisType,
        toolsUsed,
        dataPointCount,
      },
      executiveSummary: this.extractSection(reportContent, 'Executive Summary'),
      sections: plan.sections.map((section: string) => ({
        title: section,
        content: this.extractSection(reportContent, section),
      })),
      keyInsights: this.extractSection(reportContent, 'Key Insights'),
      recommendations: this.extractSection(reportContent, 'Recommendations'),
      rawData: dataResults,
      fullReport: reportContent,
    };

    const markdownReport = this.generateMarkdown(plan.title, reportContent, jsonReport.metadata);
    const pdfBuffer = await this.generatePDF(plan.title, reportContent, jsonReport.metadata);

    return {
      json: jsonReport,
      markdown: markdownReport,
      pdf: pdfBuffer,
      metadata: {
        title: plan.title,
        generatedAt: jsonReport.metadata.generatedAt,
        toolsUsed,
        dataPoints: dataPointCount,
      },
    };
  }

  /**
   * Extract a section from the report content
   */
  private extractSection(content: string, sectionName: string): string {
    const lines = content.split('\n');
    let inSection = false;
    let sectionContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if this is the section header
      if (
        line.toLowerCase().includes(sectionName.toLowerCase()) &&
        (line.startsWith('#') || line.startsWith('##') || line.endsWith(':'))
      ) {
        inSection = true;
        continue;
      }

      // Check if we've hit the next section
      if (
        inSection &&
        (line.startsWith('#') || line.startsWith('##')) &&
        !line.toLowerCase().includes(sectionName.toLowerCase())
      ) {
        break;
      }

      if (inSection && line.trim()) {
        sectionContent.push(line);
      }
    }

    return sectionContent.join('\n').trim() || 'No data available for this section.';
  }

  /**
   * Generate Markdown format
   */
  private generateMarkdown(title: string, content: string, metadata: any): string {
    return `# ${title}

---

**Generated:** ${new Date(metadata.generatedAt).toLocaleString()}
**Tools Used:** ${metadata.toolsUsed.join(', ')}
**Data Points:** ${metadata.dataPointCount}

---

${content}

---

*Report generated by HRM MCP Server with Claude AI*
`;
  }

  /**
   * Generate PDF format
   */
  private async generatePDF(title: string, content: string, metadata: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .text(title, { align: 'center' })
          .moveDown();

        // Metadata
        doc.fontSize(10).font('Helvetica').fillColor('#666666');
        doc.text(`Generated: ${new Date(metadata.generatedAt).toLocaleString()}`, { align: 'center' });
        doc.text(`Tools Used: ${metadata.toolsUsed.join(', ')}`, { align: 'center' });
        doc.text(`Data Points: ${metadata.dataPointCount}`, { align: 'center' });
        doc.moveDown(2);

        // Divider
        doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Content
        doc.fillColor('#000000').fontSize(11).font('Helvetica');

        // Parse content and format
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.startsWith('# ')) {
            doc.fontSize(18).font('Helvetica-Bold').text(line.substring(2)).moveDown(0.5);
          } else if (line.startsWith('## ')) {
            doc.fontSize(14).font('Helvetica-Bold').text(line.substring(3)).moveDown(0.3);
          } else if (line.startsWith('### ')) {
            doc.fontSize(12).font('Helvetica-Bold').text(line.substring(4)).moveDown(0.2);
          } else if (line.startsWith('- ') || line.startsWith('* ')) {
            doc
              .fontSize(11)
              .font('Helvetica')
              .text('• ' + line.substring(2), { indent: 20 });
          } else if (line.startsWith('**') && line.endsWith('**')) {
            doc
              .fontSize(11)
              .font('Helvetica-Bold')
              .text(line.replace(/\*\*/g, ''))
              .moveDown(0.2);
          } else if (line.trim()) {
            doc.fontSize(11).font('Helvetica').text(line).moveDown(0.2);
          } else {
            doc.moveDown(0.3);
          }

          // Add new page if needed
          if (doc.y > 700) {
            doc.addPage();
          }
        }

        // Footer
        doc.moveDown(2);
        doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        doc
          .fontSize(9)
          .fillColor('#666666')
          .text('Report generated by HRM MCP Server with Claude AI', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Quick report generation for specific predefined reports
   */
  async generateQuickReport(
    reportType: string,
    filters: any,
    req: Request
  ): Promise<{
    json: any;
    markdown: string;
    pdf: Buffer;
  }> {
    const reportPrompts: Record<string, string> = {
      headcount: 'Generate a comprehensive headcount report showing employee distribution by department, designation, and location',
      attendance:
        'Generate an attendance report showing attendance rates, late comers, absentee patterns, and trends',
      recruitment:
        'Generate a recruitment report showing job openings, candidate pipeline, interview feedback status, and hiring metrics',
      performance:
        'Generate a performance report showing review status, goal completion, and performance trends',
      leaves: 'Generate a leave report showing pending approvals, leave patterns, and leave balance analysis',
      onboarding:
        'Generate an onboarding report showing new hires, incomplete onboarding items, and onboarding completion rates',
      payroll: 'Generate a payroll summary report showing salary structures, compensation analysis, and payroll statistics',
    };

    const prompt = reportPrompts[reportType] || reportType;
    return this.generateReport(prompt, req);
  }
}

// Export singleton instance
export const reportGenerator = new ReportGenerator();
