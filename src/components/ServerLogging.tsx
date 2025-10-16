import { NewRelicLogger } from '@/utils/newrelic-logger';

export async function generateMetadata() {
  // Log page generation
  NewRelicLogger.info('Home page metadata generated', {
    page: '/',
    action: 'generateMetadata'
  });

  return {
    title: 'My App with New Relic',
    description: 'Next.js app with New Relic monitoring and logging'
  };
}

export default async function ServerLogging() {
  // Log server-side rendering
  NewRelicLogger.info('Home page server-side rendering started', {
    page: '/',
    timestamp: new Date().toISOString()
  });

  // Simulate some server-side processing
  const startTime = Date.now();
  
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Log successful processing
    const duration = Date.now() - startTime;
    NewRelicLogger.recordMetric('page.render.home', duration, 'milliseconds');
    
    NewRelicLogger.info('Home page server-side rendering completed', {
      page: '/',
      duration: `${duration}ms`,
      success: true
    });

    // Add custom attributes for this page load
    NewRelicLogger.addAttributes({
      pageType: 'home',
      renderMode: 'server',
      version: '1.0.0'
    });

  } catch (error) {
    NewRelicLogger.error('Home page server-side rendering failed', error as Error, {
      page: '/',
      renderMode: 'server'
    });
  }

  return null; // This is just for server-side logging
}
