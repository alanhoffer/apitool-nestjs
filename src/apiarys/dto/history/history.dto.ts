export class HistoryDTO {

    private _userId:number;
    private _apiaryId: number;
    private _nombre_columna: string;
    private _valor_anterior: string;
    private _valor_nuevo: string;
    private _fecha_cambio: Date;

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

    get nombre_columna(): string {
        return this._nombre_columna;
    }

    set nombre_columna(value: string) {
        this._nombre_columna = value;
    }

    get valor_anterior(): string {
        return this._valor_anterior;
    }

    set valor_anterior(value: string) {
        this._valor_anterior = value;
    }

    get valor_nuevo(): string {
        return this._valor_nuevo;
    }

    set valor_nuevo(value: string) {
        this._valor_nuevo = value;
    }

    get fecha_cambio(): Date {
        return this._fecha_cambio;
    }

    set fecha_cambio(value: Date) {
        this._fecha_cambio = value;
    }
}