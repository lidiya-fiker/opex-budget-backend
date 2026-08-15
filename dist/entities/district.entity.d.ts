import { Branch } from './branch.entity';
export declare class District {
    id: number;
    name: string;
    code: string | null;
    region: string | null;
    branches: Branch[];
}
