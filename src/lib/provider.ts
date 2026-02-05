export type ProviderType = "openai_compatible";

export type ProviderAuth = {
  header: string;
  prefix?: string;
};

export type ProviderRequest = {
  providerType: ProviderType;
  apiKey: string;
  model: string;
  baseUrl: string;
  path: string;
  auth: ProviderAuth;
};

export type ProviderResult = {
  content: string;
};

export type Provider = {
  generateJson: (prompt: string, request: ProviderRequest) => Promise<ProviderResult>;
};
