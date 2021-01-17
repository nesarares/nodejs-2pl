import { Utils } from 'src/utils/utils';
import * as chalk from 'chalk';
import { TimeUtils } from 'src/utils/time.utils';
import { AbortException } from 'src/transactions/abort-exception';

enum TransactionStatus {
  active = 'active',
  abort = 'aborted',
  commit = 'committed',
}

export enum LockType {
  read = 'read',
  write = 'write',
}

interface Transaction {
  id: string;
  timestamp: string;
  status: TransactionStatus;
}

interface Lock {
  id: string;
  type: LockType;
  object: string;
  transactionId: string;
}

interface WaitFor {
  id: string;
  lockType: LockType;
  lockObject: string;
  transactionWithLockId: string;
  transactionWaitingLockId: string;

  // Callbacks
  onAvailable: (lockId: string) => void;
  onRejected: () => void;
}

const prefix = (transactionId: string) => {
  return `[${chalk.green(TimeUtils.nowFormatted)}] [${chalk.cyan(transactionId)}]`;
};

export class TransactionService {
  private transactions: Transaction[] = [];
  private locks: Lock[] = [];
  private waitFors: WaitFor[] = [];

  private static instance: TransactionService;
  public static getInstance() {
    if (!this.instance) {
      this.instance = new TransactionService();
    }
    return this.instance;
  }

  private constructor() {
    this.initDeadlockWatcher();
  }

  private displayWaitFors(list = this.waitFors) {
    console.table(
      list.map((wf) => ({
        id: wf.id,
        lockObject: wf.lockObject,
        lockType: wf.lockType,
        transactionWaitingLockId: wf.transactionWaitingLockId,
        transactionWithLockId: wf.transactionWithLockId,
      }))
    );
  }

  private initDeadlockWatcher() {
    setInterval(() => {
      for (const waitFor of this.waitFors) {
        const foundCyclicWaitFor = this.waitFors.find(
          (other) =>
            other.transactionWithLockId === waitFor.transactionWaitingLockId &&
            other.transactionWaitingLockId === waitFor.transactionWithLockId
        );
        if (foundCyclicWaitFor) {
          console.log(`${prefix('DEADLOCK WATCHER')} Found simple cycle found in wait-for graph:`);
          this.displayWaitFors([waitFor, foundCyclicWaitFor]);
          console.log(`${prefix('DEADLOCK WATCHER')} Killing transaction ${foundCyclicWaitFor.transactionWaitingLockId}`);

          // Remove from wait-for list and reject wait for callback
          this.waitFors.splice(this.waitFors.indexOf(foundCyclicWaitFor), 1);
          setTimeout(() => {
            foundCyclicWaitFor.onRejected();
          });
        }
      }
    }, Utils.DEADLOCK_WATCH_INTERVAL);
  }

  private addLock(transactionId: string, type: LockType, object: string) {
    const id = Utils.generateId();
    this.locks.push({ id, type, object, transactionId });
    console.log(`${prefix(transactionId)} Add ${chalk.magenta(type)} lock for ${chalk.yellow(object)}. Locks:`);
    console.table(this.locks);
    return id;
  }

  private canLock(transactionId: string, lockType: LockType, object: string): boolean {
    // Get current locks on this object
    const locksOnObject = this.locks.filter((l) => l.object === object && l.transactionId !== transactionId);
    if (locksOnObject.length > 0) {
      // There is at least one lock on this object
      if (lockType === LockType.read && !locksOnObject.some((lock) => lock.type === LockType.write)) {
        // Check if the requested lock is for read and all active locks are also read locks
        return true;
      } else {
        // Locks are incompatible, need to add to wait for graph
        return false;
      }
    } else {
      // There are no locks on this object, add and return execution
      return true;
    }
  }

  private getBlockingTransactionId(transactionId: string, object: string) {
    // Get the lock that blocks `transactionId` from locking the `object` and return the transactionId of that lock
    return this.locks.filter((l) => l.object === object && l.transactionId !== transactionId)[0].transactionId;
  }

  public addTransaction(transactionId: string) {
    this.transactions.push({
      id: transactionId,
      timestamp: TimeUtils.nowFormatted,
      status: TransactionStatus.active,
    });
    console.log(`${prefix(transactionId)} Starting. Transactions:`);
    console.table(this.transactions);
  }

