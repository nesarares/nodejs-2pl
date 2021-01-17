import { LockType, TransactionService } from 'src/services/transaction.service';
import { Utils } from 'src/utils/utils';

export abstract class Transaction {
  protected transactionService: TransactionService = TransactionService.getInstance();

  private locks: { id: string; object: string }[] = [];

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
      // Rollback
      // TODO: Implement rollback
      throw error;
    } finally {
      this.releaseAllLocks();
      if (!wasAborted) {
        this.transactionService.commitTransaction(this.id);
      }
    }
  }
}
