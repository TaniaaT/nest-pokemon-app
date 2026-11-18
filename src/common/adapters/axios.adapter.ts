import axios, { AxiosInstance } from "axios";
import { HtttAdapter } from "../interfaces/http-adapter.interface.js";
import { Injectable } from "@nestjs/common";


@Injectable()
export class AxiosAdapter implements HtttAdapter{
      private  axios:AxiosInstance= axios

    async get<T>(url: string): Promise<T> {
        try{
            const {data}=await this.axios.get<T>(url)
            return data

        }catch(error){
            throw new Error('este es un error')
        }

    }

}