  public commitTransaction(transactionId: string) {
    const transaction = this.transactions.find((t) => t.id === transactionId);
    if (transaction) {
      transaction.status = TransactionStatus.commit;
      console.log(`${prefix(transactionId)} Commited. Transactions:`);
      console.table(this.transactions);
    }
  }

  public abortTransaction(transactionId: string) {
    const transaction = this.transactions.find((t) => t.id === transactionId);
    if (transaction) {
      transaction.status = TransactionStatus.abort;
      console.log(`${prefix(transactionId)} Aborted. Transactions:`);
      console.table(this.transactions);
    }
  }

  public requestLock(transactionId: string, lockType: LockType, object: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if transaction already has a lock on this object
      const transactionLock = this.locks.find((lock) => lock.transactionId === transactionId && lock.object === object);
      if (transactionLock) {
        // A lock on object from this transaction already exists
        if (lockType === LockType.read || transactionLock.type === LockType.write) {
          // Return existing lock
          resolve(transactionLock.id);
          return;
        }
        // Needs write lock and has a read lock
      }

      if (this.canLock(transactionId, lockType, object)) {
        // Add lock and return execution with lock id
        let lockId;
        if (transactionLock) {
          // Upgrade existing lock from read to write
          transactionLock.type = lockType;
          lockId = transactionLock.id;
          console.log(`${prefix(transactionId)} Upgraded ${chalk.magenta(lockType)} lock for ${chalk.yellow(object)}. Locks:`);
          console.table(this.locks);
        } else {
          lockId = this.addLock(transactionId, lockType, object);
        }
        resolve(lockId);
      } else {
        // Add to wait for graph
        const transactionWithLockId = this.getBlockingTransactionId(transactionId, object);
        this.waitFors.push({
          id: Utils.generateId(),
          lockObject: object,
          lockType,
          transactionWaitingLockId: transactionId,
          transactionWithLockId,
          onAvailable: (lockId: string) => resolve(lockId),
          onRejected: () => reject(new AbortException()),
        });
        console.log(`${prefix(transactionId)} Add ${chalk.magenta(lockType)} wait for ${chalk.yellow(object)}. Wait-for graph:`);
        this.displayWaitFors();
      }
    });
  }

  public removeLock(lockId: string) {
    const lock = this.locks.find((lock) => lock.id === lockId);
    this.locks = this.locks.filter((lock) => lock.id !== lockId);

    console.log(`${prefix(lock.transactionId)} Removed ${chalk.magenta(lock.type)} lock for ${chalk.yellow(lock.object)}. Locks:`);
    console.table(this.locks);

    for (const waitFor of this.waitFors) {
      if (waitFor.lockObject === lock.object && waitFor.transactionWithLockId === lock.transactionId) {
        // Check if we can remove from wait-for graph
        if (this.canLock(waitFor.transactionWaitingLockId, waitFor.lockType, waitFor.lockObject)) {
          // Remove current wait for
          this.waitFors.splice(this.waitFors.indexOf(waitFor), 1);

          console.log(
            `${prefix(waitFor.transactionWaitingLockId)} Removed ${chalk.magenta(waitFor.lockType)} wait-for for ${chalk.yellow(
              waitFor.lockObject
            )}. Wait-for graph:`
          );
          this.displayWaitFors();

          const transactionLock = this.locks.find(
            (lock) => lock.transactionId === waitFor.transactionWaitingLockId && lock.object === waitFor.lockObject
          );
          let newLockId;
          if (transactionLock) {
            // Upgrade existing lock from read to write
            newLockId = transactionLock.id;
            transactionLock.type = waitFor.lockType;
            console.log(
              `${prefix(waitFor.transactionWaitingLockId)} Upgraded ${chalk.magenta(waitFor.lockType)} lock for ${chalk.yellow(
                waitFor.lockObject
              )}. Locks:`
            );
            console.table(this.locks);
          } else {
            // Add the new lock and notify the waiting transaction
            newLockId = this.addLock(waitFor.transactionWaitingLockId, waitFor.lockType, waitFor.lockObject);
          }
          setTimeout(() => {
            // Notify asynchronously, after this function finishes
            waitFor.onAvailable(newLockId);
          });
        } else {
          // Change the transaction with lock from wait-for object
          const transactionWithLockId = this.getBlockingTransactionId(waitFor.transactionWaitingLockId, waitFor.lockObject);
          waitFor.transactionWithLockId = transactionWithLockId;
        }
      }
    }
  }
}
