import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUser'
})
export class FilterUserPipe implements PipeTransform {

  transform(value: any, filterString: any) {
   
    if(value.length === 0){
      return value;
    } 

    const usuarios = [];
    for(const usuario of value){
      /* Si el segundo apellido NO es nulo(tiene contenido): */
      if(usuario['second_surname']!==null){
        //Se filtra 
        if(usuario['first_name'].includes(filterString)
        ||usuario['area'].includes(filterString)
        ||usuario['position'].includes(filterString)
        ||usuario['first_surname'].includes(filterString)
        ||usuario['second_surname'].includes(filterString)
        ||usuario['number'].includes(filterString)
        ||usuario['email'].includes(filterString)
        ||usuario['name'].includes(filterString) 
        ){
          usuarios.push(usuario);
        }
              
        /* Si el apellido es nulo: */
      }else if(usuario['second_surname']==null){
      //Se filtra todo menos el segundo apellido
        if(  usuario['first_name'].includes(filterString)
      ||usuario['area'].includes(filterString)
      ||usuario['position'].includes(filterString)
      ||usuario['first_surname'].includes(filterString)
      ||usuario['number'].includes(filterString)
      ||usuario['email'].includes(filterString)
      ||usuario['name'].includes(filterString)){
        usuarios.push(usuario);
      }
      /* Si el segundo nombre es nulo: */
    }else if(usuario['second_name']!==null){

      if(usuario['first_name'].includes(filterString)
      ||usuario['area'].includes(filterString)
      ||usuario['position'].includes(filterString)
      ||usuario['first_surname'].includes(filterString)
      ||usuario['second_surname'].includes(filterString)
      ||usuario['number'].includes(filterString)
      ||usuario['email'].includes(filterString)
      ||usuario['name'].includes(filterString) ){
        usuarios.push(usuario);
      }

    }else if(usuario['second_name']!==null && usuario['second_surname']!==null){

      if(usuario['first_name'].includes(filterString)
      ||usuario['area'].includes(filterString)
      ||usuario['position'].includes(filterString)
      ||usuario['first_surname'].includes(filterString)
      ||usuario['number'].includes(filterString)
      ||usuario['email'].includes(filterString)
      ||usuario['name'].includes(filterString)){
        usuarios.push(usuario);
      }
    }
      
    }
    return usuarios;
  }
}
