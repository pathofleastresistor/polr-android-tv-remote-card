import { html } from "lit";

export const BackIcon = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
            d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
    </svg>
`;

export const HomeIcon = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
            d="M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z" />
    </svg>
`;

export const PowerIcon = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
            d="M479.825-438Q467-438 458.5-446.625T450-468v-346q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T510-814v346q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625ZM480-118q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-478q0-71 28-135.5T226-729q9-9 22.5-9.5T271-730q9 9 7.5 21.5T268-687q-42 42-65 95.5T180-478q0 125.357 87.321 212.679Q354.643-178 480-178t212.679-87.321Q780-352.643 780-478q0-60-22.644-113.804Q734.712-645.609 693-688q-9-9-10-21.5t8-20.5q10-10 23.5-8.5T738-727q49 51 75.5 114.969Q840-548.062 840-478q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-118Z" />
    </svg>
`;

export const VolumeDownIcon = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>volume-minus</title>
        <path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z" />
    </svg>
`;

export const VolumeMuteIcon = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24">
        <title>volume-mute</title>
        <path
            d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
    </svg>
`;

export const VolumeUpIcon = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24">
        <title>volume-plus</title>
        <path
            d="M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z" />
    </svg>
`;
