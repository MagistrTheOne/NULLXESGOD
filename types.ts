export enum PricingTier {
    PRO = 'Pro',
    BUSINESS = 'Business',
    ENTERPRISE = 'Enterprise'
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    isAudio?: boolean;
    timestamp: number;
}

export interface ClientCase {
    name: string;
    logo?: string; // URL or placeholder logic
    description: string;
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    };
    maps?: {
        uri: string;
        title: string;
    };
}