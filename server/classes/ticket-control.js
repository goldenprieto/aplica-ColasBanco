const fs = require('fs');

class Ticket{
    constructor(numero,escritorio){
        this.numero =  numero;
        this.escritorio = escritorio;
    }
}


class TicketControl {
    constructor(){
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4= [];


        let data = require('../data/data.json');
        console.log(data);
        
        if( data.hoy === this.hoy){
                this.ultimo     =   data.ultimo;
                this.tickets    =   data.tickets;
                this.ultimos4   =   data.ultimos4;
        }else{
            this.reiniciarConteo();
        }

    }
    siguiente(){
        this.ultimo+=1;
        let ticket = new Ticket(this.ultimo,null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;

    }

    reiniciarConteo(){
       this.ultimo = 0;
       this.tickets=[];
       this.ultimos4 = [];
       console.log('Se ha Inicializado el sistema');

        this.grabarArchivo();
    }

    grabarArchivo(){

        let  jsonData = {
            ultimo  :   this.ultimo,
            hoy     :   this.hoy,
            tickets :   this.tickets,
            ultimos4:   this.ultimos4
        };
        
        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json',jsonDataString);
    }

    getUltimoTicket(){
        return `Ticket ${this.ultimo}`;
    }

    getUltimos4(){
        return this.ultimos4;
    }

    atenderTicket(escritorio){
        if(this.tickets.length === 0){// verifico si hay tickets para atender
            return 'No hay mas tickets';
        }
        let numeroTicket = this.tickets[0].numero; //rompe la realacion de javascrip de lo objs pasados por refe
        this.tickets.shift();//elimina la primer posicion de areglo

        let atenderTicket = new Ticket(numeroTicket,escritorio); //creoel nuevo ticket para atender
        this.ultimos4.unshift(atenderTicket);//agre al inicio del areglo
        if(this.ultimos4.length > 4){//verifica  que solo aya 4  elementos del array
            this.ultimos4.splice(-1,1);//Borra  el ultimo elemento del array
        }
        console.log(this.ultimos4);

        this.grabarArchivo();

        return atenderTicket;
    }
}

module.exports = {
    TicketControl
}