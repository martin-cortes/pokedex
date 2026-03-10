import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpAdapter } from "../interfaces/http.adapter";
import axios, { AxiosInstance } from "axios";


@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private readonly axios: AxiosInstance = axios;

    public async get<T>(url: string): Promise<T> {

        try {

            const { data } = await this.axios.get<T>(url);

            return data;

        } catch (error) {

            throw new InternalServerErrorException("Error consult service http...");

        }
    }
}