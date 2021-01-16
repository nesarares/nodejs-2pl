import { LockType, TransactionService } from 'src/services/transaction.service';
import { Utils } from 'src/utils/utils';

export abstract class Transaction {
  protected transactionService: TransactionService = TransactionService.getInstance();

  private locks: { id: string; object: string }[] = [];

  id: string;

  constructor() {
    this.id = Utils.generateId();
  }

  protected abstract doTransaction(): Promise<void>;

  protected async lock(operation: LockType, resource: string) {
    if (this.locks.some((lock) => lock.object === resource)) {
      // This transaction already has a lock on this resource
      return;
    }
    const lockId = await this.transactionService.requestLock(this.id, operation, resource);
    this.locks.push({ id: lockId, object: resource });
  }

  private releaseAllLocks() {
    this.locks.forEach((lock) => {
      this.transactionService.removeLock(lock.id);
    });
    this.locks = [];
  }

  public async run(): Promise<void> {
    try {
      this.transactionService.addTransaction(this.id);
      await this.doTransaction();
      this.releaseAllLocks();
    } catch (error) {
      // Rollback
      // TODO: Implement rollback
      console.error(error);
    }
  }
}
