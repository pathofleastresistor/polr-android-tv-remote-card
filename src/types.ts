export interface ATVRemoteCardConfig {
    entity_id: string;
    remote: string;
    apps: Array<App> | [];
    power_action: [] | string;
    volume: boolean;
}

export interface App {
    
}

export interface CustomApp extends App {
    icon : string;
    url : string;
}