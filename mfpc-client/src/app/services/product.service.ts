import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: Product[] = [
    {
      _id: '1',
      category: 'Beer',
      name: 'O’Hara’s Double IPA',
      price: 20.3,
      imageUrl:
        'https://www.beerstation.ro/wp-content/uploads/2020/12/BS-O_Haras-double-ipa.png',
      description: `Note de biscuite, fructe, ceai. Spuma bej. Finalul este curat, dulceag cu gust pregnant de hamei.
O bere gustoasa si echilibrata cu arome dulci de malt, caramele, nuci.
ABV 7.5%
Volum 500ml`,
    },
    {
      _id: '2',
      category: 'Beer',
      name: 'Scotch Silly',
      price: 15,
      imageUrl:
        'https://www.beerstation.ro/wp-content/uploads/2020/11/BS-Scotch-silly..jpg',
      description: `Una dintre cele mai bune beri Scotch Ales din lume. De când primul război mondial a distrus hameiul în creștere în Belgia, iar armata britanică a avut acces la hameiul din Kent, în Anglia, această bere a fost fabricată de la crearea sa exclusiv cu hameiul Kent.
Simțul gurii catifelate, culoarea roșu-rubiniu mai închis și tonurile de lemn dulce sunt tipice pentru un adevărat Scotch Ale.
Caramel închis la culoare cu un cap de 1,5 cm, cu aspect gros, spumos și de culoare cafeniu deschis, cu o reținere excelentă. Are o aromă dulce și malțoasă cu zahăr brun, uscate și curmale, apoi ceva aproape ca de căpșuni de urmat, apoi caramel pentru a termina.
ABV 8.0%
Culoare : rosie/maronie
Volum 330ml`,
    },
    {
      _id: '3',
      category: 'Beer',
      name: 'Hop Hooligans – Royal Eexecution',
      price: 16,
      imageUrl:
        'https://www.beerstation.ro/wp-content/uploads/2020/11/BS-hop-hooligans-Royal-execution-the-final-cut.jpg',
      description: `Royal Execution The Final Cut este o bere artizanala care ne incanta cu notele de bitterness si miros placut, usor dulceag si o culoare de chihlimbar in pahar.
Alc. 6,5%
Cantitate 500 ml.`,
    },
    {
      _id: '4',
      category: 'Beer',
      name: 'Hop Hooligans – Fluffy Sourpuss Blackcurrant',
      price: 21.5,
      imageUrl:
        'https://www.beerstation.ro/wp-content/uploads/2020/11/124925955_2755925647990339_6856488198554476637_n.jpg',
      description: `Hop Hooligans ne surprind cu un nou Sour cu  coacăze negre suculente și tari și – surpriză, surpriză – o mega-tonă de bezeleeeee🧁🧁🧁
Mustăți dulci și lipicioase garantate.
ABC 5%
Volum 500ml`,
    },
  ];

  constructor() {}

  async getProducts() {
    return this.products;
  }
}
