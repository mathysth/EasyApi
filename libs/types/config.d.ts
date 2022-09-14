export interface IEasyApiConfig {}

export interface IPlugin {
  name: string;
  origin?: string;
  opts?: Object;
  folder?: string;
  after?: PluginAfterInterface;
}

interface IPluginAfter {
  // Change to fastify plugin type
  plugin?: Function;
}
