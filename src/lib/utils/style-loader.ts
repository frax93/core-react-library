/**
 * Loads a remote stylesheet (`<baseUrl>/styles.css`) and script
 * (`<baseUrl>/scripts.js`) into the document. The base URL is passed by the
 * consumer, so the service is not coupled to any specific project or
 * environment variable.
 */
export class StyleLoaderService {
  static async loadStyles(baseUrl: string): Promise<void> {
    try {
      await this.loadStylesCss(baseUrl);
      await this.loadStylesJs(baseUrl);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw new Error('Error loading styles');
    }
  }

  private static loadStylesCss(baseUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { head } = document;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => resolve();
      link.onerror = () => reject();
      link.href = `${baseUrl}/styles.css`;
      head.appendChild(link);
    });
  }

  private static loadStylesJs(baseUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { body } = document;
      const scriptSrc = `${baseUrl}/scripts.js`;
      // Skip if a script with the same src is already present.
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

      if (existingScript) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = scriptSrc;
      body.appendChild(script);
      script.onload = () => resolve();
      script.onerror = () => reject();
    });
  }
}
