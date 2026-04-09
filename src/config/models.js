export const MODELS = [
  {
    id: "deepseek-v3.1:671b-cloud",
    name: "DeepSeek V3.1",
    shortName: "deepseek-v3.1",
    description: "Most advanced & robust reasoning",
    provider: "Cloud",
    recommended: true
  },
  {
    id: "gpt-oss:120b-cloud",
    name: "GPT-OSS 120B",
    shortName: "gpt-oss",
    description: "Fast & capable for most tasks",
    provider: "Cloud"
  },
  {
    id: "glm-5.1:cloud",
    name: "GLM 5.1",
    shortName: "GLM-5.1",
    description: "Advanced reasoning and thinking",
    provider: "Cloud"
  }
];

export const DEFAULT_MODEL = MODELS[0];

export const FEATURE_MODELS = {
  THINKING: "glm-5.1:cloud",
  RESEARCH: "deepseek-v3.1:671b-cloud",
  WEB_SEARCH: "deepseek-v3.1:671b-cloud",
  DEFAULT: "deepseek-v3.1:671b-cloud"
};
