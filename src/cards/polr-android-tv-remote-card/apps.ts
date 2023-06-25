import { TemplateResult } from "lit";
import {
    DisneyPlusIcon,
    HuluIcon,
    NetflixIcon,
    PrimeVideoIcon,
    YouTubeIcon,
} from "../../utils/icons";

export interface TvAppInterface {
    url: string;
    icon: TemplateResult;
}

export const DisneyPlusApp: TvAppInterface = {
    url: "https://www.disneyplus.com",
    icon: DisneyPlusIcon,
};

export const NetflixApp: TvAppInterface = {
    url: "https://www.netflix.com/title",
    icon: NetflixIcon,
};

export const PrimeVideoApp: TvAppInterface = {
    url: "https://app.primevideo.com",
    icon: PrimeVideoIcon,
};
