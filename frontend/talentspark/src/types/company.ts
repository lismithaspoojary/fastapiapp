import type {Job} from "./job";

type Company = {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    jobs: Job[];
};

type CompanyCreatePayload = Omit<Company, "id" | "jobs">;

export type { Company, CompanyCreatePayload };