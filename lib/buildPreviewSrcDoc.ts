export function buildPreviewSrcDoc(generatedCode: string) {
  // Escape closing script tags AND remove any remaining markdown artifacts
  let safeCode = generatedCode
    .replace(/<\/script>/gi, "<\\/script>")
    .replace(/```(?:tsx|typescript|jsx|javascript|react)?/g, '')
    .trim()

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Preview</title>

  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone@7.23.5/babel.min.js"></script>

  <style>
    html,body,#root{height:100%;margin:0;padding:0;background:#f8fafc}
    #root{padding:16px;overflow:auto}
    .error-container{
      padding:24px;
      background:#fee;
      border:2px solid #fcc;
      border-radius:8px;
      margin:16px;
      font-family:monospace;
      color:#c00;
      white-space:pre-wrap;
      word-break:break-word;
      max-height:80vh;
      overflow:auto;
    }
    .loading-container{
      display:flex;
      align-items:center;
      justify-content:center;
      height:100%;
      font-family:system-ui,-apple-system,sans-serif;
      color:#666;
    }
  </style>
</head>

<body>
  <div id="root">
    <div class="loading-container">
      <div>Loading preview...</div>
    </div>
  </div>

  <!-- Generated code (NO MODULE MODE) -->
  <script type="text/babel">
${safeCode}
  </script>

  <!-- Render after Babel transformation -->
  <script>
    console.log('=== Preview Initialization ===');
    console.log('React available?', !!window.React);
    console.log('ReactDOM available?', !!window.ReactDOM);
    console.log('Babel available?', !!window.Babel);
    
    function renderPreview() {
      try {
        const Comp = window.__PREVIEW_COMPONENT__;
        
        if (!Comp) {
          console.warn('⏳ Preview component not ready yet...');
          return false;
        }

        console.log('✓ Component found:', Comp.name || Comp);
        
        const rootEl = document.getElementById("root");
        
        // Clear loading state
        rootEl.innerHTML = '';
        
        const root = ReactDOM.createRoot(rootEl);
        root.render(React.createElement(Comp));
        
        console.log('✓ Preview rendered successfully');
        return true;
        
      } catch (e) {
        console.error('❌ Preview render error:', e);
        document.getElementById("root").innerHTML = 
          '<div class="error-container">' +
          '<strong>⚠️ Render Error</strong>\\n\\n' +
          '<strong>Message:</strong>\\n' + e.message + '\\n\\n' +
          '<strong>Stack:</strong>\\n' + (e.stack || 'No stack trace available') +
          '</div>';
        return true; // Stop retrying on error
      }
    }

    // Wait for Babel to load and transform
    function waitForBabel() {
      if (!window.Babel || typeof Babel.transformScriptTags !== 'function') {
        console.log('⏳ Waiting for Babel...');
        setTimeout(waitForBabel, 50);
        return;
      }

      console.log('✓ Babel loaded');
      
      // Give a moment for scripts to be parsed
      setTimeout(() => {
        try {
          console.log('🔄 Transforming scripts...');
          Babel.transformScriptTags();
          console.log('✓ Transformation complete');
          
          // Log what's on window after transformation
          setTimeout(() => {
            console.log('Window has __PREVIEW_COMPONENT__?', !!window.__PREVIEW_COMPONENT__);
            if (window.__PREVIEW_COMPONENT__) {
              console.log('Component type:', typeof window.__PREVIEW_COMPONENT__);
            }
          }, 50);
          
        } catch (e) {
          console.error('❌ Babel transformation error:', e);
          document.getElementById("root").innerHTML = 
            '<div class="error-container">' +
            '<strong>⚠️ Compilation Error</strong>\\n\\n' +
            '<strong>Message:</strong>\\n' + e.message + '\\n\\n' +
            'This usually means there is a syntax error in the generated code.' +
            '</div>';
          return;
        }
        
        // Poll for component availability
        let attempts = 0;
        const maxAttempts = 40; // 4 seconds max
        
        function tryRender() {
          if (renderPreview()) {
            return; // Success!
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            console.error('❌ Timeout: Component not found after', attempts, 'attempts');
            
            // Debug info
            const previewKeys = Object.keys(window).filter(k => 
              k.includes('PREVIEW') || k.includes('Component')
            );
            console.log('Keys containing PREVIEW/Component:', previewKeys);
            
            document.getElementById("root").innerHTML = 
              '<div class="error-container">' +
              '<strong>⚠️ Component Not Found</strong>\\n\\n' +
              'The preview component failed to initialize after ' + attempts + ' attempts.\\n\\n' +
              '<strong>Possible causes:</strong>\\n' +
              '• Syntax error in generated code\\n' +
              '• Missing export default statement\\n' +
              '• Preview assignment not executed\\n\\n' +
              '<strong>Debug info:</strong>\\n' +
              'Found window keys: ' + JSON.stringify(previewKeys) + '\\n\\n' +
              'Check the browser console for more details.' +
              '</div>';
            return;
          }
          
          // Faster polling: 100ms intervals
          setTimeout(tryRender, 100);
        }
        
        // Start rendering attempts after a short delay
        setTimeout(tryRender, 150);
        
      }, 100); // Initial delay to ensure DOM is ready
    }

    // Start the process
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForBabel);
    } else {
      waitForBabel();
    }
  </script>
</body>
</html>`
}