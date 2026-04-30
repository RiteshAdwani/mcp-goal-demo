export interface User {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export enum ToolNames {
  CreateUser = "create-user",
  CreateRandomUser = "create-random-user",
}

export enum ResourceNames {
  Users = "users",
  UserDetails = "user-details",
}

export enum PromptNames {
  GenerateFakeUser = "generate-fake-user",
}
