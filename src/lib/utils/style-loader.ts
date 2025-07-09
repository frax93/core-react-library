export class StyleLoaderService {
  static env =process.env.REACT_APP_MFSHARED_REMOTE_URL;
  static async loadStyles() {
    try {
      await this.loadStylesCss();
      await this.loadStylesJs();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw new Error('Error loading styles');
    }
  }

  private static loadStylesCss(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { head } = document;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => resolve();
      link.onerror = () => reject();
      link.href = `${this.env}/styles.css`;
      head.appendChild(link);
    });
  }

  private static loadStylesJs(): Promise<void> {
    return new Promise((resolve, reject) => {
      const { body } = document;
      const scriptSrc = `${this.env}/scripts.js`;
      // Verifica se uno script con la stessa src esiste già
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

      if (existingScript) {
        // Lo script esiste già, risolvi la Promise immediatamente
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
