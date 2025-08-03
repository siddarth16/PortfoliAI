'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  html: string;
  css?: string;
  js?: string;
}

export function CodeEditor({ html, css, js }: CodeEditorProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const CodeBlock = ({ code, language, type }: { code: string; language: string; type: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-full"
    >
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {language}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(code, type)}
          className="text-xs"
        >
          {copiedStates[type] ? (
            <Check className="h-3 w-3 mr-1" />
          ) : (
            <Copy className="h-3 w-3 mr-1" />
          )}
          {copiedStates[type] ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      
      <div className="p-0 h-96 overflow-auto">
        <pre className="text-sm leading-relaxed p-4 font-mono">
          <code 
            className="text-foreground"
            dangerouslySetInnerHTML={{ 
              __html: highlightSyntax(code, language.toLowerCase()) 
            }}
          />
        </pre>
      </div>
    </motion.div>
  );

  // Simple syntax highlighting function
  const highlightSyntax = (code: string, language: string) => {
    let highlighted = code;

    if (language === 'html') {
      // HTML tag highlighting
      highlighted = highlighted
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g, 
          '<span style="color: #e06c75;">$1</span><span style="color: #61afef;">$2</span><span style="color: #98c379;">$3</span><span style="color: #e06c75;">$4</span>')
        .replace(/(class|id|href|src|alt|title)=/g, 
          '<span style="color: #d19a66;">$1</span>=')
        .replace(/(".*?")/g, 
          '<span style="color: #98c379;">$1</span>');
    } else if (language === 'css') {
      // CSS highlighting
      highlighted = highlighted
        .replace(/([a-zA-Z-]+)(\s*:)/g, 
          '<span style="color: #e06c75;">$1</span>$2')
        .replace(/(#[a-fA-F0-9]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/g, 
          '<span style="color: #d19a66;">$1</span>')
        .replace(/(\.[a-zA-Z][a-zA-Z0-9-]*|#[a-zA-Z][a-zA-Z0-9-]*)/g, 
          '<span style="color: #61afef;">$1</span>');
    } else if (language === 'javascript') {
      // JavaScript highlighting
      highlighted = highlighted
        .replace(/\b(function|const|let|var|if|else|for|while|return|class|extends)\b/g, 
          '<span style="color: #c678dd;">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, 
          '<span style="color: #d19a66;">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, 
          '<span style="color: #98c379;">$1</span>');
    }

    return highlighted;
  };

  // If CSS and JS are empty (inline in HTML), show only HTML
  const hasMultipleFiles = (css && css.trim()) || (js && js.trim());

  if (!hasMultipleFiles) {
    return (
      <div className="h-full">
        <CodeBlock code={html} language="HTML" type="html" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Tabs defaultValue="html" className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-border">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            {css && css.trim() && <TabsTrigger value="css">CSS</TabsTrigger>}
            {js && js.trim() && <TabsTrigger value="js">JavaScript</TabsTrigger>}
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent value="html" className="h-full m-0">
            <CodeBlock code={html} language="HTML" type="html" />
          </TabsContent>

          {css && css.trim() && (
            <TabsContent value="css" className="h-full m-0">
              <CodeBlock code={css} language="CSS" type="css" />
            </TabsContent>
          )}

          {js && js.trim() && (
            <TabsContent value="js" className="h-full m-0">
              <CodeBlock code={js} language="JavaScript" type="js" />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}