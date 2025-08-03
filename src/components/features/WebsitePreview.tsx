'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';

interface WebsitePreviewProps {
  html: string;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const viewportSizes = {
  mobile: { width: 375, height: 667, icon: Smartphone },
  tablet: { width: 768, height: 1024, icon: Tablet },
  desktop: { width: 1200, height: 800, icon: Monitor },
};

export function WebsitePreview({ html }: WebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>('desktop');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Create a blob URL for the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    iframe.src = url;
    
    const handleLoad = () => {
      setIsLoading(false);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      URL.revokeObjectURL(url);
    };
  }, [html]);

  const refreshPreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    setIsLoading(true);
    // Force reload by updating src
    const currentSrc = iframe.src;
    iframe.src = '';
    setTimeout(() => {
      iframe.src = currentSrc;
    }, 100);
  };

  const currentSize = viewportSizes[currentViewport];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Responsive Preview
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport Selector */}
          <div className="flex items-center bg-background border border-border rounded-md p-1">
            {Object.entries(viewportSizes).map(([size, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={size}
                  variant={currentViewport === size ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentViewport(size as ViewportSize)}
                  className="p-2"
                  title={`${size.charAt(0).toUpperCase() + size.slice(1)} view`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPreview}
            className="p-2"
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20 overflow-auto">
        <motion.div
          key={currentViewport}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{
            width: Math.min(currentSize.width, window.innerWidth - 100),
            height: Math.min(currentSize.height, window.innerHeight - 200),
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Device Frame for Mobile/Tablet */}
          {currentViewport !== 'desktop' && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl"></div>
              {currentViewport === 'mobile' && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-gray-300 rounded-full"></div>
              )}
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{
              transform: currentViewport === 'mobile' ? 'scale(0.9)' : 'scale(1)',
              transformOrigin: 'top left',
            }}
          />

          {/* Viewport Label */}
          <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono">
            {currentSize.width} × {currentSize.height}
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-muted/30 text-center">
        <p className="text-sm text-muted-foreground">
          Your website is fully responsive and optimized for all devices. 
          <span className="text-primary ml-1">
            Switch between viewports to test different screen sizes.
          </span>
        </p>
      </div>
    </div>
  );
}