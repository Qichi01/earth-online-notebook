import type { Provider, ProviderRequest } from "@/lib/provider";
import { openaiCompatibleProvider } from "@/lib/providers/openaiCompatible";

export function getProvider(request: ProviderRequest): Provider {
  switch (request.providerType) {
    case "openai_compatible":
      return openaiCompatibleProvider;
    default:
      return openaiCompatibleProvider;
  }
}
