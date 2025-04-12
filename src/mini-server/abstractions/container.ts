type Constructor<T = any> = new (...args: any[]) => T;

export class Container {
  private instances = new Map<string, any>();
  private providers = new Map<string, Constructor>();

  register<T>(token: string, provider: Constructor<T>) {
    this.providers.set(token, provider);
  }

  resolve<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const Provider = this.providers.get(token);
    if (!Provider) {
      throw new Error(`No provider registered for token: ${token}`);
    }

    const instance = new Provider();
    this.instances.set(token, instance);
    return instance;
  }
}
 
export const container = new Container();
