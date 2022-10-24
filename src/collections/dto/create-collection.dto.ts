export class CreateCollectionDto {
    id: number;
    address: string;
    name: string;
    pattern: string;
    description: string;
    network: string;
    logo: string;
    featured: string;
    banner: string;
    createdAt: Date;
    updatedAt: Date;
}