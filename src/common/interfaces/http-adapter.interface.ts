export interface HtttAdapter{
    get<T>(url:string):Promise<T>;
}