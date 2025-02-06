import { Injectable } from "@nestjs/common";


@Injectable()
export class MulterService
{
    deleteFiles(files: Object){

        const fs = require("fs");
        const path = require("path");

        Object.values(files).map(
            (file) => {
                fs.unlink(file.url, (error) => {
                    if (error) {
                        throw new Error('Une erreur est survenue lors de la suppression du fichier')
                    }
                })
            }
        )
    }
}