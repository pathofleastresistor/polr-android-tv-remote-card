import { TemplateResult } from "lit";
import {
    BackIcon,
    CenterIcon,
    DisneyPlusIcon,
    DownIcon,
    FavoriteIcon,
    HBOMaxIcon,
    HomeIcon,
    HuluIcon,
    LeftIcon,
    NetflixIcon,
    PowerIcon,
    PrimeVideoIcon,
    RightIcon,
    UpIcon,
    VolumeDownIcon,
    VolumeMuteIcon,
    VolumeUpIcon,
    YouTubeIcon,
} from "./icons";

export interface TvAppInterface {
    url: string;
    icon: TemplateResult;
}

export const DisneyPlusApp: TvAppInterface = {
    url: "https://www.disneyplus.com",
    icon: DisneyPlusIcon,
};

export const HuluApp: TvAppInterface = {
    url: "HULU",
    icon: HuluIcon,
};

export const NetflixApp: TvAppInterface = {
    url: "https://www.netflix.com/title",
    icon: NetflixIcon,
};

export const PrimeVideoApp: TvAppInterface = {
    url: "https://app.primevideo.com",
    icon: PrimeVideoIcon,
};

export const YouTubeApp: TvAppInterface = {
    url: "https://www.youtube.com",
    icon: YouTubeIcon,
};
