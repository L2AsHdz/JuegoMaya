import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/model/card';
import { CardService } from 'src/app/service/card.service';
import { DataService } from 'src/app/service/data.service';

@Component({
    selector: 'app-game-grid',
    templateUrl: './game-grid.component.html',
    styleUrls: ['./game-grid.component.css'],
})
export class GameGridComponent implements OnInit {
    tarjetas: string[] = [];
    randomCards: Array<Card>;
    level: number;
    cardInfo: Card;

    constructor(
        private cardService: CardService,
        private dataService: DataService
    ) {}

    ngOnInit(): void {
        this.level = Number.parseInt(localStorage.getItem('level') ?? '0');
        for (let index = 0; index < this.level; index++) {
            this.tarjetas.push('');
        }

        this.randomCards = this.cardService.getRandomCards(this.level);
        console.log(this.randomCards);
        this.eventModal();
    }

    subscribeDataService(validar: boolean) {
        if (validar) {
            let indexCard1 = Number.parseInt(
                localStorage.getItem('cardUp1') ?? ''
            );
            let indexCard2 = Number.parseInt(
                localStorage.getItem('cardUp2') ?? ''
            );

            let card1: Card = this.randomCards[indexCard1];
            let card2: Card = this.randomCards[indexCard2];
            console.log(card1, card2);
            console.log('indices: ', indexCard1, indexCard2);

            setTimeout(() => {
                if (card1.id == card2.id) {
                    this.dataService.updateData({
                        discover: true,
                        idCard: card1.id,
                    });
                    this.cardInfo = card1;
                    console.log('cardmodal:', card1);
                    let parejas = Number.parseInt(
                        localStorage.getItem('parejas') ?? '0'
                    );
                    parejas++;
                    localStorage.setItem('parejas', parejas + '');
                    document.getElementById('btnModalInfo')?.click();
                }
                localStorage.removeItem('cardUp1');
                localStorage.removeItem('cardUp2');
            }, 1000);
        }
    }

    getIndex(i: number, j: number) {
        return this.level * i + j;
    }

    private eventModal() {
        document
            .getElementById('modalInfo')
            ?.addEventListener('hidden.bs.modal', () => {
                if (localStorage.getItem('parejas') == this.level * 2 + '') {
                    localStorage.setItem('started', 'false');
                    localStorage.setItem('win', 'true');
                }
            });
    }
}
