export interface ATVRemoteCardConfig {
    entity_id: string;
    remote: string;
    apps: Array<App> | [];
    volume: boolean;
}

export interface App {    
}

export interface CustomApp extends App {
    icon : string;
    url : string;
}

export interface ServiceApp extends App {
    service : string;
    data : {};
}