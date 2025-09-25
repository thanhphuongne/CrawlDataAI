export class TimeZoneConfiguationModel {
    id?: number;
    timeZoneId?: null | string;
    timeDelay?: number;
    isNTP?: boolean;
    ntpServer?: null | string;
    port?: number;
    syncInterval?: number;
}

export class TimeZoneModel {
    id?: null | string;
    hasIanaId?: boolean;
    displayName?: null | string;
    standardName?: null | string;
    daylightName?: null | string;
    baseUtcOffset?: null | string;
    supportsDaylightSavingTime?: boolean;
}
