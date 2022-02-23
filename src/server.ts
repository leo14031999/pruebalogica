import * as XLSX from 'xlsx';
import * as _ from 'lodash';

const ultimaFechaConAcumulado: string = '4/27/21';
const rutaArchivoDatosCovid: string = './src/assets/covid19.xlsx'

type MuertePorEstado = {
    acumuladoMuertesEstado: number,
    nombreEstado: string,
    poblacionAcumuladoEstado: number,
    porcentajeDeMuertos: number
}

let muertesPorEstado: MuertePorEstado[] = [];

var workBook = XLSX.readFile(rutaArchivoDatosCovid);

let workSheet = workBook.Sheets[workBook.SheetNames[0]];

let workSheetJson = XLSX.utils.sheet_to_json(workSheet);

let FilasAgrupadasPorEstado: any = _.groupBy( workSheetJson, 'Province_State');

let nombresEstados: string[] = Object.keys(FilasAgrupadasPorEstado);

nombresEstados.forEach((nombreEstado: string) => {

    let acumuladoMuertesEstado: number = 0;

    let poblacionAcumuladoEstado: number = 0;

    let porcentajeDeMuertos: number = 0;

    FilasAgrupadasPorEstado[nombreEstado].forEach((filaCiudadDelEstado: any) => {
        
        acumuladoMuertesEstado += filaCiudadDelEstado[ultimaFechaConAcumulado];

        poblacionAcumuladoEstado += filaCiudadDelEstado['Population'];
    
    });

    porcentajeDeMuertos = poblacionAcumuladoEstado != 0 ? acumuladoMuertesEstado * 100 / poblacionAcumuladoEstado : 0;

    muertesPorEstado.push({acumuladoMuertesEstado, nombreEstado, poblacionAcumuladoEstado, porcentajeDeMuertos});

});

const EstadoConMayorAcumulado = _.maxBy(muertesPorEstado, 'acumuladoMuertesEstado'); 
const EstadoConMenorAcumulado = _.minBy(muertesPorEstado, 'acumuladoMuertesEstado'); 
const EstadoMasAfectado = _.maxBy(muertesPorEstado, 'porcentajeDeMuertos'); 

console.log({muertesPorEstado});
console.log({EstadoConMayorAcumulado});
console.log({EstadoConMenorAcumulado});
console.log({EstadoMasAfectado});


/* El estado mas afectado fue New Jersey porque 
fue en definitiva el que tuvo el mayor 
porcentaje registrado con un 28% de acumulado de muertos */

/* El estado con mayor acumulado a la fecha fue california
con un 15% */

/*El estado con menor acumulado a la fecha fue American Samoa
con un 0%  */
