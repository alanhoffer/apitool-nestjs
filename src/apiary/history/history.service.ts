import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity'; // Ajusta la ruta según tu estructura
import { Apiary } from '../apiary.entity';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History)
        private historyRepository: Repository<History>,
    ) { }

    async logChanges(apiaryFound: Apiary, apiaryUpdate: Partial<Apiary>): Promise<void> {
        const changes = this.findDifferences(apiaryFound, apiaryUpdate);

        for (const change of changes) {
            const historyEntry = new History();
            historyEntry.userId = apiaryFound.userId;
            historyEntry.apiaryId = apiaryFound.id;
            historyEntry.field = change.field;
            historyEntry.previousValue = change.previousValue;
            historyEntry.newValue = change.newValue;

            await this.historyRepository.save(historyEntry);
        }
    }

    private findDifferences(apiaryFound: Apiary, apiaryUpdate: Partial<Apiary>): Array<{ field: string, previousValue: string, newValue: string }> {
        const changes: Array<{ field: string, previousValue: string, newValue: string }> = [];

        console.log(apiaryUpdate, apiaryFound)
        
        for (const key in apiaryUpdate) {
            if (apiaryUpdate.hasOwnProperty(key)) {
                const oldValue = (apiaryFound as any)[key];
                const newValue = apiaryUpdate[key];

                if (oldValue !== newValue) {
                    changes.push({
                        field: key,
                        previousValue: oldValue ? oldValue.toString() : '',
                        newValue: newValue ? newValue.toString() : '',
                    });
                }
            }
        }
        console.log(changes);
        return changes;
    }


}
