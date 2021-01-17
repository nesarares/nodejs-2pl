import { ConflictException } from '@nestjs/common';
import * as chalk from 'chalk';
import { LockType, TransactionService } from 'src/services/transaction.service';
import { TimeUtils } from 'src/utils/time.utils';
import { Utils } from 'src/utils/utils';
import { AbortException } from './abort-exception';

export abstract class Transaction {
  protected transactionService: TransactionService = TransactionService.getInstance();

  private locks: { id: string; object: string }[] = [];
  private rollbackOperations: (() => Promise<void>)[] = [];

  id: string;

  constructor() {
    this.id = Utils.generateId();
  }

  protected abstract doTransaction(): Promise<any>;

  protected async lock(operation: LockType, resource: string) {
    const lockId = await this.transactionService.requestLock(this.id, operation, resource);
    if (!this.locks.some((lock) => lock.id === lockId)) {
      this.locks.push({ id: lockId, object: resource });
    }
  }

  protected addRollbackOperation(callback: () => Promise<void>) {
    this.rollbackOperations.push(callback);
  }

  private releaseAllLocks() {
    this.locks.forEach((lock) => {
      this.transactionService.removeLock(lock.id);
    });
    this.locks = [];
  }

  public async run(): Promise<void> {
    let wasAborted = false;
    try {
      this.transactionService.addTransaction(this.id);
      const result = await this.doTransaction();
      return result;
    } catch (error) {
      if (error instanceof AbortException) {
        wasAborted = true;
        // Rollback
        let rollbackOperation;
        let count = 0;
        while ((rollbackOperation = this.rollbackOperations.pop())) {
          await rollbackOperation();
          count++;
        }
        console.log(`[${chalk.green(TimeUtils.nowFormatted)}] [${chalk.cyan(this.id)}] Rolled back ${count} transaction operations`);
        throw new ConflictException('The transaction was aborted. Please try again.');
      } else {
        throw error;
      }
    } finally {
      this.releaseAllLocks();
      if (wasAborted) {
        this.transactionService.abortTransaction(this.id);
      } else {
        this.transactionService.commitTransaction(this.id);
      }
    }
  }
}
