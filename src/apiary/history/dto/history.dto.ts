export class HistoryDTO {

    private _userId:number;
    private _apiaryId: number;
    private _field: string;
    private _previousValue: string;
    private _newValue: string;
    private _changeDate: Date;

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }

    get apiaryId(): number {
        return this._apiaryId;
    }

    set apiaryId(value: number) {
        this._apiaryId = value;
    }

    get field(): string {
        return this._field;
    }

    set field(value: string) {
        this._field = value;
    }

    get previousValue(): string {
        return this._previousValue;
    }

    set previousValue(value: string) {
        this._previousValue = value;
    }

    get newValue(): string {
        return this._newValue;
    }

    set newValue(value: string) {
        this._newValue = value;
    }

    get changeDate(): Date {
        return this._changeDate;
    }

    set changeDate(value: Date) {
        this._changeDate = value;
    }
}